import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { UserSettingsDialog } from "./UserSettingsDialog";

export const UserDropdown = () => {
  const { data } = useSession();

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

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={data?.user.name ?? "Loading..."}
          size="sm"
          src={data?.user.image}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{data?.user.email}</p>
        </DropdownItem>
        <DropdownItem onClick={toggleSettingsOpen} key="settings">
          My Settings
        </DropdownItem>
        <DropdownItem onClick={() => signOut()} key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>

      <UserSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={toggleSettingsOpen}
      />
    </Dropdown>
  );
};
