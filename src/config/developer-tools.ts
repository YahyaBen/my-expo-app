// Development opens the catalog by default; release mode always excludes it.
export const storybookEnabled = __DEV__ && process.env.EXPO_PUBLIC_STORYBOOK_ENABLED !== 'false';
