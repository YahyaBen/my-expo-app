import type { IconName } from '@components/ui';

/** App destinations, independent of Storybook registration and translated names. */
export const componentIds = [
  'button',
  'checkbox',
  'chip',
  'switch',
  'slider',
  'picker',
  'date-time-picker',
  'segmented-control',
  'text-input',
  'field-group',
  'form',
  'text',
  'icon',
  'shape',
  'native',
  'host',
  'page',
  'list',
  'list-item',
  'table',
  'collapsible',
  'refreshable-scroll-view',
  'circular-carousel',
  'stacked-carousel',
  'story-list',
  'ios-home-grid',
  'floating-action',
  'navigation',
  'popover',
  'bottom-sheet',
  'alert',
  'loading',
  'skeleton',
  'appearance',
  'auth',
  'launch-screen',
  'otp-bottom-sheet',
  'verification-code-face',
] as const;

export type ComponentId = (typeof componentIds)[number];

const genericIcon: IconName = { ios: 'square.grid.2x2', android: 'widgets' };
const icons: Partial<Record<ComponentId, IconName>> = {
  checkbox: { ios: 'checkmark.square', android: 'check_box' },
  switch: { ios: 'switch.2', android: 'toggle_on' },
  slider: { ios: 'slider.horizontal.3', android: 'tune' },
  'date-time-picker': { ios: 'calendar', android: 'calendar_month' },
  text: { ios: 'textformat', android: 'text_fields' },
  'text-input': { ios: 'pencil', android: 'edit' },
  icon: { ios: 'star', android: 'star' },
  list: { ios: 'list.bullet', android: 'list' },
  table: { ios: 'tablecells', android: 'table_chart' },
  'circular-carousel': { ios: 'photo.circle', android: 'photo' },
  alert: { ios: 'exclamationmark.circle', android: 'error_outline' },
  appearance: { ios: 'circle.lefthalf.filled', android: 'contrast' },
  auth: { ios: 'lock', android: 'lock' },
};

export const componentCatalog = componentIds.map((id) => ({
  id,
  icon: icons[id] ?? genericIcon,
}));

export function isComponentId(value: string | undefined): value is ComponentId {
  return componentIds.some((id) => id === value);
}
