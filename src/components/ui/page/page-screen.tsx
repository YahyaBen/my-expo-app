import { screenContentMaxWidth, spacing, tabBarRaisedHeight } from '@/constants/layout';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { screenInsets } from '@/lib/screen-insets';
import { Column } from '@expo/ui';
import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonContent } from '../button/button';
import { UniversalHost } from '../host/universal-host';
import { nativeFillWidth, nativeFillWidthCenter } from '../native/native-fill-width';
import { RefreshableScrollView } from '../refreshable-scroll-view/refreshable-scroll-view';
import { UniversalText, UniversalTextContent } from '../text/universal-text';
import { PageFrame, usePageHeaderInset } from './page-frame';
import { PageSection } from './page-section';

export type PageScreenAction = {
  label: string;
  href: Href;
  testID?: string;
};

type PageContentProps = {
  description?: string;
  footer?: string;
  children?: ReactNode;
  actions?: readonly PageScreenAction[];
  tab?: boolean;
  onRefresh?: () => Promise<void>;
  colorScheme?: 'light' | 'dark';
};

export type PageScreenProps = PageContentProps & {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
};

export function PageScreen({
  title,
  description,
  footer,
  actions,
  children,
  tab = false,
  onRefresh,
  colorScheme,
  onBack,
  showBack = !tab,
}: Readonly<PageScreenProps>) {
  const scheme = useColorScheme(colorScheme);
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  return (
    <PageFrame
      title={title}
      onBack={!showBack ? undefined : goBack}
      colorScheme={scheme}
      headerMode="scroll"
    >
      <PageContent
        description={description}
        footer={footer}
        actions={actions}
        tab={tab}
        onRefresh={onRefresh}
        colorScheme={scheme}
      >
        {children}
      </PageContent>
    </PageFrame>
  );
}

function PageContent({
  description,
  footer,
  actions = [],
  children,
  tab = false,
  onRefresh,
  colorScheme: scheme,
}: Readonly<PageContentProps>) {
  const insets = useSafeAreaInsets();
  const headerInset = usePageHeaderInset();
  return (
    <View
      style={{
        flex: 1,
        ...screenInsets(insets, { tabBarShown: tab }),
      }}
    >
      {/* Keep system insets outside the keyboard padding so neither overwrites the other. */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <UniversalHost
          colorScheme={scheme}
          matchContents={false}
          // Compose can measure before Yoga supplies the first nonzero viewport.
          useViewportSizeMeasurement={Platform.OS === 'android'}
          ignoreSafeArea="all"
          style={{ flex: 1, maxWidth: screenContentMaxWidth, alignSelf: 'center' }}
        >
          <RefreshableScrollView onRefresh={onRefresh} testID="page-scroll">
            <Column
              spacing={0}
              modifiers={nativeFillWidth}
              style={{
                padding: 0,
                paddingTop: headerInset,
                paddingBottom: tab ? tabBarRaisedHeight : 0,
              }}
            >
              {description ? (
                <PageSection>
                  <UniversalTextContent>{description}</UniversalTextContent>
                </PageSection>
              ) : null}
              {children}
              {actions.length > 0 ? (
                <PageSection>
                  {actions.map(({ label, href, testID }) => (
                    <ButtonContent
                      key={testID ?? (typeof href === 'string' ? href : JSON.stringify(href))}
                      label={label}
                      variant="secondary"
                      testID={
                        testID ??
                        `page-action-${(typeof href === 'string' ? href : href.pathname).replaceAll(/[^a-zA-Z0-9]+/g, '-').replaceAll(/^-|-$/g, '')}`
                      }
                      onPress={() => router.push(href)}
                    />
                  ))}
                </PageSection>
              ) : null}
            </Column>
          </RefreshableScrollView>
        </UniversalHost>
        {footer ? (
          <UniversalText
            variant="caption"
            tone="muted"
            colorScheme={scheme}
            modifiers={nativeFillWidthCenter}
            style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}
            textStyle={{ textAlign: 'center' }}
            testID="page-footer"
          >
            {footer}
          </UniversalText>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}
