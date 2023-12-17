import credentialsSignInSchema from "@/server/shared/credentialsSignInSchema";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
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
    const creds = { email, password };

    const { success: isValid } = credentialsSignInSchema.safeParse(creds);
    if (!isValid) {
      toast("Please check your email/password.", { type: "warning" });
      return;
    }

    const result = mode === "sign-up" ? await signUp(creds) : await signIn(creds);
    if (!result) return;

    const { token: idToken } = await FirebaseAuthentication.getIdToken({
      forceRefresh: true,
    });

    credentialsAuthMutation.mutate({
      idToken: idToken,
      csrfToken: getCsrfToken(),
    });
  }
  return { handleCredentialsSign };
};

async function signIn(creds: { email: string; password: string }) {
  try {
    return await FirebaseAuthentication.signInWithEmailAndPassword(creds);
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
  try {
    return await FirebaseAuthentication.createUserWithEmailAndPassword(creds);
  } catch (error: any) {
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
