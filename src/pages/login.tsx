import { Button, Card, Image } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import Page from "~/components/Page";
import { api } from "~/lib/api";
import { useRouter } from "next/router";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { toast } from "react-toastify";
import { paths } from "~/lib/paths";
import { useSession } from "~/hooks/useSession";
import { useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { getOrInitFirebaseAuth } from "~/lib/firebase/getOrInitFirebaseAuth";
import { Constants } from "~/lib/constants";

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
    const credential = GoogleAuthProvider.credential(
      result.credential?.idToken,
    );
    const auth = getOrInitFirebaseAuth();
    await signInWithCredential(auth, credential);
    return true;
  } catch (e) {
    console.error("Error signing in using Google!", e);
    toast("Error signing in with Google!", { type: "error" });
    return false;
  }
}

const Login = () => {
  const router = useRouter();
  const session = useSession();
  const redirect = router.query.redirect;

  // Check for session.user instead of session.status.
  useEffect(() => {
    if (session.user) {
      router.replace((redirect as string) || Constants.APP_INDEX_PATH);
    }
  }, [session.user, session.user?.id]);

  const googleAuthMutation = api.auth.handleFirebaseSignIn.useMutation({
    onSuccess: async (data, variables, context) => {
      console.log(
        "Successfully logged in with Google after contacing backend!",
        JSON.stringify(data),
      );

      router.replace((redirect as string) || Constants.APP_INDEX_PATH);
      session.refetch();
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

    console.log(
      "Signed in using google, getting id token and contacting backend...",
    );

    const { token: idToken } = await FirebaseAuthentication.getIdToken({
      forceRefresh: true,
    });

    if (!idToken) {
      console.error(
        "Error getting ID token from Google! This should not happen!",
        idToken,
      );
      return;
    }

    const csrfToken = getCsrfToken();

    googleAuthMutation.mutate({
      idToken: idToken,
      csrfToken: csrfToken,
    });
  }

  return (
    <Page title={"Log in"} unprotected autoBack={false}>
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
          The companion that is always by your side.
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
          <Button
            size="lg"
            startContent={<FcGoogle />}
            onClick={handleGoogleSignIn}
          >
            Login with Google
          </Button>
          <Button size="lg" startContent={<AiFillFacebook />}>
            Login with Facebook
          </Button>
          <Button size="lg" startContent={<BsTwitter />}>
            Login with Twitter
          </Button>
        </Card>
      </div>
    </Page>
  );
};

export default Login;
