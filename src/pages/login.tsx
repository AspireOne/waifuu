import { Button, Card, Image } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import Page from "~/components/Page";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const googleAuthMutation = api.auth.handleFirebaseSignIn.useMutation({
    onSuccess: (data) => {
      console.log("Successfully logged in with Google!", data);
      router.reload(); // Reload so that session token from cookies is picked up.
    },
    onError: (error) => {
      console.error("Error logging in with Google!", error);
    },
  });

  // NOTE: APPLE SIGN IN must have "skipNativeAuth = true" passed.
  // https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/authentication/docs/firebase-js-sdk.md
  async function handleGoogleSignIn() {
    console.log("Signing in using google...");
    try {
      await FirebaseAuthentication.signInWithGoogle({
        scopes: ["email", "profile"],
        mode: "popup",
      });
    } catch (e) {
      console.error("Error signing in using Google!", e);
      toast("Error signing in with Google!", { type: "error" });
      return;
    }

    console.log(
      "Signed in using google, getting id token and contacting backend...",
    );
    const idToken = await FirebaseAuthentication.getIdToken({
      forceRefresh: true,
    });

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrfToken"))
      ?.split("=")[1];

    if (!idToken.token) {
      console.error(
        "Error getting ID token from Google! This should not happen!",
        idToken,
      );
      return;
    }

    googleAuthMutation.mutate({
      idToken: idToken.token,
      csrfToken: csrfToken,
    });
  }

  return (
    <Page metaTitle={"Log in"} unprotected>
      <Image
        alt="background"
        loading="eager"
        src={"/assets/background.png"}
        className="fixed left-0 top-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="fixed left-0 top-0 z-20 h-full w-full bg-black bg-opacity-75" />

      <div className="fixed left-[50%] top-5 z-30 max-w-[500px] translate-x-[-50%] p-7">
        <h1 className="text-5xl font-extrabold text-white">
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
