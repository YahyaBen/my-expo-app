import type { IconName } from '@components/ui';

/** App destinations and categories, independent of Storybook and translated names. */
export const componentCategories = [
  {
    id: 'layout',
    icon: { ios: 'square.grid.2x2', android: 'widgets' },
    components: ['text', 'icon', 'shape', 'native', 'host', 'page'],
  },
  {
    id: 'controls',
    icon: { ios: 'slider.horizontal.3', android: 'tune' },
    components: [
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
    ],
  },
  {
    id: 'data',
    icon: { ios: 'list.bullet', android: 'list' },
    components: ['list', 'list-item', 'table', 'collapsible', 'refreshable-scroll-view'],
  },
  {
    id: 'media',
    icon: { ios: 'photo', android: 'photo' },
    components: ['circular-carousel', 'stacked-carousel', 'story-list', 'ios-home-grid'],
  },
  {
    id: 'navigation',
    icon: { ios: 'arrow.triangle.branch', android: 'alt_route' },
    components: ['floating-action', 'navigation', 'popover', 'bottom-sheet'],
  },
  {
    id: 'feedback',
    icon: { ios: 'exclamationmark.circle', android: 'error_outline' },
    components: ['badge', 'alert', 'loading', 'empty-state', 'skeleton'],
  },
  {
    id: 'flows',
    icon: { ios: 'app', android: 'apps' },
    components: [
      'appearance',
      'auth',
      'launch-screen',
      'otp-bottom-sheet',
      'verification-code-face',
    ],
  },
] as const satisfies readonly {
  id: string;
  icon: IconName;
  components: readonly string[];
}[];

export type ComponentCategoryId = (typeof componentCategories)[number]['id'];
export type ComponentId = (typeof componentCategories)[number]['components'][number];
export const componentIds = componentCategories.flatMap<ComponentId>(
  ({ components }) => components,
);

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
  'empty-state': { ios: 'folder', android: 'folder_open' },
  appearance: { ios: 'circle.lefthalf.filled', android: 'contrast' },
  auth: { ios: 'lock', android: 'lock' },
};

export const componentCatalog = componentCategories.flatMap(({ id: category, components }) =>
  components.map((id) => ({ id, category, icon: icons[id] ?? genericIcon })),
);

export function isComponentId(value: string | undefined): value is ComponentId {
  return componentIds.some((id) => id === value);
}
