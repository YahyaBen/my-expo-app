import {
  ButtonContent,
  Checkbox,
  Column,
  FormSubmit,
  FormTextInput,
  Icon,
  Picker,
  Row,
  SegmentedControl,
  Switch,
  TextInput,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { spacing } from '@/constants/layout';
import {
  emptyProfileExample,
  profileExampleSchema,
  type ProfileExampleValues,
} from './form-example.schema';

type ProfilePreview = Pick<ProfileExampleValues, 'name' | 'email' | 'bio' | 'role' | 'updates'>;
const roles = ['design', 'engineering', 'other'] as const;

export function FormExamples() {
  const { t } = useTranslation();
  const [view, setView] = useState('form');
  const [preview, setPreview] = useState<ProfilePreview | null>(null);
  // Keep the draft when switching to the independent visual state examples.
  const form = useForm<ProfileExampleValues>({
    resolver: zodResolver(profileExampleSchema),
    defaultValues: emptyProfileExample,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
  const clearPreview = () => setPreview(null);
  const submit = form.handleSubmit(({ name, email, bio, role, updates }) => {
    Keyboard.dismiss();
    setPreview({ name, email, bio, role, updates });
  });

  return (
    <Column spacing={spacing.xl} modifiers={nativeFillWidth}>
      <SegmentedControl
        label={t('componentCatalog.forms.examples')}
        selectedValue={view}
        onValueChange={(value) => {
          Keyboard.dismiss();
          setView(value);
        }}
        options={[
          {
            value: 'form',
            label: t('componentCatalog.forms.liveForm'),
            testID: 'component-form-tab',
          },
          {
            value: 'states',
            label: t('componentCatalog.forms.fieldStates'),
            testID: 'component-form-states-tab',
          },
        ]}
      />
      {view === 'states' ? (
        <FieldStateExamples />
      ) : (
        <>
          <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
            <Text variant="heading">{t('componentCatalog.forms.title')}</Text>
            <Text tone="muted">{t('componentCatalog.forms.description')}</Text>
          </Column>
          <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
            <Text variant="subtitle">{t('componentCatalog.forms.account')}</Text>
            <FormTextInput
              control={form.control}
              name="name"
              label={t('componentCatalog.forms.name')}
              placeholder={t('componentCatalog.forms.namePlaceholder')}
              autoComplete="name"
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('email')}
              onEdited={clearPreview}
              leftIcon={Icon.select({ ios: 'person', android: 'person' })}
              testID="component-form-name"
            />
            <FormTextInput
              control={form.control}
              name="email"
              label={t('auth.email')}
              placeholder="alex@example.com"
              helperText={t('componentCatalog.forms.emailHint')}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('password')}
              onEdited={clearPreview}
              leftIcon={Icon.select({ ios: 'envelope', android: 'mail_outline' })}
              testID="component-form-email"
            />
            <FormTextInput
              control={form.control}
              name="password"
              label={t('auth.password')}
              helperText={t('componentCatalog.forms.passwordHint')}
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect={false}
              password
              passwordToggle="icon"
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('bio')}
              onEdited={clearPreview}
              leftIcon={Icon.select({ ios: 'lock', android: 'lock_outline' })}
              testID="component-form-password"
            />
          </Column>
          <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
            <Text variant="subtitle">{t('componentCatalog.forms.about')}</Text>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
                  <Text variant="label">{t('componentCatalog.forms.role')}</Text>
                  <Picker
                    selectedValue={field.value}
                    testID="component-form-role"
                    onValueChange={(value) => {
                      field.onChange(value);
                      field.onBlur();
                      clearPreview();
                    }}
                  >
                    {roles.map((role) => (
                      <Picker.Item
                        key={role}
                        value={role}
                        label={t(`componentCatalog.forms.roles.${role}`)}
                      />
                    ))}
                  </Picker>
                </Column>
              )}
            />
            <FormTextInput
              control={form.control}
              name="bio"
              label={t('componentCatalog.forms.bio')}
              placeholder={t('componentCatalog.forms.bioPlaceholder')}
              helperText={t('componentCatalog.forms.bioHint')}
              multiline
              numberOfLines={3}
              onEdited={clearPreview}
              testID="component-form-bio"
            />
          </Column>
          <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
            <Text variant="subtitle">{t('componentCatalog.forms.preferences')}</Text>
            <Controller
              control={form.control}
              name="updates"
              render={({ field }) => (
                <Switch
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    clearPreview();
                  }}
                  label={t('componentCatalog.forms.updates')}
                  testID="component-form-updates"
                />
              )}
            />
            <Controller
              control={form.control}
              name="consent"
              render={({ field, fieldState }) => (
                <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
                  <Checkbox
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      field.onBlur();
                      clearPreview();
                    }}
                    label={t('componentCatalog.forms.consent')}
                    testID="component-form-consent"
                  />
                  {fieldState.error && (
                    <Text variant="caption" tone="error" testID="component-form-consent-error">
                      {t('componentCatalog.forms.consentRequired')}
                    </Text>
                  )}
                </Column>
              )}
            />
          </Column>
          <FormSubmit
            label={t('componentCatalog.forms.submit')}
            pending={form.formState.isSubmitting}
            onPress={() => void submit()}
            notice={preview ? t('componentCatalog.forms.complete') : undefined}
            testID="component-form-submit"
          />
          {preview && (
            <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
              <Text variant="subtitle">{t('componentCatalog.forms.review')}</Text>
              <Text testID="component-form-preview-name">{preview.name}</Text>
              <Text testID="component-form-preview-email">{preview.email}</Text>
              <Text testID="component-form-preview-role">
                {t(`componentCatalog.forms.roles.${preview.role}`)}
              </Text>
              {preview.bio ? <Text testID="component-form-preview-bio">{preview.bio}</Text> : null}
              <Text testID="component-form-preview-updates">
                {t(
                  preview.updates
                    ? 'componentCatalog.forms.updatesOn'
                    : 'componentCatalog.forms.updatesOff',
                )}
              </Text>
            </Column>
          )}
          <ButtonContent
            variant="secondary"
            label={t('componentCatalog.forms.fill')}
            fullWidth
            disabled={form.formState.isSubmitting}
            onPress={() => {
              clearPreview();
              form.reset({
                name: 'Alex Morgan',
                email: 'alex@example.com',
                password: 'Sample-only-123',
                bio: t('componentCatalog.forms.sampleBio'),
                role: 'design',
                updates: true,
                consent: true,
              });
            }}
            testID="component-form-fill"
          />
          <ButtonContent
            variant="tertiary"
            label={t('componentCatalog.forms.reset')}
            fullWidth
            disabled={form.formState.isSubmitting}
            onPress={() => {
              clearPreview();
              form.reset(emptyProfileExample);
            }}
            testID="component-form-reset"
          />
        </>
      )}
    </Column>
  );
}

function FieldStateExamples() {
  const { t } = useTranslation();
  return (
    <Column spacing={spacing.xl} modifiers={nativeFillWidth}>
      <Text tone="muted">{t('componentCatalog.forms.statesHint')}</Text>
      {(['default', 'success', 'warning', 'error'] as const).map((status) => (
        <TextInput
          key={status}
          status={status}
          label={t(`componentCatalog.forms.states.${status}`)}
          helperText={t(`componentCatalog.forms.stateHints.${status}`)}
          defaultValue={
            status === 'default' ? '' : status === 'error' ? 'alex@' : 'alex@example.com'
          }
          placeholder="alex@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          leftIcon={Icon.select({ ios: 'envelope', android: 'mail_outline' })}
          testID={`component-form-state-${status}`}
        />
      ))}
      <TextInput
        label={t('componentCatalog.forms.states.disabled')}
        helperText={t('componentCatalog.forms.stateHints.disabled')}
        value="alex@example.com"
        disabled
        testID="component-form-state-disabled"
      />
      <TextInput
        label={t('componentCatalog.forms.states.readOnly')}
        helperText={t('componentCatalog.forms.stateHints.readOnly')}
        value="PREVIEW-2026"
        readOnly
        testID="component-form-state-read-only"
      />
      <Row spacing={spacing.sm} modifiers={nativeFillWidth}>
        <Icon name={Icon.select({ ios: 'info.circle', android: 'info_outline' })} size={18} />
        <Text variant="caption" tone="muted" modifiers={nativeRowWeight}>
          {t('componentCatalog.forms.draftHint')}
        </Text>
      </Row>
    </Column>
  );
}
