import { semantics } from '@expo/ui/jetpack-compose/modifiers';

export function sliderAccessibility(label?: string, value?: string) {
  const description = [label, value].filter(Boolean).join(', ');
  return description ? [semantics({ contentDescription: description })] : [];
}
