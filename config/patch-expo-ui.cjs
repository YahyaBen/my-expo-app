const fs = require('node:fs');
const path = require('node:path');

const supportedVersion = '57.0.21';
const replacements = [
  {
    before:
      "import { clip, fillMaxWidth, padding, Shapes } from '@expo/ui/jetpack-compose/modifiers';",
    after: [
      "import { clip, fillMaxWidth, padding, Shapes } from '@expo/ui/jetpack-compose/modifiers';",
      "import { cloneElement, isValidElement } from 'react';",
      "import { ListItem as UniversalListItem, type ListItemProps } from '../ListItem';",
    ].join('\n'),
  },
  {
    before:
      '            const position = getFieldItemPosition(index, rows.length);\n            return (',
    after: [
      '            const position = getFieldItemPosition(index, rows.length);',
      '            const row = isValidElement<ListItemProps>(child) ? child : undefined;',
      '            const rowType = row?.type as typeof UniversalListItem | undefined;',
      '            // Native ListItem (including wrappers retaining its slots) already owns a cell.',
      '            if (row && rowType?.Leading === UniversalListItem.Leading &&',
      '                rowType.Supporting === UniversalListItem.Supporting &&',
      '                rowType.Trailing === UniversalListItem.Trailing) {',
      '              return (',
      '                <ComposeColumn key={row.key ?? index}',
      '                  modifiers={[fillMaxWidth(), clip(Shapes.RoundedCorner(cornerRadii(position)))]}>',
      '                  {cloneElement(row, {',
      '                    colors: { containerColor: colors.surfaceContainer, ...row.props.colors },',
      '                    modifiers: [fillMaxWidth(), ...(row.props.modifiers ?? [])],',
      '                  })}',
      '                </ComposeColumn>',
      '              );',
      '            }',
      '            return (',
    ].join('\n'),
  },
];

/** Let existing native ListItem rows render once inside Android FieldGroup sections. */
function patchExpoUi(packageRoot = path.dirname(require.resolve('@expo/ui/package.json'))) {
  const metadata = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  if (metadata.name !== '@expo/ui' || metadata.version !== supportedVersion) {
    throw new Error(
      `Expected @expo/ui ${supportedVersion}; found ${metadata.name} ${metadata.version}. Review the FieldGroup row patch before upgrading.`,
    );
  }
  const target = path.join(packageRoot, 'src/universal/FieldGroup/FieldSection.android.tsx');
  const original = fs.readFileSync(target, 'utf8');
  const newline = original.includes('\r\n') ? '\r\n' : '\n';
  let source = original.replace(/\r\n/g, '\n');
  for (const { before, after } of replacements) {
    if (source.split(after).length - 1 === 1) continue;
    if (source.split(before).length - 1 !== 1) {
      throw new Error('Unexpected Expo UI FieldSection source; no files changed.');
    }
    source = source.replace(before, after);
  }
  const patched = source.replace(/\n/g, newline);
  if (patched === original) return false;
  fs.writeFileSync(target, patched, 'utf8');
  return true;
}

module.exports = { patchExpoUi };

if (require.main === module) {
  try {
    console.log(
      `[expo-ui patch] ${patchExpoUi() ? 'Applied FieldGroup native row support.' : 'FieldGroup native row support is already applied.'}`,
    );
  } catch (error) {
    console.error(`[expo-ui patch] ${error.message}`);
    process.exitCode = 1;
  }
}
