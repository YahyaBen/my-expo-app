import { screenContentMaxWidth, spacing } from '@/constants/layout';
import { showAlert } from '@/lib/alerts';
import {
  AuthScreenFrame,
  Badge,
  BottomSheet,
  Button,
  ButtonContent,
  Checkbox,
  Collapsible,
  ColorSchemeControl,
  Column,
  DateTimePicker,
  EmptyState,
  FieldGroup,
  FloatingAction,
  FormSubmit,
  FormTextInput,
  Icon,
  LaunchScreen,
  List,
  ListItem,
  LoadingContent,
  OtpBottomSheet,
  PageScreen,
  PageSection,
  Picker,
  Popover,
  ProgressIndicator,
  RNHostView,
  Row,
  SegmentedControl,
  Shape,
  SkeletonContent,
  Slider,
  Spacer,
  Switch,
  TabNavigationBar,
  UniversalTextContent as Text,
  TextInput,
  VerificationCodeFace,
  nativeFillWidth,
  pageFormModifiers,
  usePageHeaderInset,
  type DateTimePickerMode,
  type TabNavigationItemId,
} from '@components/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonExamples } from './button-examples';
import { ChipExamples } from './chip-examples';
import { componentCatalog, isComponentId, type ComponentId } from './component-catalog';
import { FormExamples } from './form-examples';
import type { PhotoLayout } from './photo-examples';
import { SliderExamples } from './slider-examples';
import { TableExamples } from './table-examples';
import { TextInputExamples } from './text-input-examples';

const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

export default function ComponentScreen({ id }: Readonly<{ id?: string }>) {
  const { t } = useTranslation();
  if (!isComponentId(id)) {
    return (
      <PageScreen title={t('template.components')}>
        <PageSection>
          <Text>{t('componentCatalog.notFound')}</Text>
        </PageSection>
      </PageScreen>
    );
  }
  return <ComponentPage id={id} />;
}

function ComponentPage({ id }: Readonly<{ id: ComponentId }>) {
  const { t } = useTranslation();
  const title = t(`componentCatalog.names.${id}`);

  if (id === 'auth') {
    return (
      <AuthScreenFrame
        title={title}
        description={t(`componentCatalog.descriptions.${id}`)}
        testID="component-auth"
        topBar={
          <Button
            variant="tertiary"
            label={t('common.goBack')}
            onPress={goBack}
            testID="component-auth-back"
          />
        }
      >
        <FormExample />
      </AuthScreenFrame>
    );
  }
  if (id === 'field-group' || id === 'list') {
    const rows = componentCatalog.slice(0, 8).map(({ id: rowId, icon }) => (
      <ListItem
        key={rowId}
        leading={<Icon name={icon} />}
        supportingText={t(`componentCatalog.descriptions.${rowId}`)}
        onPress={() => router.push({ pathname: '/components/[id]', params: { id: rowId } })}
        testID={`component-${id}-${rowId}`}
      >
        {t(`componentCatalog.names.${rowId}`)}
      </ListItem>
    ));
    return (
      <PageScreen title={title} onBack={goBack} scrollable={false}>
        {id === 'list' ? (
          <List testID="component-list">
            <CollectionDescription description={t(`componentCatalog.descriptions.${id}`)} />
            {rows}
          </List>
        ) : (
          <FieldGroup modifiers={pageFormModifiers} testID="component-field-group">
            <FieldGroup.Section title={title}>
              <FieldGroup.SectionHeader>
                <CollectionDescription description={t(`componentCatalog.descriptions.${id}`)} />
              </FieldGroup.SectionHeader>
              {rows}
            </FieldGroup.Section>
          </FieldGroup>
        )}
      </PageScreen>
    );
  }
  return <ComponentExample id={id} title={title} />;
}

/** Header clearance belongs to the native list/form's scrolling content. */
function CollectionDescription({ description }: Readonly<{ description: string }>) {
  const headerInset = usePageHeaderInset();
  return (
    <Column
      modifiers={nativeFillWidth}
      style={{ paddingTop: headerInset, paddingBottom: spacing.lg }}
    >
      <Text>{description}</Text>
    </Column>
  );
}

/** A small, local native example; only the current destination is mounted. */
function ComponentExample({ id, title }: Readonly<{ id: ComponentId; title: string }>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const fullWidth =
    id === 'chip' ||
    id === 'table' ||
    id === 'circular-carousel' ||
    id === 'stacked-carousel' ||
    id === 'story-list' ||
    id === 'ios-home-grid';
  const width = Math.max(
    1,
    Math.min(screenContentMaxWidth, window.width) -
      insets.left -
      insets.right -
      (fullWidth ? 0 : spacing.lg * 2),
  );
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [value, setValue] = useState(50);
  const [choice, setChoice] = useState('first');
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState<TabNavigationItemId>('home');
  const options = [
    { value: 'first', label: t('componentCatalog.first'), testID: 'component-option-first' },
    { value: 'second', label: t('componentCatalog.second'), testID: 'component-option-second' },
  ];
  const actionLabel = t('componentCatalog.tryAction');
  const result = (
    <Text testID="component-action-result">{t('componentCatalog.actionCount', { count })}</Text>
  );
  const countAction = () => setCount((current) => current + 1);

  function content() {
    switch (id) {
      case 'button':
        return (
          <>
            {result}
            <ButtonExamples onPress={countAction} />
          </>
        );
      case 'checkbox':
        return (
          <Checkbox
            value={enabled}
            onValueChange={setEnabled}
            label={title}
            testID="component-checkbox"
          />
        );
      case 'badge':
        return (
          <Column spacing={12}>
            <Badge label={t('componentCatalog.badges.default')} testID="component-badge-default" />
            <Badge
              label={t('componentCatalog.badges.secondary')}
              variant="secondary"
              testID="component-badge-secondary"
            />
            <Badge
              label={t('componentCatalog.badges.destructive')}
              variant="destructive"
              testID="component-badge-destructive"
            />
            <Badge
              label={t('componentCatalog.badges.outline')}
              variant="outline"
              testID="component-badge-outline"
            />
          </Column>
        );
      case 'switch':
        return (
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            label={title}
            testID="component-switch"
          />
        );
      case 'chip':
        return (
          <>
            <PageSection style={{ paddingVertical: 0 }}>{result}</PageSection>
            <ChipExamples onAction={countAction} />
          </>
        );
      case 'slider':
        return <SliderExamples />;
      case 'picker':
        return (
          <Picker selectedValue={choice} onValueChange={setChoice} testID="component-picker">
            {options.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        );
      case 'segmented-control':
        return (
          <SegmentedControl
            options={options}
            selectedValue={choice}
            onValueChange={setChoice}
            label={title}
          />
        );
      case 'date-time-picker':
        return <DateTimePickerExample />;
      case 'text-input':
        return <TextInputExamples />;
      case 'form':
        return <FormExamples />;
      case 'text':
        return (
          <>
            <Text variant="heading">{title}</Text>
            <Text variant="subtitle">{t('componentCatalog.first')}</Text>
            <Text>{t('componentCatalog.tryComponent')}</Text>
            <Text variant="caption" tone="muted">
              {t('componentCatalog.second')}
            </Text>
          </>
        );
      case 'icon':
        return <IconExamples />;
      case 'shape':
        return (
          <Row spacing={spacing.lg}>
            <Shape variant="circle" />
            <Shape variant="roundedRectangle" />
            <Shape variant="capsule" width={96} />
          </Row>
        );
      case 'native':
      case 'host':
        return (
          <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
            <Text>{title}</Text>
            <Row spacing={spacing.lg} modifiers={nativeFillWidth}>
              <Shape variant="circle" width={48} height={48} />
              <Spacer flexible />
              <Shape variant="roundedRectangle" width={48} height={48} />
            </Row>
            <ButtonContent variant="primary" label={actionLabel} onPress={countAction} />
            {result}
          </Column>
        );
      case 'page':
        return (
          <>
            <Text variant="title">{t('template.title')}</Text>
            <Text>{t('template.description')}</Text>
            <SkeletonContent style={{ height: 160 }} />
          </>
        );
      case 'list-item':
        return (
          <>
            <ListItem
              leading={<Icon name={{ ios: 'star', android: 'star' }} />}
              supportingText={t('componentCatalog.tryComponent')}
              onPress={countAction}
              testID="component-list-item"
            >
              {title}
            </ListItem>
            {result}
          </>
        );
      case 'table':
        return <TableExamples contentWidth={width} />;
      case 'collapsible':
        return (
          <Collapsible label={title} isOpen={open} onOpenChange={setOpen}>
            <TextInput
              label={t('auth.firstName')}
              value={text}
              onChangeText={setText}
              testID="component-collapsible-input"
            />
          </Collapsible>
        );
      case 'refreshable-scroll-view':
        return (
          <>
            <Text>{t('componentCatalog.pullToRefresh')}</Text>
            {result}
            {componentCatalog.slice(0, 8).map((item) => (
              <Text key={item.id}>{t(`componentCatalog.names.${item.id}`)}</Text>
            ))}
          </>
        );
      case 'circular-carousel':
      case 'stacked-carousel':
      case 'story-list':
      case 'ios-home-grid':
        return <PhotoExample key={id} layout={id} width={width} />;
      case 'floating-action':
        return (
          <>
            <RNHostView matchContents>
              <View style={{ width: 76, height: 76 }}>
                <FloatingAction
                  kind="continue"
                  label={actionLabel}
                  onPress={countAction}
                  testID="component-floating-action"
                />
              </View>
            </RNHostView>
            {result}
          </>
        );
      case 'navigation':
        return (
          <>
            <RNHostView matchContents>
              <View style={{ width, paddingTop: 28 }}>
                <TabNavigationBar
                  activeId={activeTab}
                  onSelect={setActiveTab}
                  items={[
                    { id: 'home', label: t('common.home') },
                    { id: 'search', label: t('template.search') },
                    { id: 'recipes', label: t('common.recipes') },
                    { id: 'more', label: t('common.options') },
                  ]}
                  action={{ kind: 'continue', label: actionLabel, onPress: countAction }}
                />
              </View>
            </RNHostView>
            {result}
          </>
        );
      case 'popover':
        return (
          <Popover
            isPresented={open}
            onIsPresentedChange={setOpen}
            testID="component-popover"
            trigger={
              <ButtonContent
                variant="primary"
                label={actionLabel}
                onPress={() => setOpen(true)}
                testID="component-popover-trigger"
              />
            }
          >
            <Column
              spacing={spacing.md}
              style={{ padding: spacing.lg, width: Math.min(240, width) }}
            >
              <Text>{title}</Text>
              <ButtonContent
                variant="secondary"
                label={t('common.close')}
                onPress={() => setOpen(false)}
              />
            </Column>
          </Popover>
        );
      case 'bottom-sheet':
        return (
          <>
            <ButtonContent
              variant="primary"
              label={actionLabel}
              onPress={() => setOpen(true)}
              testID="component-bottom-sheet-trigger"
            />
            <BottomSheet
              isPresented={open}
              onDismiss={() => setOpen(false)}
              testID="component-bottom-sheet"
            >
              <Column spacing={spacing.lg} style={{ padding: spacing.xl, width }}>
                <Text variant="title">{title}</Text>
                <IconExamples />
                <ButtonContent
                  variant="secondary"
                  label={t('common.close')}
                  onPress={() => setOpen(false)}
                />
              </Column>
            </BottomSheet>
          </>
        );
      case 'alert':
        return (
          <ButtonContent
            variant="primary"
            label={actionLabel}
            onPress={() =>
              showAlert({ variant: 'info', title, message: t('componentCatalog.tryComponent') })
            }
            testID="component-alert-trigger"
          />
        );
      case 'empty-state':
        return (
          <>
            <EmptyState
              title={t('componentCatalog.emptyState.title')}
              description={t('componentCatalog.emptyState.description')}
              primaryAction={{
                label: t('componentCatalog.emptyState.create'),
                onPress: countAction,
              }}
              secondaryAction={{
                label: t('componentCatalog.emptyState.import'),
                onPress: countAction,
              }}
              footerAction={{
                label: t('componentCatalog.emptyState.learnMore'),
                onPress: countAction,
                external: true,
              }}
              testID="component-empty-state"
            />
            {result}
          </>
        );
      case 'loading':
        return (
          <>
            <LoadingContent label={t('common.loading')} />
            <ProgressIndicator value={value / 100} accessibilityLabel={title} />
            <Slider
              value={value}
              min={0}
              max={100}
              onValueChange={setValue}
              testID="component-progress-slider"
            />
          </>
        );
      case 'skeleton':
        return (
          <>
            <SkeletonContent style={{ height: 160 }} />
            <SkeletonContent style={{ height: 24 }} />
            <SkeletonContent style={{ height: 16 }} />
          </>
        );
      case 'appearance':
        return <ColorSchemeControl testID="component-appearance" />;
      case 'launch-screen':
        return (
          <ButtonContent
            variant="primary"
            label={actionLabel}
            onPress={() => setOpen(true)}
            testID="component-launch-trigger"
          />
        );
      case 'otp-bottom-sheet':
        return (
          <>
            <ButtonContent
              variant="primary"
              label={actionLabel}
              onPress={() => setOpen(true)}
              testID="component-otp-trigger"
            />
            <RNHostView matchContents>
              <View style={{ width }}>
                <OtpBottomSheet
                  isPresented={open}
                  onDismiss={() => setOpen(false)}
                  recipient="demo@example.com"
                  hint={t('componentCatalog.demoCode')}
                  onVerify={(code) => code === '123456'}
                  testID="component-otp"
                />
              </View>
            </RNHostView>
          </>
        );
      case 'verification-code-face':
        return (
          <VerificationCodeFace
            value={text}
            onChangeText={setText}
            label={t('auth.verificationCode')}
            helperText={t('componentCatalog.demoCode')}
            status={text.length !== 6 ? 'default' : text === '123456' ? 'success' : 'error'}
            resetLabel={t('common.clear')}
            testID="component-verification-code-face"
          />
        );
      // These destinations have their own native scroll/frame above.
      case 'auth':
      case 'field-group':
      case 'list':
        return null;
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <PageScreen
        title={title}
        description={t(`componentCatalog.descriptions.${id}`)}
        onRefresh={id === 'refreshable-scroll-view' ? async () => countAction() : undefined}
      >
        <PageSection inset={!fullWidth} testID={`component-page-${id}`}>
          {content()}
        </PageSection>
      </PageScreen>
      {id === 'launch-screen' && open ? (
        <LaunchScreen mode="branded" exiting onExitComplete={() => setOpen(false)} />
      ) : null}
    </View>
  );
}

/** Evaluate the device picker only when a photo example is opened. */
function PhotoExample({ layout, width }: Readonly<{ layout: PhotoLayout; width: number }>) {
  const PhotoExamples: typeof import('./photo-examples').PhotoExamples =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Keep device integration deferred and synchronously bundled for native releases.
    require('./photo-examples').PhotoExamples;
  return <PhotoExamples initialLayout={layout} width={width} />;
}

function IconExamples() {
  const { t } = useTranslation();
  return (
    <Row spacing={spacing.xl}>
      <Icon
        name={{ ios: 'star', android: 'star' }}
        size={32}
        accessibilityLabel={t('componentCatalog.names.icon')}
      />
      <Icon
        name={{ ios: 'heart', android: 'favorite' }}
        size={32}
        accessibilityLabel={t('common.favoritesOnly')}
      />
    </Row>
  );
}

function FormExample() {
  const { t } = useTranslation();
  const { control, handleSubmit, formState } = useForm({ defaultValues: { name: '' } });
  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <FormTextInput
        control={control}
        name="name"
        label={t('auth.firstName')}
        testID="component-form-name"
      />
      <FormSubmit
        label={t('componentCatalog.tryAction')}
        pending={formState.isSubmitting}
        onPress={handleSubmit(() => {})}
        notice={formState.isSubmitted ? t('componentCatalog.formComplete') : undefined}
        testID="component-form-submit"
      />
    </Column>
  );
}

function DateTimePickerExample() {
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState(() => new Date(2030, 4, 15, 14, 30));
  const [mode, setMode] = useState<DateTimePickerMode>('datetime');
  const [disabled, setDisabled] = useState(false);
  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <Picker selectedValue={mode} onValueChange={setMode} testID="component-date-time-picker-mode">
        {(['date', 'time', 'datetime'] as const).map((value) => (
          <Picker.Item key={value} value={value} label={t(`componentCatalog.dateTime.${value}`)} />
        ))}
      </Picker>
      <DateTimePicker
        value={value}
        onValueChange={setValue}
        mode={mode}
        label={t('componentCatalog.dateTime.label')}
        helperText={t('componentCatalog.dateTime.hint')}
        locale={i18n.resolvedLanguage ?? i18n.language}
        disabled={disabled}
        testID="component-date-time-picker"
      />
      <Text testID="component-date-time-picker-value">
        {value.toLocaleString(i18n.resolvedLanguage ?? i18n.language)}
      </Text>
      <Switch
        value={disabled}
        onValueChange={setDisabled}
        label={t('componentCatalog.dateTime.disabled')}
        testID="component-date-time-picker-disable"
      />
      <ButtonContent
        variant="secondary"
        label={t('componentCatalog.dateTime.reset')}
        onPress={() => setValue(new Date(2030, 4, 15, 14, 30))}
        testID="component-date-time-picker-reset"
      />
    </Column>
  );
}
