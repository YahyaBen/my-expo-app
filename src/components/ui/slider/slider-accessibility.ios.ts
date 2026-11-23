import { accessibilityLabel, accessibilityValue } from '@expo/ui/swift-ui/modifiers';

export function sliderAccessibility(label?: string, value?: string) {
  return [
    ...(label ? [accessibilityLabel(label)] : []),
    ...(value ? [accessibilityValue(value)] : []),
  ];
}
