const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins');

const optionalFeatures = ['android.hardware.screen.portrait', 'android.hardware.wifi'];

module.exports = function withOptionalAndroidFeatures(config) {
  return withAndroidManifest(config, (config) => {
    const { manifest } = AndroidConfig.Manifest.ensureToolsAvailable(config.modResults);
    const features = (manifest['uses-feature'] ??= []);

    for (const name of optionalFeatures) {
      const existing = features.find((feature) => feature.$['android:name'] === name);
      const attributes = {
        'android:name': name,
        'android:required': 'false',
        // Android otherwise favors required="true" when merging library declarations.
        'tools:node': 'replace',
      };

      if (existing) {
        Object.assign(existing.$, attributes);
      } else {
        features.push({ $: attributes });
      }
    }

    return config;
  });
};
