import { Column } from '@expo/ui';
import { ColorSchemeCanvas } from './color-scheme-canvas';
import { Switch } from '../switch/switch';
import { nativeFillWidth } from '../native/native-fill-width';
import { spacing } from '@/constants/layout';

export type ThemeCanvasProps = {
  colorScheme: 'light' | 'dark';
  onColorSchemeChange: (colorScheme: 'light' | 'dark') => void;
  label: string;
  disabled?: boolean;
  height?: number;
  testID?: string;
};

/** Controlled native content: the caller owns labels, appearance and persistence. */
export function ThemeCanvas({
  colorScheme,
  onColorSchemeChange,
  label,
  disabled = false,
  height = 160,
  testID = 'theme-canvas',
}: ThemeCanvasProps) {
  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={testID}>
      <Switch
        label={label}
        value={colorScheme === 'dark'}
        onValueChange={(enabled) => onColorSchemeChange(enabled ? 'dark' : 'light')}
        disabled={disabled}
        testID={`${testID}-switch`}
      />
      <ColorSchemeCanvas colorScheme={colorScheme} height={height} testID={`${testID}-artwork`} />
    </Column>
  );
}
