import { fullUrl, paths } from "@/lib/paths";

import { Share } from "@capacitor/share";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Button, Skeleton as UiSkeleton } from "@nextui-org/react";

import Skeleton from "react-loading-skeleton";

import { Capacitor } from "@capacitor/core";
import Title from "@components/ui/Title";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

function Avatar(props: { image: string | null | undefined }) {
  return (
    <UiSkeleton
      className={"mx-auto mb-6 h-40 w-40 rounded-full border-3 border-gray-100"}
      isLoaded={props.image !== undefined}
    >
      <img className={twMerge("h-full w-full")} src={props.image || undefined} alt="avatar" />
    </UiSkeleton>
  );
}

function Buttons(props: { onShare: () => void }) {
  // TODO: Implement follow button.
  return (
    <div className={"flex flex-row justify-center gap-4"}>
      {/*<Button className={"w-32"}>Follow</Button>*/}
      <Button className={"w-32"} variant={"bordered"} onClick={props.onShare}>
        <Trans>Share</Trans>
      </Button>
    </div>
  );
}

export default function Header(props: {
  image?: string | null;
  username?: string | null;
  className?: string;
}) {
  const { _ } = useLingui();

  async function handleShare() {
    const url = fullUrl(paths.userProfile(props.username!));

    if (!Capacitor.isNativePlatform()) {
      await navigator.clipboard.writeText(url);
      toast(_(msg`Copied link to clipboard!`), {
        autoClose: 1500,
        pauseOnHover: false,
        type: "success",
      });
      return;
    }

    await Share.share({
      title: _(msg`Check out ${props.username} on Waifuu.`),
      text: _(msg`Check out ${props.username} on Waifuu.`),
      url: url,
      dialogTitle: _(msg`'Share ${props.username}'s profile with friend.`),
    });
  }

  return (
    <div className={twMerge("", props.className)}>
      <Avatar image={props.image} />

      <div className={"flex flex-row items-center justify-center"}>
        <Title className={twMerge("text-center mx-auto")}>
          {props.username ? `@${props.username}` : <Skeleton inline width={"70%"} />}
        </Title>
      </div>

      <Buttons onShare={handleShare} />
    </div>
  );
}
