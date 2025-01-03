import credentialsSignInSchema from "@/server/shared/credentialsSignInSchema";
import { getOrInitFirebaseAuth } from "@lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { SignInMode } from "@components/LoginPage/LoginPage";
import { api } from "@lib/api";
import { getCsrfToken } from "@lib/utils";
import { t } from "@lingui/macro";
import { toast } from "react-toastify";

export const useCredentialsSignIn = (onSignedIn: () => void, onSignInError: () => void) => {
  const credentialsAuthMutation = api.auth.handleSignIn.useMutation({
    onSuccess: onSignedIn,
    onError: onSignInError,
  });

  async function handleCredentialsSign(email: string, password: string, mode: SignInMode) {
    console.log(`[Auth] Starting ${mode} process for email: ${email.slice(0,4)}...`);
    const creds = { email, password };

    const { success: isValid } = credentialsSignInSchema.safeParse(creds);
    if (!isValid) {
      console.log('[Auth] Validation failed for credentials');
      toast("Please check your email/password.", { type: "warning" });
      return;
    }
    console.log('[Auth] Credentials validation passed');

    const result = mode === "sign-up" ? await signUp(creds) : await signIn(creds);
    if (!result) return;

    console.log('[Auth] Attempting to get Firebase ID token');
    try {
      const auth = getOrInitFirebaseAuth();
      const idToken = await getIdToken(auth.currentUser!, true);
      console.log('[Auth] Successfully obtained Firebase ID token');

      console.log('[Auth] Starting server auth mutation');
      credentialsAuthMutation.mutate({
        idToken: idToken,
        csrfToken: getCsrfToken(),
      });
    } catch (e) {
      console.error('[Auth] Failed to get ID token:', e);
      throw e;
    }
  }
  return { handleCredentialsSign };
};

async function signIn(creds: { email: string; password: string }) {
  try {
    const auth = getOrInitFirebaseAuth();
    return await signInWithEmailAndPassword(auth, creds.email, creds.password);
  } catch (e: any) {
    if (
      e.code === "auth/user-not-found" ||
      e.code === "auth/wrong-password" ||
      e.code === "auth/invalid-credential" ||
      e.code === "auth/invalid-email"
    ) {
      toast(t`Wrong email/password.`, { type: "error" });
    } else {
      toast(t`There was an error signing in.`, { type: "error" });
    }

    return false;
  }
}

async function signUp(creds: { email: string; password: string }) {
  console.log('[Auth] Starting sign up process');
  try {
    console.log('[Auth] Calling Firebase createUserWithEmailAndPassword with', creds);
    const auth = getOrInitFirebaseAuth();
    console.log('[Auth] Got firebase auth');
    const result = await createUserWithEmailAndPassword(auth, creds.email, creds.password);
    console.log('[Auth] Successfully created user account');
    return result;
  } catch (error: any) {
    console.error('[Auth] Sign up error:', error.code, error);
    // biome-ignore format: off.
    if (error.code === "auth/email-already-in-use") toast(t`Account already exists.`, { type: "error" });
    else if (error.code === "auth/weak-password") toast(t`Password is too weak.`, { type: "error" });
    else if (error.code === "auth/too-many-requests") toast(t`Too many attempts. Please try again later.`, { type: "error" });
    else if (error.code === "auth/user-disabled") toast(t`User disabled.`, { type: "error" });
    else if (error.code === "auth/operation-not-allowed") toast(t`Disallowed.`, { type: "error" });
    else if (error.code === "auth/invalid-email") toast(t`Invalid email.`, { type: "error" });

    else toast(t`There was an error signing up.`, { type: "error" });
    return false;
  }
}
