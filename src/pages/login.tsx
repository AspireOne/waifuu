import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";
import { getOrInitFirebaseAuth } from "@/lib/firebase";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { CombinedPage } from "@components/CombinedPage";
import { semanticPaths } from "@lib/paths";
import { Trans, t } from "@lingui/macro";
import { Button, Card, Image } from "@nextui-org/react";
import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrfToken"))
    ?.split("=")[1];
}

async function signInUsingGoogleRaw() {
  console.log("Signing in using google...");

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
    toast(t`Error signing in with Google!`, { type: "error" });
    return false;
  }
}

const Login = () => {
  const searchParams = useSearchParams();
  const session = useSession();
  const router = useRouter();
  const redirect = searchParams.get("redirect");

  //! IMPORTANT Check for session.user instead of session.status.
  useEffect(() => {
    if (session.user) {
      router.replace(redirect || semanticPaths.appIndex);
    }
  }, [session.user, session.user?.id, redirect, router]);

  const googleAuthMutation = api.auth.handleFirebaseSignIn.useMutation({
    onSuccess: async (data, variables, context) => {
      console.log(
        "Successfully logged in with Google after contacing backend!",
        JSON.stringify(data),
      );

      // Remove this because this out because it creates a loop for some reason.
      // router.replace((redirect as string) || semanticPaths.appIndex);
      // session.refetch();

      //window.location.replace(redirect || semanticPaths.appIndex);
    },
    onError: async (error) => {
      console.error("Error logging in with Google!", error);
      await FirebaseAuthentication.signOut();
      await signOut(getOrInitFirebaseAuth());
    },
  });

  // NOTE: APPLE SIGN IN must have "skipNativeAuth = true" passed.
  // https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/authentication/docs/firebase-js-sdk.md
  async function handleGoogleSignIn() {
    if (session.status === "authenticated") {
      console.warn("Tried to sign in while already being authenticated.");
    }

    if (!(await signInUsingGoogleRaw())) return;

    console.log("Signed in using google, getting id token and contacting backend...");

    const { token: idToken } = await FirebaseAuthentication.getIdToken({
      forceRefresh: true,
    });

    if (!idToken) {
      console.error("Error getting ID token from Google! This should not happen!", idToken);
      return;
    }

    const csrfToken = getCsrfToken();

    googleAuthMutation.mutate({
      idToken: idToken,
      csrfToken: csrfToken,
    });
  }

  return (
    <CombinedPage title={t`Sign in`} autoBack={false}>
      <Image
        alt="background"
        loading="eager"
        src={"/assets/background.png"}
        className="fixed left-0 top-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="fixed left-0 top-0 z-20 h-full w-full bg-black bg-opacity-75" />

      <div className="fixed w-full max-w-[500px] left-[50%] top-15 z-30 translate-x-[-50%] p-7">
        <h1 className="text-4xl font-extrabold text-white">
          <Trans>The companion that is always by your side.</Trans>
        </h1>

        <Image
          alt="background"
          loading="eager"
          src={"/assets/character.png"}
          className="mt-[-50px] h-[400px] w-[350px] object-cover"
          width={1920}
          height={1080}
        />

        <Card className="flex-column flex gap-3 p-2">
          <Button size="lg" startContent={<FcGoogle />} onClick={handleGoogleSignIn}>
            <Trans>Sign in with google</Trans>
          </Button>
          {/*<Button size="lg" startContent={<AiFillFacebook />}>
            Login with Facebook
          </Button>
          <Button size="lg" startContent={<BsTwitter />}>
            Login with Twitter
          </Button>*/}
        </Card>
      </div>
    </CombinedPage>
  );
};

export default Login;
