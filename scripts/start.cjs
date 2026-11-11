const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);

const result = spawnSync(
  process.execPath,
  [require.resolve('expo/bin/cli'), 'start', '--dev-client', '--clear', ...args],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      APP_VARIANT: 'development',
    },
  },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
