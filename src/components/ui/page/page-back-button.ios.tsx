import { useTranslation } from 'react-i18next';
import { Button } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  buttonStyle,
  contentShape,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import type { PageBackButtonProps } from './page-back-button.types';
import { PAGE_HEADER_MIN_HEIGHT } from './page-header-layout';
import { useHostLayoutDirection } from '../host/universal-host';
import { Icon } from '../icon/icon';

export function PageBackButton({ color, onPress }: Readonly<PageBackButtonProps>) {
  const { t } = useTranslation();
  const direction = useHostLayoutDirection();
  return (
    <Button
      testID="page-back"
      onPress={onPress}
      modifiers={[buttonStyle('plain'), accessibilityLabel(t('common.goBack'))]}
    >
      <Icon
        name={{
          ios: direction === 'rightToLeft' ? 'arrow.right' : 'arrow.left',
          android: direction === 'rightToLeft' ? 'arrow_forward' : 'arrow_back',
        }}
        size={24}
        color={color}
        modifiers={[
          frame({ width: PAGE_HEADER_MIN_HEIGHT, height: PAGE_HEADER_MIN_HEIGHT }),
          contentShape(shapes.rectangle()),
        ]}
      />
    </Button>
  );
}
