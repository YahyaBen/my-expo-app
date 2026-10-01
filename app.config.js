module.exports = ({ config }) => {
  const androidMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY?.trim();

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      ...(androidMapsApiKey
        ? [['react-native-maps', { androidGoogleMapsApiKey: androidMapsApiKey }]]
        : []),
    ],
  };
};
