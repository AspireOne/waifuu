import { getOrInitFirebaseAuth } from "@/lib/firebase";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { CombinedPage } from "@components/CombinedPage";
import { Trans, t } from "@lingui/macro";
import { Card, Spacer, Tab, Tabs } from "@nextui-org/react";
import { signOut } from "firebase/auth";

import { Ui, UiProps } from "@components/LoginPage/Ui";
import { useAutoRedirect } from "@components/LoginPage/useAutoRedirect";
import { useCredentialsSignIn } from "@components/LoginPage/useCredentialsSignIn";
import { useGoogleSignIn } from "@components/LoginPage/useGoogleSignIn";
import { CardBody } from "@nextui-org/card";
import { useSession } from "@providers/SessionProvider";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export type SignInMode = "sign-in" | "sign-up";

export const LoginPage = () => {
  const { refetch, user } = useSession();
  const [selectedMode, setSelectedMode] = useState<SignInMode>("sign-up");
  const { redirectOnSuccessfulSignIn } = useAutoRedirect();
  const { handleGoogleSign } = useGoogleSignIn(onSignedIn, onSignInError);
  const { handleCredentialsSign } = useCredentialsSignIn(onSignedIn, onSignInError);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => setLoading(user ? true : loading), [user]);

  async function onSignedIn() {
    refetch();
    await redirectOnSuccessfulSignIn();
    setLoading(false);
  }

  async function onSignInError() {
    toast("There was a backend error signing in.", { type: "error" });
    try {
      await FirebaseAuthentication.signOut();
      await signOut(getOrInitFirebaseAuth());
    } catch (e) {
      console.error("Error signing out from Firebase", e);
    }
    setLoading(false);
  }

  const uiProps: UiProps = {
    loading: loading,
    onCredentialsSignTriggered: async (email, password, mode) => {
      setLoading(true);
      await handleCredentialsSign(email, password, mode);
      setLoading(false);
    },
    onGoogleSignTriggered: async () => {
      setLoading(true);
      await handleGoogleSign();
      setLoading(false);
    },
    onModeSwitch: setSelectedMode,
    mode: selectedMode,
  };

  return (
    <CombinedPage backPath={null} title={t`Sign in`} autoBack={false}>
      <img
        alt="background"
        loading="eager"
        src={"/assets/background.png"}
        className="fixed left-0 top-0 h-full w-full object-cover z-[0]"
        style={{ filter: "brightness(0.3)" }}
        width={1920}
        height={1080}
      />
      {/*<div className="fixed left-0 top-0 h-full w-full bg-background bg-opacity-75" />*/}
      {/*<img
          alt="background"
          loading="eager"
          src={"/assets/character.png"}
          className="mt-[-50px] h-[400px] w-[350px] object-cover"
          width={1920}
          height={1080}
        />*/}

      <div className={"z-[1] relative"}>
        <h1 className="text-4xl font-extrabold text-foreground-800 text-left max-w-[400px] mx-auto">
          <Trans>The companion that is always by your side.</Trans>
        </h1>

        <Spacer y={8} />

        <Card className={"max-w-lg mx-auto"}>
          <CardBody>
            <Tabs
              fullWidth={true}
              selectedKey={selectedMode}
              // @ts-ignore
              onSelectionChange={setSelectedMode}
              aria-label="Sign-options"
              className={"mb-6"}
              isDisabled={loading}
            >
              <Tab key="sign-in" title="Sign In">
                <Ui {...uiProps} />
              </Tab>
              <Tab key="sign-up" title="Sign Up">
                <Ui {...uiProps} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </CombinedPage>
  );
};
