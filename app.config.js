const { resolveBrand } = require('./config/brand');
const assets = require('./config/brand-assets.json');

module.exports = ({ config }) => {
  const { brand, variant } = resolveBrand();
  const headingFont = assets.headingFonts[brand.presentation.headingFont];

  return {
    ...config,
    name: brand.name,
    slug: brand.slug,
    scheme: brand.scheme,
    icon: brand.icon,
    owner: brand.eas?.owner,
    updates: {
      ...config.updates,
      url: brand.eas?.projectId ? `https://u.expo.dev/${brand.eas.projectId}` : undefined,
    },
    ios: {
      ...config.ios,
      icon: brand.ios.icon ?? brand.icon,
      bundleIdentifier: brand.ios.bundleIdentifier,
    },
    android: {
      ...config.android,
      icon: brand.android.icon ?? brand.icon,
      package: brand.android.package,
      adaptiveIcon: brand.android.adaptiveIcon,
      googleServicesFile: brand.android.googleServicesFile,
    },
    extra: {
      ...config.extra,
      eas: brand.eas?.projectId ? { projectId: brand.eas.projectId } : undefined,
      brand: { id: brand.id, name: brand.name, variant, presentation: brand.presentation },
    },
    plugins: [
      ...(config.plugins ?? []),
      ['expo-dev-client', { addGeneratedScheme: variant === 'development' }],
      ['expo-font', { fonts: headingFont.file ? [headingFont.file] : [] }],
      ...(brand.lightIcon
        ? [
            [
              'expo-awesome-app-icon',
              {
                icons: {
                  light: {
                    ios: { light: brand.lightIcon },
                    android: {
                      image: brand.lightIcon,
                      foregroundImage: brand.android.lightIconForeground,
                      backgroundColor: brand.android.adaptiveIcon?.backgroundColor,
                    },
                  },
                },
              },
            ],
          ]
        : []),
      [
        'expo-splash-screen',
        {
          image: brand.splash.image,
          backgroundColor: brand.splash.backgroundColor,
          dark: { backgroundColor: brand.splash.darkBackgroundColor },
          imageWidth: 200,
          resizeMode: 'contain',
        },
      ],
    ],
  };
};
