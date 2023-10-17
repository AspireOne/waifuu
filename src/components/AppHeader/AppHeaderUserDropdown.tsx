import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { AppHeaderUserDropdownSettingsDialog } from "./AppHeaderUserDropdownSettingsDialog";
import { useSession } from "@/hooks/useSession";
import { twMerge } from "tailwind-merge";

export const AppHeaderUserDropdown = (props: { className?: string }) => {
  const { user, status } = useSession();

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
      <Dropdown placement="bottom-end">
        <DropdownTrigger className={`${hidden && "invisible"}`}>
          <Avatar
            isBordered
            as="button"
            className={twMerge("transition-transform", props.className)}
            name={user?.name ?? " "}
            size={"sm"}
            src={user?.image ?? undefined}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user?.email}</p>
          </DropdownItem>
          <DropdownItem onClick={toggleSettingsOpen} key="settings">
            Character settings
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <AppHeaderUserDropdownSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={toggleSettingsOpen}
      />
    </>
  );
};
