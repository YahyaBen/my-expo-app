import { usePageLayout } from '@/hooks/use-page-layout';
import { navigationTheme } from '@/constants/navigation-theme';
import { useThemeColors } from '@/hooks/use-theme';
import { createContext, useContext, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHostColorScheme } from '../host/universal-host';
// Custom header implementations are retained while Expo Router owns the header.
// import { PageHeader } from './page-header';
// import { PageHeaderBackground } from './header-effects/page-header-background';
// import { PageHeaderTouchShield } from './header-effects/page-header-touch-shield';

const PageHeaderInsetContext = createContext(0);

export type PageHeaderMode = 'fixed' | 'scroll' | 'overlay';

/** Expo Router reserves the header outside content, so this inset remains zero. */
export function usePageHeaderInset() {
  return useContext(PageHeaderInsetContext);
}

/** Owns content safe areas and readiness below Expo Router's native header. */
export function PageFrame({
  children,
  colorScheme,
}: Readonly<
  PropsWithChildren<{
    title?: string;
    onBack?: () => void;
    colorScheme?: 'light' | 'dark';
    /** Retained for custom-header callers; Expo Router currently owns header layout. */
    headerMode?: PageHeaderMode;
    /** Retained for custom-header callers; Expo Router currently owns the backdrop. */
    headerBlur?: boolean;
  }>
>) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const onLayout = usePageLayout();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, backgroundColor: navigationTheme(scheme, colors).colors.background }}
      onLayout={onLayout}
    >
      {/* The native stack already reserves the header and top system inset. */}
      <SafeAreaInsetsContext.Provider value={{ ...insets, top: 0 }}>
        <PageHeaderInsetContext.Provider value={0}>{children}</PageHeaderInsetContext.Provider>
      </SafeAreaInsetsContext.Provider>
      {/* Custom header rendering is disabled in favor of Expo Router's native header.
      {headerBlur && title ? (
        <PageHeaderBackground
          blurTarget={blurTarget}
          colorScheme={colorScheme}
          height={headerHeight}
        />
      ) : null}
      <View
        testID="page-header-safe-area"
        pointerEvents={onBack ? 'box-none' : 'none'}
        onLayout={
          title
            ? ({ nativeEvent }) => {
                const contentHeight = nativeEvent.layout.height - insets.top;
                // The native Host can report before its title content has finished layout.
                if (contentHeight >= PAGE_HEADER_MIN_HEIGHT) setHeaderContentHeight(contentHeight);
              }
            : undefined
        }
        style={{
          zIndex: 2,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
          minHeight: title ? insets.top + PAGE_HEADER_MIN_HEIGHT : undefined,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {title ? <PageHeader title={title} onBack={onBack} colorScheme={colorScheme} /> : null}
      </View>
      <PageHeaderTouchShield height={headerHeight} />
      */}
    </View>
  );
}
