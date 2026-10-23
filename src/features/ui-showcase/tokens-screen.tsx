import { spacing, radii } from '@/constants/layout';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  PageScreen,
  Row,
  TextInput,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
  type UniversalTextVariant,
} from '@components/ui';
import { useAppTheme } from '@/hooks/use-theme';
import { themes } from '@/constants/themes/index';
import { DemoSection } from './demo-section';

const typographyVariants = [
  'heading',
  'title',
  'subtitle',
  'body',
  'label',
  'caption',
] as const satisfies readonly UniversalTextVariant[];

export default function TokensScreen() {
  const { t } = useTranslation();
  const { colors, design, themeId, scheme } = useAppTheme();
  return (
    <PageScreen
      title={t('showcase.tokens')}
      description={t('showcase.tokenDescription', {
        theme: themes[themeId].label,
        mode: t(`appearance.${scheme}`),
      })}
    >
      <DemoSection
        title={t('showcase.tokenGallery.controls')}
        hint={t('showcase.tokenGallery.controlsHint')}
      >
        <TokenControlPreview />
      </DemoSection>
      <DemoSection title={t('showcase.gallery.typography')}>
        {typographyVariants.map((variant) => (
          <Column key={variant} spacing={spacing.xs} modifiers={nativeFillWidth}>
            <Text variant={variant} testID={`demo-tokens-type-${variant}`}>
              {t(`showcase.gallery.variants.${variant}`)}
            </Text>
            <Text variant="caption" tone="muted">
              {t('showcase.tokenGallery.typeValue', {
                size: design.typography[variant].fontSize,
                weight: design.typography[variant].fontWeight,
              })}
            </Text>
          </Column>
        ))}
      </DemoSection>
      <DemoSection
        title={t('showcase.tokenGallery.shapes')}
        hint={t('showcase.tokenGallery.shapesHint')}
      >
        <TokenValue
          name={t('showcase.tokenGallery.buttonRadius')}
          value={
            design.shape.buttonRadius === undefined
              ? t('showcase.tokenGallery.nativeDefault')
              : String(design.shape.buttonRadius)
          }
          testID="demo-tokens-button-radius"
        />
        <TokenValue
          name={t('showcase.tokenGallery.inputRadius')}
          value={String(design.shape.inputRadius)}
          testID="demo-tokens-input-radius"
        />
      </DemoSection>
      <DemoSection
        title={t('showcase.tokenGallery.spacing')}
        hint={t('showcase.tokenGallery.spacingHint')}
      >
        {Object.entries(spacing).map(([name, value]) => (
          <TokenValue key={name} name={name} value={String(value)} />
        ))}
      </DemoSection>
      <DemoSection title={t('showcase.tokenGallery.colors')}>
        {Object.entries(colors).map(([role, value]) => (
          <Row key={role} spacing={spacing.md} alignment="center" modifiers={nativeFillWidth}>
            <Column
              style={{
                width: 28,
                height: 28,
                backgroundColor: value,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radii.sm,
              }}
            />
            <Column spacing={spacing.xs} modifiers={nativeRowWeight}>
              <Text>{role}</Text>
              <Text variant="caption">{value}</Text>
            </Column>
          </Row>
        ))}
      </DemoSection>
    </PageScreen>
  );
}

/** These controls reuse PageScreen's Host and keep their draft/count local. */
function TokenControlPreview() {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [presses, setPresses] = useState(0);
  const countAction = () => setPresses((count) => count + 1);
  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <UniversalButtonContent
        variant="primary"
        label={t('showcase.gallery.primaryAction')}
        fullWidth
        onPress={countAction}
        testID="demo-tokens-primary"
      />
      <UniversalButtonContent
        variant="secondary"
        label={t('showcase.tokenGallery.secondaryAction')}
        fullWidth
        onPress={countAction}
        testID="demo-tokens-secondary"
      />
      <UniversalButtonContent
        variant="link"
        label={t('showcase.tokenGallery.linkAction')}
        onPress={countAction}
        testID="demo-tokens-link"
      />
      <UniversalButtonContent
        variant="primary"
        label={t('showcase.disabledAction')}
        disabled
        fullWidth
        onPress={countAction}
        testID="demo-tokens-disabled"
      />
      <UniversalButtonContent
        variant="secondary"
        label={t('showcase.buttonGallery.square')}
        borderRadius={0}
        fullWidth
        onPress={countAction}
        testID="demo-tokens-square"
      />
      <Text testID="demo-tokens-presses">{t('showcase.actions', { count: presses })}</Text>
      <TextInput
        label={t('showcase.tokenGallery.inputLabel')}
        placeholder={t('showcase.tokenGallery.inputPlaceholder')}
        helperText={t('showcase.tokenGallery.inputHint')}
        value={value}
        onChangeText={setValue}
        testID="demo-tokens-input"
      />
      <Text variant="caption" tone="muted" testID="demo-tokens-input-value">
        {t('showcase.draftValue', { value })}
      </Text>
      <UniversalButtonContent
        variant="link"
        label={t('showcase.tokenGallery.reset')}
        onPress={() => {
          setValue('');
          setPresses(0);
        }}
        testID="demo-tokens-reset"
      />
    </Column>
  );
}

function TokenValue({ name, value, testID }: { name: string; value: string; testID?: string }) {
  return (
    <Row spacing={spacing.md} alignment="center" modifiers={nativeFillWidth} testID={testID}>
      <Column modifiers={nativeRowWeight}>
        <Text>{name}</Text>
      </Column>
      <Text variant="caption" tone="muted">
        {value}
      </Text>
    </Row>
  );
}
