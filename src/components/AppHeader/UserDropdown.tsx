import { useSession } from "@/hooks/useSession";
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
import { useRouter } from "next/router";
import { AiOutlineUser } from "react-icons/ai";
import { LiaFantasyFlightGames } from "react-icons/lia";
import { twMerge } from "tailwind-merge";
import { UserDropdownSettingsDialog } from "./UserDropdownSettingsDialog";

export const UserDropdown = (props: { className?: string }) => {
  const { user, status } = useSession();
  const router = useRouter();

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

  return (
    <>
      <Dropdown placement="bottom-end" size={"lg"}>
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
          <DropdownItem isDisabled={true} key="profile" className="h-14 gap-2">
            <p className="font-semibold">
              <Trans>Signed in as</Trans>
            </p>
            <p className="font-semibold">{user?.email}</p>
          </DropdownItem>
          <DropdownItem
            startContent={<AiOutlineUser />}
            onClick={() => router.push(paths.profile)}
          >
            <Trans>My profile</Trans>
          </DropdownItem>
          <DropdownItem
            startContent={<LiaFantasyFlightGames />}
            onClick={toggleSettingsOpen}
            key="settings"
          >
            <Trans>General character settings</Trans>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <UserDropdownSettingsDialog isOpen={isSettingsOpen} onOpenChange={toggleSettingsOpen} />
    </>
  );
};
