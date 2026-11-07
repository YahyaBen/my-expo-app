import { usePageLayout } from '@/hooks/use-page-layout';
import { useThemeColors } from '@/hooks/use-theme';
import { BlurTargetView } from 'expo-blur';
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { StyleSheet, View, type ViewInstance } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHostColorScheme } from '../host/universal-host';
import { PageHeader } from './page-header';
import { PageHeaderBackground } from './header-effects/page-header-background';
import { PAGE_HEADER_MIN_HEIGHT } from './page-header-layout';
import { PageHeaderTouchShield } from './header-effects/page-header-touch-shield';

const PageHeaderInsetContext = createContext(0);

export type PageHeaderMode = 'fixed' | 'scroll' | 'overlay';

/** Put this inset inside scroll content so it can move beneath the floating header. */
export function usePageHeaderInset() {
  return useContext(PageHeaderInsetContext);
}

/** Owns header geometry and safe areas while keeping the native content tree stable. */
export function PageFrame({
  children,
  title,
  onBack,
  colorScheme,
  headerMode = 'fixed',
  headerBlur = true,
}: Readonly<
  PropsWithChildren<{
    title?: string;
    onBack?: () => void;
    colorScheme?: 'light' | 'dark';
    /** Fixed reserves space; scroll publishes an inset; overlay retains device insets. */
    headerMode?: PageHeaderMode;
    /** Blur content behind titled headers by default. */
    headerBlur?: boolean;
  }>
>) {
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  const onLayout = usePageLayout();
  const insets = useSafeAreaInsets();
  const [headerContentHeight, setHeaderContentHeight] = useState(PAGE_HEADER_MIN_HEIGHT);
  const headerHeight = title ? insets.top + headerContentHeight : 0;
  const mode = !title && headerMode === 'scroll' ? 'fixed' : headerMode;
  const reservedTop = title ? headerHeight : insets.top;
  const blurTarget = useRef<ViewInstance | null>(null);
  const contentTop = mode === 'overlay' ? insets.top : 0;
  const contentInsets = useMemo(
    () => ({ top: contentTop, bottom: insets.bottom, left: insets.left, right: insets.right }),
    [contentTop, insets.bottom, insets.left, insets.right],
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout}>
      <SafeAreaInsetsContext.Provider value={contentInsets}>
        <PageHeaderInsetContext.Provider value={mode === 'scroll' ? headerHeight : 0}>
          {/* Keep the same capture target even when blur, title or layout mode changes. */}
          <BlurTargetView
            ref={blurTarget}
            style={{ flex: 1, paddingTop: mode === 'fixed' ? reservedTop : 0 }}
          >
            {/* Android captures target children, including the background of empty regions. */}
            <View
              testID="page-blur-scene-background"
              pointerEvents="none"
              accessible={false}
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
            />
            {children}
          </BlurTargetView>
        </PageHeaderInsetContext.Provider>
      </SafeAreaInsetsContext.Provider>
      {/* Android blur mounts after its capture target. Title and Back stay above it. */}
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
    </View>
  );
}
