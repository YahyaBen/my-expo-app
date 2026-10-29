const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins');

/** Reconcile permissions enabled after an earlier prebuild explicitly blocked them. */
module.exports = function withAndroidPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const normalize = AndroidConfig.Permissions.ensurePermissionNameFormat;
    const allowed = new Set((config.android?.permissions ?? []).map(normalize));
    const blocked = new Set((config.android?.blockedPermissions ?? []).map(normalize));

    for (const permission of config.modResults.manifest['uses-permission'] ?? []) {
      const attributes = permission.$;
      const name = attributes['android:name'];
      if (allowed.has(name) && !blocked.has(name) && attributes['tools:node'] === 'remove') {
        // Expo otherwise keeps this old removal marker when reusing a native project.
        delete attributes['tools:node'];
      }
    }
    return config;
  });
};
