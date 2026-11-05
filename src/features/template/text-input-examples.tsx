import {
  ButtonContent,
  Column,
  Icon,
  TextInput,
  UniversalTextContent as Text,
  nativeFillWidth,
  useHostColorScheme,
  type TextInputRef,
} from '@components/ui';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

const notesLimit = 160;
const statuses = ['default', 'error', 'success', 'warning'] as const;
const clearIcon = Icon.select({ ios: 'xmark.circle.fill', android: 'cancel' });

/** Native examples share the component page's Host and scroll owner. */
export function TextInputExamples() {
  return (
    <Column spacing={spacing.xxl} modifiers={nativeFillWidth}>
      <InputStyleExamples />
      <PasswordInputExample />
      <InputFeedbackExamples />
      <InputKeyboardExamples />
      <MultilineInputExample />
      <InputAvailabilityExamples />
    </Column>
  );
}

function InputSection({
  title,
  hint,
  children,
}: Readonly<{ title: string; hint?: string; children: ReactNode }>) {
  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <Column spacing={spacing.xs} modifiers={nativeFillWidth}>
        <Text variant="subtitle">{title}</Text>
        {hint ? (
          <Text variant="caption" tone="muted">
            {hint}
          </Text>
        ) : null}
      </Column>
      {children}
    </Column>
  );
}

function InputStyleExamples() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const searchRef = useRef<TextInputRef>(null);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');

  return (
    <InputSection
      title={t('componentCatalog.inputs.styles')}
      hint={t('componentCatalog.inputs.stylesHint')}
    >
      <TextInput
        label={t('componentCatalog.inputs.outlined')}
        placeholder={t('auth.firstName')}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoComplete="off"
        returnKeyType="done"
        testID="component-text-input"
      />
      <TextInput
        label={t('componentCatalog.inputs.filled')}
        placeholder={t('showcase.inputGallery.placeholder')}
        leftIcon={Icon.select({ ios: 'person', android: 'person' })}
        style={{ backgroundColor: colors.surfaceVariant, borderRadius: radii.sm }}
        autoComplete="off"
        returnKeyType="done"
        testID="component-text-input-filled"
      />
      <TextInput
        ref={searchRef}
        label={t('showcase.inputGallery.search')}
        placeholder={t('showcase.inputGallery.searchPlaceholder')}
        helperText={t('componentCatalog.inputs.searchHint')}
        value={search}
        onChangeText={setSearch}
        leftIcon={Icon.select({ ios: 'magnifyingglass', android: 'search' })}
        rightIcon={search.length > 0 ? clearIcon : undefined}
        onRightIconPress={() => {
          setSearch('');
          searchRef.current?.focus();
        }}
        rightIconAccessibilityLabel={t('showcase.inputGallery.clearSearch')}
        style={{ borderRadius: radii.pill }}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="search"
        onSubmitEditing={() => searchRef.current?.blur()}
        testID="component-text-input-search"
      />
    </InputSection>
  );
}

function PasswordInputExample() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [shown, setShown] = useState(false);

  return (
    <InputSection title={t('showcase.inputGallery.password')}>
      <TextInput
        label={t('auth.password')}
        placeholder={t('componentCatalog.inputs.passwordPlaceholder')}
        helperText={t('componentCatalog.inputs.passwordHint')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!shown}
        leftIcon={Icon.select({ ios: 'lock', android: 'lock' })}
        rightIcon={Icon.select({
          ios: shown ? 'eye.slash' : 'eye',
          android: shown ? 'visibility_off' : 'visibility',
        })}
        onRightIconPress={() => setShown((current) => !current)}
        rightIconAccessibilityLabel={t(shown ? 'auth.hidePassword' : 'auth.showPassword')}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="done"
        testID="component-text-input-password"
      />
      <Text variant="caption" tone="muted" testID="component-text-input-password-state">
        {t(shown ? 'showcase.inputGallery.passwordShown' : 'showcase.inputGallery.passwordHidden')}
      </Text>
    </InputSection>
  );
}

function InputFeedbackExamples() {
  const { t } = useTranslation();

  return (
    <InputSection
      title={t('showcase.inputGallery.statuses')}
      hint={t('showcase.inputGallery.statusesHint')}
    >
      {statuses.map((status) => (
        <TextInput
          key={status}
          label={t(`showcase.inputGallery.status.${status}`)}
          helperText={t(`showcase.inputGallery.statusHint.${status}`)}
          placeholder={t('showcase.inputGallery.placeholder')}
          status={status}
          autoComplete="off"
          returnKeyType="done"
          testID={`component-text-input-status-${status}`}
        />
      ))}
    </InputSection>
  );
}

function InputKeyboardExamples() {
  const { t } = useTranslation();
  const emailRef = useRef<TextInputRef>(null);
  const phoneRef = useRef<TextInputRef>(null);
  const quantityRef = useRef<TextInputRef>(null);

  return (
    <InputSection
      title={t('componentCatalog.inputs.keyboards')}
      hint={t('componentCatalog.inputs.keyboardsHint')}
    >
      <TextInput
        ref={emailRef}
        label={t('auth.email')}
        placeholder="chef@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        leftIcon={Icon.select({ ios: 'envelope', android: 'mail' })}
        returnKeyType="next"
        onSubmitEditing={() => phoneRef.current?.focus()}
        testID="component-text-input-email"
      />
      <TextInput
        ref={phoneRef}
        label={t('componentCatalog.inputs.phone')}
        placeholder="+212 600 000 000"
        keyboardType="phone-pad"
        autoComplete="off"
        leftIcon={Icon.select({ ios: 'phone', android: 'phone' })}
        returnKeyType="next"
        onSubmitEditing={() => quantityRef.current?.focus()}
        testID="component-text-input-phone"
      />
      <TextInput
        ref={quantityRef}
        label={t('showcase.inputGallery.quantity')}
        placeholder="2.5"
        helperText={t('showcase.inputGallery.quantityHint')}
        keyboardType="decimal-pad"
        autoComplete="off"
        leftIcon={Icon.select({ ios: 'number', android: 'numbers' })}
        returnKeyType="done"
        onSubmitEditing={() => quantityRef.current?.blur()}
        testID="component-text-input-decimal"
      />
      <ButtonContent
        variant="tertiary"
        label={t('showcase.inputGallery.dismissKeyboard')}
        fullWidth
        onPress={() => {
          emailRef.current?.blur();
          phoneRef.current?.blur();
          quantityRef.current?.blur();
        }}
        testID="component-text-input-dismiss-keyboard"
      />
    </InputSection>
  );
}

function MultilineInputExample() {
  const { t } = useTranslation();
  const notesRef = useRef<TextInputRef>(null);
  const [notes, setNotes] = useState('');

  return (
    <InputSection title={t('componentCatalog.inputs.multiline')}>
      <TextInput
        ref={notesRef}
        label={t('showcase.inputGallery.notes')}
        placeholder={t('showcase.inputGallery.notesPlaceholder')}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        maxLength={notesLimit}
        helperText={t('showcase.inputGallery.length', { length: notes.length, limit: notesLimit })}
        autoComplete="off"
        testID="component-text-input-multiline"
      />
      <ButtonContent
        variant="secondary"
        label={t('showcase.inputGallery.reset')}
        fullWidth
        disabled={notes.length === 0}
        onPress={() => setNotes('')}
        testID="component-text-input-reset-notes"
      />
      <ButtonContent
        variant="tertiary"
        label={t('showcase.inputGallery.dismissKeyboard')}
        fullWidth
        onPress={() => notesRef.current?.blur()}
        testID="component-text-input-dismiss-notes-keyboard"
      />
    </InputSection>
  );
}

function InputAvailabilityExamples() {
  const { t } = useTranslation();
  const [actions, setActions] = useState(0);
  const infoIcon = Icon.select({ ios: 'info.circle', android: 'info' });
  const inspect = () => setActions((current) => current + 1);

  return (
    <InputSection
      title={t('componentCatalog.inputs.availability')}
      hint={t('componentCatalog.inputs.availabilityHint')}
    >
      <TextInput
        label={t('showcase.inputGallery.readOnly')}
        value={t('showcase.inputGallery.readOnlyValue')}
        readOnly
        helperText={t('showcase.inputGallery.readOnlyHint')}
        rightIcon={infoIcon}
        onRightIconPress={inspect}
        rightIconAccessibilityLabel={t('showcase.inputGallery.inspect')}
        testID="component-text-input-read-only"
      />
      <TextInput
        label={t('showcase.disabledField')}
        value={t('showcase.inputGallery.sample')}
        disabled
        rightIcon={infoIcon}
        onRightIconPress={inspect}
        rightIconAccessibilityLabel={t('showcase.inputGallery.inspect')}
        testID="component-text-input-disabled"
      />
      <Text variant="caption" tone="muted" testID="component-text-input-icon-actions">
        {t('showcase.inputGallery.iconActions', { total: actions })}
      </Text>
    </InputSection>
  );
}
