const { resolveBrand } = require('./config/brand');
const assets = require('./config/brand-assets.json');

module.exports = ({ config }) => {
  const { brand, variant } = resolveBrand();
  const headingFont = assets.headingFonts[brand.presentation.headingFont];
  const androidGoogleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY?.trim();
  const iosGoogleMapsApiKey = process.env.GOOGLE_MAPS_IOS_API_KEY?.trim();
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  for (const [name, value] of [
    ['EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID', googleIosClientId],
    ['EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID', googleWebClientId],
  ]) {
    if (value && !/^\d+-[\w-]+\.apps\.googleusercontent\.com$/.test(value)) {
      throw new Error(`${name} must be a Google OAuth client ID.`);
    }
  }

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
