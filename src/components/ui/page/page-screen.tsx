import { screenContentMaxWidth, spacing, tabBarRaisedHeight } from '@/constants/layout';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Column } from '@expo/ui';
import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonContent } from '../button/button';
import { UniversalHost, useHostLayoutDirection } from '../host/universal-host';
import { nativeFillWidth, nativeFillWidthCenter } from '../native/native-fill-width';
import {
  RefreshableScrollView,
  type RefreshableScrollViewProps,
} from '../refreshable-scroll-view/refreshable-scroll-view';
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
  /** Disable the page scroll container when bounded native content owns scrolling. */
  scrollable?: boolean;
  onRefresh?: () => Promise<void>;
  onScrollGeometryChange?: RefreshableScrollViewProps['onScrollGeometryChange'];
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
  scrollable = true,
  onRefresh,
  onScrollGeometryChange,
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
        scrollable={scrollable}
        onRefresh={onRefresh}
        onScrollGeometryChange={onScrollGeometryChange}
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
  scrollable = true,
  onRefresh,
  onScrollGeometryChange,
  colorScheme: scheme,
}: Readonly<PageContentProps>) {
  const insets = useSafeAreaInsets();
  const headerInset = usePageHeaderInset();
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  return (
    <View
      style={{
        flex: 1,
        overflow: scrollable ? undefined : 'hidden',
        // Bounded native forms own scrolling; reserve only their device safe areas.
        marginTop: scrollable ? 0 : insets.top,
        marginBottom: !scrollable && !tab ? insets.bottom : 0,
        marginLeft: scrollable ? 0 : insets.left,
        marginRight: scrollable ? 0 : insets.right,
      }}
    >
      {/* Keyboard overlap is separate from the content's device/header insets. */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <UniversalHost
          colorScheme={scheme}
          matchContents={false}
          // Compose can measure before Yoga supplies the first nonzero viewport.
          useViewportSizeMeasurement={Platform.OS === 'android'}
          ignoreSafeArea="all"
          style={{ flex: 1, maxWidth: screenContentMaxWidth, alignSelf: 'center' }}
        >
          {scrollable ? (
            <RefreshableScrollView
              onRefresh={onRefresh}
              onScrollGeometryChange={onScrollGeometryChange}
              testID="page-scroll"
            >
              <Column
                spacing={0}
                modifiers={nativeFillWidth}
                style={{
                  // Insets travel with the content, leaving the viewport unpadded.
                  paddingTop: headerInset + insets.top,
                  paddingBottom: tab ? tabBarRaisedHeight : footer ? 0 : insets.bottom,
                  // Expo UI maps these props to logical leading/trailing on both platforms.
                  paddingLeft: rtl ? insets.right : insets.left,
                  paddingRight: rtl ? insets.left : insets.right,
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
          ) : (
            children
          )}
        </UniversalHost>
        {footer ? (
          <UniversalText
            variant="caption"
            tone="muted"
            colorScheme={scheme}
            modifiers={nativeFillWidthCenter}
            style={{
              paddingTop: spacing.md,
              paddingBottom: spacing.md + (scrollable && !tab ? insets.bottom : 0),
              paddingLeft: spacing.lg + (scrollable ? (rtl ? insets.right : insets.left) : 0),
              paddingRight: spacing.lg + (scrollable ? (rtl ? insets.left : insets.right) : 0),
            }}
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
