import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import paths from "~/utils/paths";
import { twMerge } from "tailwind-merge";
import { Button, Skeleton as UiSkeleton } from "@nextui-org/react";
import Skeleton from "react-loading-skeleton";

function Avatar(props: { image: string | null | undefined }) {
  return (
    <UiSkeleton
      className={"mx-auto mb-6 h-40 w-40 rounded-full border-3 border-gray-100"}
      isLoaded={props.image !== undefined}
    >
      <img
        className={twMerge("h-full w-full")}
        src={props.image || undefined}
        alt="avatar"
      />
    </UiSkeleton>
  );
}

function Buttons(props: { onClick: () => void }) {
  return (
    <div className={"flex flex-row justify-center gap-4"}>
      <Button className={"w-32"}>Follow</Button>
      <Button className={"w-32"} variant={"bordered"} onClick={props.onClick}>
        Share
      </Button>
    </div>
  );
}

export default function Header(props: {
  image?: string | null;
  username?: string | null;
  className?: string;
}) {
  const [link, setLink] = useState<string | undefined>();

  function handleCopyClicked() {
    // TODO: Ionic copy.
    navigator.clipboard.writeText(link!);
    toast("Copied link to clipboard!", {
      type: "success",
      autoClose: 1000,
    });
  }

  useEffect(() => {
    const link = window.location.origin + paths.userProfile(props.username!);
    setLink(link);
  }, [props.username]);

  return (
    <>
      <div className={twMerge("", props.className)}>
        <Avatar image={props.image} />

        <h3 className={twMerge("mx-4 mb-12 rounded-xl text-center text-3xl")}>
          {props.username && `@${props.username}`}
          {!props.username && <Skeleton inline width={"70%"} />}
        </h3>

        <Buttons onClick={handleCopyClicked} />
      </div>
    </>
  );
}
