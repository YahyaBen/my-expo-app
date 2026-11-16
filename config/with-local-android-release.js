const { withAppBuildGradle, withProjectBuildGradle } = require('expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

/** Configure local signing and a short Windows C++ build path through prebuild. */
module.exports = (config) => {
  config = withProjectBuildGradle(config, (result) => {
    if (result.modResults.language !== 'groovy') {
      throw new Error('Local release builds require the Expo Groovy Android template.');
    }
    result.modResults.contents = mergeContents({
      tag: 'local-android-library-cxx-path',
      src: result.modResults.contents,
      anchor: /^apply plugin: "com.facebook.react.rootproject"/m,
      offset: 1,
      comment: '//',
      newSrc: `if (System.getenv("LOCAL_ANDROID_RELEASE") == "1" && System.getenv("LOCAL_ANDROID_CXX_DIRECTORY")) {
    subprojects { nativeProject ->
        if (nativeProject.name == "react-native-nitro-google-signin") {
            nativeProject.plugins.withId("com.android.library") {
                nativeProject.android.externalNativeBuild.cmake.buildStagingDirectory =
                    rootProject.file(System.getenv("LOCAL_ANDROID_CXX_DIRECTORY") + "/g")
            }
        }
    }
}`,
    }).contents;
    return result;
  });
  return withAppBuildGradle(config, (result) => {
    if (result.modResults.language !== 'groovy') {
      throw new Error('Local release signing requires the Expo Groovy Android template.');
    }
    result.modResults.contents = mergeContents({
      tag: 'local-android-release-signing',
      src: result.modResults.contents,
      anchor: /^dependencies\s*\{/m,
      offset: 0,
      comment: '//',
      newSrc: `if (System.getenv("LOCAL_ANDROID_RELEASE") == "1") {
    android {
        if (System.getenv("LOCAL_ANDROID_CXX_DIRECTORY")) {
            externalNativeBuild {
                cmake {
                    buildStagingDirectory file(System.getenv("LOCAL_ANDROID_CXX_DIRECTORY"))
                }
            }
        }
        signingConfigs {
            release {
                storeFile file(System.getenv("LOCAL_ANDROID_KEYSTORE_PATH"))
                storePassword System.getenv("LOCAL_ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("LOCAL_ANDROID_KEY_ALIAS")
                keyPassword System.getenv("LOCAL_ANDROID_KEY_PASSWORD")
            }
        }
        buildTypes {
            release {
                signingConfig signingConfigs.release
            }
        }
    }
}`,
    }).contents;
    return result;
  });
};
