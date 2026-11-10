import {
  ButtonContent,
  Column,
  UniversalTextContent as Text,
  nativeFillWidth,
  type ButtonVariant,
} from '@components/ui';
import { useTranslation } from 'react-i18next';
import { spacing } from '@/constants/layout';
import { GoogleButtonExamples } from './google-button-examples';

const groups = [
  { id: 'semantic', variants: ['success', 'warning', 'info', 'destructive'] },
  { id: 'variants', variants: ['primary', 'secondary', 'tertiary', 'link', 'glass'] },
] as const satisfies readonly { id: string; variants: readonly ButtonVariant[] }[];

/** Focused examples share the page's native Host and action counter. */
export function ButtonExamples({
  onPress,
  testIDPrefix = 'component-button',
}: Readonly<{ onPress: () => void; testIDPrefix?: string }>) {
  const { t } = useTranslation();

  return (
    <Column spacing={spacing.xl} modifiers={nativeFillWidth}>
      <GoogleButtonExamples onPress={onPress} />
      {groups.map(({ id, variants }) => (
        <Column key={id} spacing={spacing.md} modifiers={nativeFillWidth}>
          <Text variant="subtitle">{t(`componentCatalog.buttons.${id}`)}</Text>
          <Text variant="caption" tone="muted">
            {t(`componentCatalog.buttons.${id}Hint`)}
          </Text>
          {variants.map((variant) => (
            <ButtonContent
              key={variant}
              variant={variant}
              label={t(`showcase.${variant}`)}
              fullWidth
              onPress={onPress}
              testID={
                variant === 'primary' && testIDPrefix === 'component-button'
                  ? 'component-button'
                  : `${testIDPrefix}-${variant}`
              }
            />
          ))}
        </Column>
      ))}
      <Column spacing={spacing.md} modifiers={nativeFillWidth}>
        <Text variant="subtitle">{t('componentCatalog.buttons.sizes')}</Text>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.buttons.sizesHint')}
        </Text>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <ButtonContent
            key={size}
            variant="primary"
            size={size}
            label={t(`showcase.buttonGallery.sizes.${size}`)}
            onPress={onPress}
            testID={`${testIDPrefix}-primary-${size}`}
          />
        ))}
      </Column>
    </Column>
  );
}
