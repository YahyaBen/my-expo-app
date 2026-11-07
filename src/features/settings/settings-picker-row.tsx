import { spacing } from '@/constants/layout';
import {
  Column,
  nativeFillWidth,
  nativeRowWeight,
  Row,
  UniversalTextContent as Text,
} from '@components/ui';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';

export function SettingsPickerRow({
  label,
  stacked,
  children,
}: Readonly<{ label: string; stacked: boolean; children: ReactNode }>) {
  if (stacked) {
    return (
      <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
        <Text>{label}</Text>
        {children}
      </Column>
    );
  }

  const isAndroid = Platform.OS === 'android';
  return (
    <Row alignment="center" spacing={spacing.lg} modifiers={nativeFillWidth}>
      <Column modifiers={isAndroid ? nativeRowWeight : nativeFillWidth}>
        <Text>{label}</Text>
      </Column>
      {isAndroid ? <Column modifiers={nativeRowWeight}>{children}</Column> : children}
    </Row>
  );
}
