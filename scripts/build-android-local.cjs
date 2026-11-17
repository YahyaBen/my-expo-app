/* global __dirname */
const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');
const { createInterface } = require('node:readline');
const { parseArgs } = require('node:util');

const projectRoot = path.resolve(__dirname, '..');
const { values } = parseArgs({
  options: {
    credentials: { type: 'string' },
    keystore: { type: 'string' },
    output: { type: 'string' },
    'reuse-native': { type: 'boolean', default: false },
  },
});

async function main() {
  if (!values.credentials || !values.keystore || !values.output) {
    throw new Error('Required options: --credentials <markdown> --keystore <jks> --output <aab>.');
  }
  const credentials = fs.readFileSync(path.resolve(values.credentials), 'utf8');
  function field(label) {
    const prefix = `- ${label}:`;
    const line = credentials.split(/\r?\n/).find((entry) => entry.trimStart().startsWith(prefix));
    const value = line
      ?.slice(line.indexOf(':') + 1)
      .trim()
      .replace(/^`(.*)`$/, '$1');
    if (!value) throw new Error(`Missing credential field: ${label}.`);
    return value;
  }
  const keystore = path.resolve(values.keystore);
  if (!fs.statSync(keystore).isFile()) throw new Error('Keystore is not a file.');
  const output = path.resolve(values.output);
  if (path.extname(output) !== '.aab') throw new Error('Output must be an .aab file.');
  if (fs.existsSync(output)) throw new Error('Output already exists; select a new artifact path.');

  const expoRequire = createRequire(require.resolve('expo/package.json'));
  const localEnv = expoRequire('@expo/env').parseProjectEnv(projectRoot, {
    mode: 'production',
    silent: true,
  }).env;
  const env = {
    ...localEnv,
    ...process.env,
    APP_VARIANT: 'production',
    NODE_ENV: 'production',
    LOCAL_ANDROID_RELEASE: '1',
    LOCAL_ANDROID_KEYSTORE_PATH: keystore,
    LOCAL_ANDROID_KEYSTORE_PASSWORD: field('Android upload keystore password'),
    LOCAL_ANDROID_KEY_ALIAS: field('Android key alias'),
    LOCAL_ANDROID_KEY_PASSWORD: field('Android key password'),
  };
  const javaHome = env.JAVA_HOME;
  if (!javaHome) throw new Error('Set JAVA_HOME to the installed Android-compatible JDK.');
  const bin = (name) =>
    path.join(javaHome, 'bin', process.platform === 'win32' ? `${name}.exe` : name);
  const secrets = [env.LOCAL_ANDROID_KEYSTORE_PASSWORD, env.LOCAL_ANDROID_KEY_PASSWORD];
  const redact = (value) =>
    secrets.reduce((text, secret) => text.replaceAll(secret, '[redacted]'), value);
  const signingCheck = spawnSync(
    bin('keytool'),
    [
      '-list',
      '-keystore',
      keystore,
      '-alias',
      env.LOCAL_ANDROID_KEY_ALIAS,
      '-storepass:env',
      'LOCAL_ANDROID_KEYSTORE_PASSWORD',
    ],
    { env, encoding: 'utf8' },
  );
  if (signingCheck.status !== 0) throw new Error('Unable to open the supplied keystore and alias.');
  console.log('Signing keystore and alias verified.');

  function certificate(args) {
    const result = spawnSync(bin('keytool'), args, { env, encoding: 'utf8' });
    const encoded = result.stdout?.match(
      /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/,
    )?.[1];
    if (result.status !== 0 || !encoded) throw new Error('Unable to read signing certificate.');
    return Buffer.from(encoded.replace(/\s/g, ''), 'base64');
  }
  const uploadCertificate = certificate([
    '-exportcert',
    '-rfc',
    '-keystore',
    keystore,
    '-alias',
    env.LOCAL_ANDROID_KEY_ALIAS,
    '-storepass:env',
    'LOCAL_ANDROID_KEYSTORE_PASSWORD',
  ]);

  const logDirectory = path.join(projectRoot, '.expo', 'local-release');
  fs.mkdirSync(logDirectory, { recursive: true });
  const log = fs.createWriteStream(path.join(logDirectory, 'build.log'));
  async function run(command, args, cwd = projectRoot) {
    await new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd,
        env,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      for (const stream of [child.stdout, child.stderr]) {
        const lines = createInterface({ input: stream });
        lines.on('line', (line) => {
          const safe = redact(line);
          log.write(`${safe}\n`);
          console.log(safe);
        });
      }
      child.on('error', reject);
      child.on('close', (code) =>
        code === 0 ? resolve() : reject(new Error(`Build step exited with code ${code}.`)),
      );
    });
  }
  let buildDrive;
  try {
    if (process.platform === 'win32') {
      for (const letter of 'ZYXWVUTSRQPONMLKJIHGFED') {
        const drive = `${letter}:`;
        if (fs.existsSync(`${drive}\\`)) continue;
        const linked = spawnSync('subst.exe', [drive, projectRoot], {
          encoding: 'utf8',
          windowsHide: true,
        });
        if (linked.status === 0) {
          buildDrive = drive;
          break;
        }
      }
      if (!buildDrive)
        throw new Error('No free virtual drive is available for the short C++ build path.');
      env.LOCAL_ANDROID_CXX_DIRECTORY = path.win32.join(`${buildDrive}\\`, '.expo', 'cx');
      console.log(`Using ${buildDrive} for the local C++ build path.`);
    }
    const expoPackage = require.resolve('expo/package.json');
    const cli = path.resolve(path.dirname(expoPackage), require(expoPackage).bin.expo);
    if (values['reuse-native']) {
      // Retry only the local release Gradle mods, preserving already compiled native files.
      const { compileModsAsync } = require('expo/config-plugins');
      const withLocalRelease = require('../config/with-local-android-release');
      const config = withLocalRelease(
        JSON.parse(fs.readFileSync(path.join(projectRoot, 'app.json'), 'utf8')).expo,
      );
      await compileModsAsync(config, { projectRoot, platforms: ['android'] });
      console.log('Applied local release config plugin to the existing Android project.');
    } else {
      await run(process.execPath, [cli, 'prebuild', '--platform', 'android', '--no-install']);
    }
    const androidRoot = path.join(projectRoot, 'android');
    const gradleArgs = [
      // Environment values are inlined by Metro and are not tracked by Gradle's cache.
      ':app:createBundleReleaseJsAndAssets',
      '--rerun',
      ':app:bundleRelease',
      '--no-daemon',
      '--max-workers=1',
      '--no-parallel',
      '--console=plain',
    ];
    if (process.platform === 'win32') {
      await run(
        process.env.ComSpec || 'cmd.exe',
        ['/d', '/c', 'gradlew.bat', ...gradleArgs],
        androidRoot,
      );
    } else {
      await run(path.join(androidRoot, 'gradlew'), gradleArgs, androidRoot);
    }
    const bundle = path.join(
      androidRoot,
      'app',
      'build',
      'outputs',
      'bundle',
      'release',
      'app-release.aab',
    );
    await run(bin('jarsigner'), ['-verify', bundle]);
    const bundleCertificate = certificate(['-printcert', '-rfc', '-jarfile', bundle]);
    if (!uploadCertificate.equals(bundleCertificate))
      throw new Error('Bundle signing certificate does not match the supplied upload key.');
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(bundle, output, fs.constants.COPYFILE_EXCL);
    console.log(`Signed Android App Bundle: ${output}`);
  } finally {
    log.end();
    if (buildDrive) {
      const mappings = spawnSync('subst.exe', [], { encoding: 'utf8', windowsHide: true });
      const stillOwned = mappings.stdout?.split(/\r?\n/).some((line) => {
        const [drive, target] = line.split('=>');
        return (
          drive?.trim().startsWith(buildDrive) &&
          target &&
          path.resolve(target.trim()).toLowerCase() === projectRoot.toLowerCase()
        );
      });
      if (stillOwned) spawnSync('subst.exe', [buildDrive, '/d'], { windowsHide: true });
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
