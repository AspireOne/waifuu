import { SignInMode } from "@components/LoginPage/LoginPage";
import { Trans, t } from "@lingui/macro";
import { Button, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

export type UiProps = {
  mode: SignInMode;
  onModeSwitch: (mode: SignInMode) => void;

  onGoogleSignTriggered: () => void;
  onCredentialsSignTriggered: (email: string, password: string, mode: SignInMode) => void;

  loading?: boolean;
};

export const Ui = (props: UiProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const isSignUpMode = props.mode === "sign-up";

  function handleSubmit() {
    // check validity.
    if (isSignUpMode && password !== passwordConfirm) {
      toast(t`Passwords do not match.`, { type: "warning" });
      return;
    }

    props.onCredentialsSignTriggered(email, password, props.mode);
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        variant={"bordered"}
        label="Email"
        placeholder="john.doe@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        variant={"bordered"}
        label="Password"
        type={"password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isSignUpMode ? (
        <Input
          variant={"bordered"}
          label="Confirm password"
          type={"password"}
          placeholder="Confirm password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
      ) : null}

      {isSignUpMode ? (
        <div className={"flex flex-row gap-2 items-center text-sm"}>
          <Trans>Already have an account?</Trans>
          <Link
            // @ts-ignore
            variant={null}
            className={"cursor-pointer text-sm"}
            onClick={() => props.onModeSwitch("sign-in")}
          >
            <Trans>Sign In</Trans>
          </Link>
        </div>
      ) : (
        <div className={"flex flex-row gap-2 items-center text-sm"}>
          <Trans>Don't have an account yet?</Trans>
          <Link
            // @ts-ignore
            variant={null}
            className={"cursor-pointer text-sm"}
            onClick={() => props.onModeSwitch("sign-up")}
          >
            <Trans>Sign Up</Trans>
          </Link>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        color={"secondary"}
        className={"mt-4"}
        isDisabled={props.loading}
      >
        {isSignUpMode ? <Trans>Sign Up</Trans> : <Trans>Sign In</Trans>}
      </Button>

      <OauthDivider />

      <Button
        isDisabled={props.loading}
        startContent={<FcGoogle />}
        onClick={props.onGoogleSignTriggered}
      >
        {isSignUpMode ? (
          <Trans>Sign up with google</Trans>
        ) : (
          <Trans>Sign in with google</Trans>
        )}
      </Button>
    </div>
  );
};

const OauthDivider = () => {
  return (
    <div className="flex flex-row gap-3 items-center my-3">
      <div className="h-[1px] bg-zinc-600 w-full" />
      <p className="text-foreground-500">or</p>
      <div className="h-[1px] bg-zinc-600 w-full" />
    </div>
  );
};
