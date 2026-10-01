const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('lottie');

module.exports = process.env.NODE_ENV === 'production'
  ? config
  : require('@storybook/react-native/metro/withStorybook').withStorybook(config, { enabled: true });
