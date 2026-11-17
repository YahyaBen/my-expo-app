const { resolveBrand } = require('./config/brand');
const assets = require('./config/brand-assets.json');

module.exports = ({ config }) => {
  const { brand, variant, apiUrl, googleMaps, googleAuth, developmentPushTopic } = resolveBrand();
  const headingFont = assets.headingFonts[brand.presentation.headingFont];
  const androidGoogleMapsApiKey = googleMaps.androidApiKey || undefined;
  const iosGoogleMapsApiKey = googleMaps.iosApiKey || undefined;
  const googleIosClientId = googleAuth.iosClientId;

  return {
    ...config,
    name: brand.name,
    description: brand.description,
    version: brand.version,
    slug: brand.slug,
    scheme: brand.scheme,
    icon: brand.icon,
    owner: brand.eas?.owner,
    updates: {
      ...config.updates,
      url: brand.eas?.projectId ? `https://u.expo.dev/${brand.eas.projectId}` : undefined,
      ...(process.env.LOCAL_ANDROID_RELEASE === '1'
        ? {
            requestHeaders: {
              ...config.updates?.requestHeaders,
              'expo-channel-name': 'production',
            },
          }
        : {}),
    },
    ios: {
      ...config.ios,
      icon: brand.ios.icon ?? brand.icon,
      bundleIdentifier: brand.ios.bundleIdentifier,
      buildNumber: brand.ios.buildNumber,
    },
    android: {
      ...config.android,
      icon: brand.android.icon ?? brand.icon,
      package: brand.android.package,
      versionCode: brand.android.versionCode,
      adaptiveIcon: brand.android.adaptiveIcon,
      googleServicesFile: brand.android.googleServicesFile,
    },
    extra: {
      ...config.extra,
      googleMaps: {
        android: Boolean(androidGoogleMapsApiKey),
        ios: Boolean(iosGoogleMapsApiKey),
      },
      eas: brand.eas?.projectId ? { projectId: brand.eas.projectId } : undefined,
      brand: {
        id: brand.id,
        name: brand.name,
        variant,
        presentation: brand.presentation,
        pushNotifications: Boolean(brand.android.googleServicesFile),
        developmentPushTopic,
        apiUrl,
        googleAuth,
      },
    },
    plugins: [
      ...(config.plugins ?? []),
      ...(process.env.LOCAL_ANDROID_RELEASE === '1' ? ['./config/with-local-android-release'] : []),
      ...(googleIosClientId
        ? [
            [
              'react-native-nitro-google-signin',
              {
                iosUrlScheme: googleIosClientId.split('.').reverse().join('.'),
              },
            ],
          ]
        : brand.android.googleServicesFile
          ? ['react-native-nitro-google-signin']
          : []),
      ['react-native-maps', { androidGoogleMapsApiKey, iosGoogleMapsApiKey }],
      ['expo-dev-client', { addGeneratedScheme: variant === 'development' }],
      ['expo-font', { fonts: headingFont.file ? [headingFont.file] : [] }],
      ...(brand.lightIcon || brand.redIcon
        ? [
            [
              'expo-awesome-app-icon',
              {
                icons: {
                  ...(brand.lightIcon
                    ? {
                        light: {
                          ios: { light: brand.lightIcon },
                          android: {
                            image: brand.lightIcon,
                            foregroundImage: brand.android.lightIconForeground,
                            backgroundColor: brand.android.adaptiveIcon?.backgroundColor,
                          },
                        },
                      }
                    : {}),
                  ...(brand.redIcon
                    ? {
                        red: {
                          ios: { light: brand.redIcon },
                          android: {
                            image: brand.redIcon,
                            foregroundImage: brand.android.redIconForeground,
                            backgroundColor: brand.android.adaptiveIcon?.backgroundColor,
                          },
                        },
                      }
                    : {}),
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
