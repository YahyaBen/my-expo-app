import { StartupLayoutContext } from '@/context/startup-layout.context';
import { usePagePerformance } from '@/hooks/use-page-performance';
import { useThemeColors } from '@/hooks/use-theme';
import { BlurTargetView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { View, type ViewInstance } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHostColorScheme } from '../host/universal-host';
import { PageHeader } from './page-header';
import { PageHeaderBackground } from './page-header-background';
import { PAGE_HEADER_MIN_HEIGHT } from './page-header-layout';
import { PageHeaderTouchShield } from './page-header-touch-shield';
import { PageWaveContext } from './page-wave-context';
import { usePageBlurKey } from './use-page-blur-key';

const PageHeaderInsetContext = createContext(0);

/** Put this inset inside scroll content so it can move beneath the floating header. */
export function usePageHeaderInset() {
  return useContext(PageHeaderInsetContext);
}

/** Owns the header safe area; overlay content retains all device insets. */
export function PageFrame({
  children,
  title,
  onBack,
  colorScheme,
  headerOverlay = true,
  headerBlur = true,
  scrollsBehindHeader = true,
}: Readonly<
  PropsWithChildren<{
    title?: string;
    onBack?: () => void;
    colorScheme?: 'light' | 'dark';
    headerOverlay?: boolean;
    /** Blur content behind titled headers by default, independently of theme artwork. */
    headerBlur?: boolean;
    /** Children reserve usePageHeaderInset() inside their own scroll content. */
    scrollsBehindHeader?: boolean;
  }>
>) {
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  const onStartupLayout = useContext(StartupLayoutContext);
  const markFrameLayout = usePagePerformance();
  const laidOut = useRef(false);
  useEffect(() => {
    if (laidOut.current) onStartupLayout?.();
  }, [onStartupLayout]);
  const insets = useSafeAreaInsets();
  const blurHeader = headerBlur && Boolean(title);
  const blurKey = usePageBlurKey(blurHeader);
  const scrollHeader = Boolean(title) && scrollsBehindHeader && !headerOverlay;
  const floating = headerOverlay || scrollHeader;
  const [headerContentHeight, setHeaderContentHeight] = useState(PAGE_HEADER_MIN_HEIGHT);
  const headerHeight = title ? insets.top + headerContentHeight : 0;
  const setWaveHeight = useContext(PageWaveContext)?.setHeaderHeight;
  useFocusEffect(
    useCallback(() => {
      if (title && headerHeight > 0) setWaveHeight?.(headerHeight);
    }, [title, headerHeight, setWaveHeight]),
  );
  const blurTarget = useRef<ViewInstance | null>(null);
  const contentTop = headerOverlay ? insets.top : 0;
  const contentInsets = useMemo(
    () => ({ top: contentTop, bottom: insets.bottom, left: insets.left, right: insets.right }),
    [contentTop, insets.bottom, insets.left, insets.right],
  );
  const header = (
    <View
      testID="page-header-safe-area"
      pointerEvents={floating && !onBack ? 'none' : 'box-none'}
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
        ...(floating ? { position: 'absolute', top: 0, left: 0, right: 0 } : {}),
        paddingTop: insets.top,
        minHeight: title ? insets.top + PAGE_HEADER_MIN_HEIGHT : undefined,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {title ? <PageHeader title={title} onBack={onBack} colorScheme={colorScheme} /> : null}
    </View>
  );
  const ContentView = blurHeader ? BlurTargetView : View;
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={() => {
        laidOut.current = true;
        onStartupLayout?.();
        markFrameLayout();
      }}
    >
      {!floating && header}
      <SafeAreaInsetsContext.Provider value={contentInsets}>
        <PageHeaderInsetContext.Provider value={scrollHeader ? headerHeight : 0}>
          <ContentView
            ref={blurHeader ? blurTarget : undefined}
            style={{
              flex: 1,
              // Fixed headers keep their native intrinsic height in normal layout.
              // The blur source still covers the complete frame on Android.
              ...(blurHeader && !floating
                ? { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }
                : {}),
              paddingTop: blurHeader && !headerOverlay && !scrollHeader ? headerHeight : 0,
            }}
          >
            {blurHeader ? (
              // Android records target children, so the scene background must be a child
              // too. Otherwise empty regions can inherit the native window's gray fill.
              <View
                testID="page-blur-scene-background"
                pointerEvents="none"
                accessible={false}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: colors.background,
                }}
              />
            ) : null}
            {children}
          </ContentView>
        </PageHeaderInsetContext.Provider>
      </SafeAreaInsetsContext.Provider>
      {/* Mount the blur after its content so it tracks native scrolling on Android. */}
      {blurHeader ? (
        <PageHeaderBackground
          key={blurKey}
          blurTarget={blurTarget}
          colorScheme={colorScheme}
          height={headerHeight}
        />
      ) : null}
      {floating && header}
      <PageHeaderTouchShield height={headerHeight} />
    </View>
  );
}
