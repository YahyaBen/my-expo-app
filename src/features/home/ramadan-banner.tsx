import {
  Column,
  RNHostView,
  UniversalTextContent,
  nativeFillWidth,
  nativeFillWidthCenter,
  useHostColorScheme,
} from '@components/ui';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

const stars = [
  [28, 53],
  [108, 37],
  [132, 97],
  [237, 37],
  [250, 104],
  [331, 64],
] as const;

/** Static content decoration; it has no connection to header geometry or navigation. */
export function RamadanBanner({ width }: Readonly<{ width: number }>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const height = (width * 144) / 360;

  return (
    <Column
      spacing={0}
      modifiers={nativeFillWidth}
      style={{ borderRadius: radii.card, backgroundColor: colors.surfaceVariant }}
      testID="home-ramadan-banner"
    >
      <RNHostView matchContents>
        <View
          pointerEvents="none"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ width, height }}
          testID="home-ramadan-artwork"
        >
          <Svg
            width={width}
            height={height}
            viewBox="0 0 360 144"
            preserveAspectRatio="xMidYMid meet"
          >
            <G fill="none" stroke={colors.tint} strokeWidth={1} opacity={0.08}>
              <Path d="M 112 144 V 85 Q 112 45 180 16 Q 248 45 248 85 V 144" />
              <Path d="M 100 144 V 84 Q 100 39 180 3 Q 260 39 260 84 V 144" />
              <Circle cx={180} cy={70} r={56} />
            </G>

            <G transform="translate(140 24) scale(3.4)" fill={colors.warning}>
              <Path d="M 21 12.8 A 9 9 0 1 1 11.2 3 A 7 7 0 0 0 21 12.8 Z" />
            </G>

            <G fill={colors.warning}>
              {stars.map(([x, y]) => (
                <Path
                  key={`${x}-${y}`}
                  transform={`translate(${x} ${y})`}
                  d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z"
                />
              ))}
            </G>
            <G fill={colors.tint} opacity={0.25}>
              <Circle cx={42} cy={104} r={1.5} />
              <Circle cx={122} cy={64} r={1.5} />
              <Circle cx={229} cy={79} r={1.5} />
              <Circle cx={309} cy={40} r={1.5} />
            </G>

            <Lantern x={70} y={25} color={colors.warning} fill={colors.warningContainer} />
            <Lantern x={288} y={12} color={colors.warning} fill={colors.warningContainer} />
            <Path
              d="M 24 130 Q 90 115 158 130 T 336 130"
              fill="none"
              stroke={colors.tint}
              strokeWidth={1}
              opacity={0.1}
            />
          </Svg>
        </View>
      </RNHostView>
      <Column
        alignment="center"
        modifiers={nativeFillWidthCenter}
        style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}
      >
        <UniversalTextContent variant="subtitle" testID="home-ramadan-greeting">
          {t('home.ramadanGreeting')}
        </UniversalTextContent>
      </Column>
    </Column>
  );
}

function Lantern({
  x,
  y,
  color,
  fill,
}: Readonly<{ x: number; y: number; color: string; fill: string }>) {
  return (
    <G transform={`translate(${x} ${y})`} stroke={color} strokeWidth={1.5} fill="none">
      <Line x1={0} y1={-y} x2={0} y2={14} opacity={0.5} />
      <Circle cx={0} cy={17} r={3} />
      <Path d="M -8 27 L 0 20 L 8 27 Z" fill={fill} />
      <Rect x={-11} y={27} width={22} height={32} rx={4} fill={fill} />
      <Line x1={-4} y1={28} x2={-4} y2={58} opacity={0.5} />
      <Line x1={4} y1={28} x2={4} y2={58} opacity={0.5} />
      <Path d="M -8 60 L 0 66 L 8 60" />
      <Line x1={0} y1={66} x2={0} y2={73} />
    </G>
  );
}
