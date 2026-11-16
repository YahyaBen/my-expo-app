import { Platform } from 'react-native';

/** Load native Google code only after an explicit sign-in action. */
export async function getGoogleIdToken(): Promise<string | null> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  if (!webClientId || (Platform.OS === 'ios' && !iosClientId)) {
    throw new Error('auth.signInUnavailable');
  }

  let google: typeof import('react-native-nitro-google-signin');
  try {
    google = await import('react-native-nitro-google-signin');
  } catch {
    // An older native build can still present the email/password flow.
    throw new Error('auth.signInUnavailable');
  }

  try {
    google.GoogleOneTapSignIn.configure({ webClientId, iosClientId, offlineAccess: false });
    await google.GoogleOneTapSignIn.checkPlayServices();
    // Always offer account selection, including after signing out of our app.
    const response = await google.GoogleOneTapSignIn.presentExplicitSignIn();
    if (google.isCancelledResponse(response)) return null;
    if (!google.isSuccessResponse(response) || !response.data.idToken.trim()) {
      throw new Error('auth.requestFailed');
    }
    return response.data.idToken;
  } catch (error) {
    if (google.isErrorWithCode(error)) {
      if (error.code === google.statusCodes.SIGN_IN_CANCELLED) return null;
      if (error.code === google.statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('auth.googlePlayServicesUnavailable');
      }
    }
    throw error;
  }
}
