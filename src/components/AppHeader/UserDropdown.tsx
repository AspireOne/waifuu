import { useSession } from "@/hooks/useSession";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { useIsOnline } from "@hooks/useIsOnline";
import { getOrInitFirebaseAuth } from "@lib/firebase";
import { paths } from "@lib/paths";
import { Trans } from "@lingui/macro";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import * as Sentry from "@sentry/nextjs";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { AiOutlineStar, AiOutlineUser } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export const UserDropdown = (props: { className?: string }) => {
  const { user, status } = useSession();
  const router = useRouter();
  const isOnline = useIsOnline();

  const {
    isOpen: isSettingsOpen,
    onOpenChange: onSettingsOpenChange,
    onClose: onSettingClose,
    onOpen: onSettingOpen,
  } = useDisclosure();
  const toggleSettingsOpen = () => {
    if (isSettingsOpen) onSettingClose();
    else onSettingOpen();
  };

  const hidden = status === "unauthenticated";

  async function handleSignout() {
    try {
      await FirebaseAuthentication.signOut();
      await signOut(getOrInitFirebaseAuth());
    } catch (e) {
      console.error("Error signing out from Firebase", e);
      toast("There was a problem signing out", { type: "error" });
      // log to Sentry
      Sentry.captureException(e);
    }
  }

  return (
    <>
      <Dropdown placement="bottom-end" size={"lg"} isDisabled={!isOnline}>
        <DropdownTrigger className={`${hidden && "invisible"}`}>
          <Avatar
            isBordered
            as="button"
            className={twMerge("transition-transform", props.className)}
            name={user?.name ?? " "}
            size={"sm"}
            src={user?.image}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            // textvalue is so that accesibility does not complain.
            textValue={"Signed in as"}
            isDisabled={true}
            key="profile"
            className="h-14 gap-2"
          >
            <p className="font-semibold">
              <Trans>Signed in as</Trans>
            </p>
            <p className="font-semibold">{user?.email}</p>
          </DropdownItem>
          <DropdownItem
            textValue={"My profile"}
            startContent={<AiOutlineUser />}
            onClick={() => router.push(paths.profile)}
          >
            <Trans>My profile</Trans>
          </DropdownItem>
          <DropdownItem
            textValue={"Subscription plan"}
            startContent={<AiOutlineStar />}
            onClick={() => router.push(paths.pricing)}
            key="subscription-plan"
          >
            <Trans>Subscription plan</Trans>
          </DropdownItem>
          <DropdownItem
            textValue={"Sign Out"}
            startContent={<CiLogout />}
            onClick={handleSignout}
            key="sign-out"
          >
            <Trans>Sign Out</Trans>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
