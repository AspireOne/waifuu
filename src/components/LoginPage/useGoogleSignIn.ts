import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { api } from "@lib/api";
import { getOrInitFirebaseAuth } from "@lib/firebase";
import { getCsrfToken } from "@lib/utils";
import { t } from "@lingui/macro";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { toast } from "react-toastify";

// Note: Apple sign-in must have "skipNativeAuth = true" passed. see https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/authentication/docs/firebase-js-sdk.md
export function useGoogleSignIn(onSignedIn: () => void, onSignInError: () => void) {
  const googleAuthMutation = api.auth.handleSignIn.useMutation({
    onSuccess: onSignedIn,
    onError: onSignInError,
  });

  async function handleGoogleSign() {
    if (!(await firebaseGoogleSign())) return;

    const { token: idToken } = await FirebaseAuthentication.getIdToken({
      forceRefresh: true,
    });

    const csrfToken = getCsrfToken();

    googleAuthMutation.mutate({
      idToken: idToken,
      csrfToken: csrfToken,
    });
  }

  return { handleGoogleSign };
}

async function firebaseGoogleSign() {
  try {
    const result = await FirebaseAuthentication.signInWithGoogle({
      scopes: ["email", "profile"],
      mode: "popup",
    });

    // Sign in on the web layer using the id token.
    const credential = GoogleAuthProvider.credential(result.credential?.idToken);
    const auth = getOrInitFirebaseAuth();
    await signInWithCredential(auth, credential);
    return true;
  } catch (e) {
    console.error("Error signing in using Google!", e);
    toast(t`Could not sign in with google.`, { type: "error" });
    return false;
  }
}
