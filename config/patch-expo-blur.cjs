const fs = require('node:fs');
const path = require('node:path');

const supportedVersion = '57.0.3';
const patches = [
  {
    file: 'android/src/main/java/expo/modules/blur/enums/TintStyle.kt',
    replacements: [
      {
        before: 'enum class TintStyle(val value: String) : Enumerable {\n  DEFAULT("default"),',
        after:
          'enum class TintStyle(val value: String) : Enumerable {\n  TRANSPARENT("transparent"),\n  DEFAULT("default"),',
        marker: 'TRANSPARENT("transparent")',
      },
      {
        before:
          '  fun toBlurEffect(blurRadius: Float): Int {\n    return when (this) {\n      EXTRA_LIGHT,',
        after:
          '  fun toBlurEffect(blurRadius: Float): Int {\n    return when (this) {\n      TRANSPARENT -> 0\n\n      EXTRA_LIGHT,',
        marker: 'TRANSPARENT -> 0',
      },
    ],
  },
  {
    file: 'android/src/main/java/expo/modules/blur/BlurModule.kt',
    replacements: [
      {
        before: '    Name("ExpoBlur")\n\n    View(ExpoBlurView::class) {',
        after:
          '    Name("ExpoBlur")\n\n    Constant("supportsTransparentTint") { true }\n\n    View(ExpoBlurView::class) {',
        marker: 'supportsTransparentTint',
      },
    ],
  },
];

const occurrences = (source, value) => source.split(value).length - 1;

/** Extend only the verified Android tint conversion; keep Expo's live target implementation. */
function patchExpoBlur(packageRoot = path.dirname(require.resolve('expo-blur/package.json'))) {
  const metadata = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  if (metadata.name !== 'expo-blur' || metadata.version !== supportedVersion) {
    throw new Error(
      `Expected expo-blur ${supportedVersion}; found ${metadata.name} ${metadata.version}. Review the Android transparent-tint patch before upgrading.`,
    );
  }

  // Validate every file and anchor before modifying either native source file.
  const plans = patches.map(({ file, replacements }) => {
    const target = path.join(packageRoot, file);
    const original = fs.readFileSync(target, 'utf8');
    const newline = original.includes('\r\n') ? '\r\n' : '\n';
    let source = original.replace(/\r\n/g, '\n');
    for (const { before, after, marker } of replacements) {
      const beforeCount = occurrences(source, before);
      const afterCount = occurrences(source, after);
      if (beforeCount === 1 && afterCount === 0 && occurrences(source, marker) === 0) {
        source = source.replace(before, after);
      } else if (beforeCount !== 0 || afterCount !== 1 || occurrences(source, marker) !== 1) {
        throw new Error(`Unexpected expo-blur source in ${file} (${marker}); no files changed.`);
      }
    }
    const patched = source.replace(/\n/g, newline);
    return { file, target, original, patched };
  });

  const changed = plans.filter(({ original, patched }) => original !== patched);
  for (const { target, patched } of changed) fs.writeFileSync(target, patched, 'utf8');
  return changed.map(({ file }) => file);
}

module.exports = { patchExpoBlur };

if (require.main === module) {
  try {
    const changed = patchExpoBlur();
    console.log(
      `[expo-blur patch] ${changed.length ? 'Applied Android transparent tint support.' : 'Android transparent tint support is already applied.'}`,
    );
  } catch (error) {
    console.error(`[expo-blur patch] ${error.message}`);
    process.exitCode = 1;
  }
}
