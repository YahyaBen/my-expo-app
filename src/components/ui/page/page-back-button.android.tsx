import { useTranslation } from 'react-i18next';
import { IconButton } from '@expo/ui/jetpack-compose';
import { semantics, size, testID } from '@expo/ui/jetpack-compose/modifiers';
import type { PageBackButtonProps } from './page-back-button.types';
import { PAGE_HEADER_MIN_HEIGHT } from './page-header-layout';
import { useHostLayoutDirection } from '../host/universal-host';
import { Icon } from '../icon/icon';

export function PageBackButton({ color, onPress }: Readonly<PageBackButtonProps>) {
  const { t } = useTranslation();
  const direction = useHostLayoutDirection();
  return (
    <IconButton
      onClick={onPress}
      modifiers={[
        size(PAGE_HEADER_MIN_HEIGHT, PAGE_HEADER_MIN_HEIGHT),
        semantics({ contentDescription: t('common.goBack') }),
        testID('page-back'),
      ]}
    >
      <Icon
        name={{
          ios: direction === 'rightToLeft' ? 'arrow.right' : 'arrow.left',
          android: direction === 'rightToLeft' ? 'arrow_forward' : 'arrow_back',
        }}
        size={24}
        color={color}
      />
    </IconButton>
  );
}
