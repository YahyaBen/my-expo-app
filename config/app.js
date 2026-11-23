/**
 * EDIT THIS FILE when creating a new app from the template.
 * Build-time configuration only: native code reads the selected public values.
 * Google client IDs and Maps SDK keys are public app credentials. Never add
 * OAuth client secrets, FCM service-account private keys or signing passwords.
 * Optional environment overrides are documented in .env.example.
 */
module.exports = {
  // Default for local commands. APP_VARIANT / EAS build profiles can override it.
  variant: 'development',

  app: {
    // Internal brand ID, home-screen name, Expo project slug and deep-link scheme.
    id: 'template',
    name: 'Expo Template',
    description: 'Native iOS and Android application template.',
    slug: 'expo-mobile-template',
    scheme: 'expomobiletemplate',

    // Store-visible version. Increase for incompatible native changes (OTA policy).
    version: '1.0.10',

    // Default, optional light and optional red home-screen icons.
    icon: './assets/AppIcon-Dark.icon/Assets/icon.png',
    lightIcon: './assets/AppIcon-Light.icon/Assets/icon.png',
    redIcon: './assets/AppIcon-Red.icon/Assets/icon.png',
    presentation: {
      palette: 'ux', // 'ux' or 'system'; saved user preferences take precedence.
      launch: 'branded', // 'minimal' or 'branded'.
      headingFont: 'system', // Registered ID in config/brand-assets.json.
      launchArtwork: 'et', // Registered ID in config/brand-assets.json.
    },
    ios: {
      // Production ID; variant identitySuffix is appended automatically.
      bundleIdentifier: 'com.hyrkul.mobiletemplate',
      buildNumber: '1', // iOS CFBundleVersion; increase before another store upload.
      icon: './assets/AppIcon-Dark.icon',
    },
    android: {
      // Production ID; Firebase JSON must match the final package including suffix.
      package: 'com.hyrkul.mobiletemplate',
      versionCode: 18, // Android build number; increase before another Play upload.
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-foreground-dark.png',
        backgroundColor: '#ffffff',
      },
      lightIconForeground: './assets/adaptive-foreground-light.png',
      redIconForeground: './assets/adaptive-foreground-red.png',
    },
    splash: {
      image: './assets/AppIcon-Dark.icon/Assets/icon.png',
      backgroundColor: '#FFFFFF',
      darkBackgroundColor: '#0A0A0A',
    },
    eas: {
      owner: 'hyrkul', // Expo account / organization; optional.
      projectId: 'c8cca991-ec77-476f-b759-3ea8bd075309', // Your EAS UUID; '' for local only.
    },
  },

  // Every variant has its own backend, Firebase registration and Google credentials.
  // API URLs are origins (no trailing /api); '' keeps the offline catalog usable.
  // Maps: enable Maps SDK for Android/iOS; restrict keys by package + SHA-1 / bundle ID.
  // Auth: Web client ID is the backend token audience; iOS ID matches the bundle ID.
  // Android OAuth clients are registered in Google Cloud with package + signing SHA-1;
  // the native sign-in SDK does not take an Android OAuth client ID here.
  variants: {
    development: {
      description: 'Developer build with Metro and native debugging; uses development services.',
      nameSuffix: ' Dev', // Appended to app.name on the home screen.
      identitySuffix: '.dev', // Appended to Android/iOS IDs and deep-link scheme.
      apiUrl:
        'https://api-foodiya-identity-dev-gsh0cye4b0f9fadw.francecentral-01.azurewebsites.net',
      googleServicesFile: './google-services.development.json', // Firebase Android app JSON for dev.
      developmentPushTopic: 'all-testing-et', // Android dev broadcast topic; '' disables joining.
      googleMaps: {
        androidApiKey: 'AIzaSyB8Pgb5oc8r8uJ98Zgn1FNjax_jlrIwR8s', // Google Maps SDK for Android key.
        iosApiKey: '', // Google Maps SDK for iOS key.
      },
      googleAuth: {
        webClientId: '527258283668-dph690h2qc2jsh9onvcjfcjg98mau0gq.apps.googleusercontent.com', // OAuth Web application client ID (*.apps.googleusercontent.com).
        iosClientId: '', // OAuth iOS client ID for the .dev bundle identifier.
      },
    },
    preview: {
      description:
        'Internal release for QA without Metro; uses separately registered preview services.',
      nameSuffix: ' Preview',
      identitySuffix: '.preview',
      apiUrl: '',
      googleServicesFile: '', // Optional preview JSON; must contain the .preview Android package.
      developmentPushTopic: '',
      googleMaps: {
        androidApiKey: '', // Key restricted to the preview Android package + signing SHA-1.
        iosApiKey: '', // Key restricted to the preview iOS bundle identifier.
      },
      googleAuth: {
        webClientId: '', // Web client ID accepted by the preview backend.
        iosClientId: '', // iOS client ID for the .preview bundle identifier.
      },
    },
    production: {
      description: 'Store release using production services and the base application identifiers.',
      nameSuffix: '',
      identitySuffix: '',
      apiUrl: '', // HTTPS required when configured.
      googleServicesFile: './google-services.json', // Firebase Android app JSON for production.
      developmentPushTopic: '',
      googleMaps: {
        androidApiKey: '', // Key restricted to the production package + Play App Signing SHA-1.
        iosApiKey: '', // Key restricted to the production iOS bundle identifier.
      },
      googleAuth: {
        webClientId: '', // Web client ID accepted by the production backend.
        iosClientId: '', // iOS client ID for the production bundle identifier.
      },
    },
  },
};
