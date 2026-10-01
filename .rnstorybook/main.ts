import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: [
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-controls',
  ],
};

export default main;
