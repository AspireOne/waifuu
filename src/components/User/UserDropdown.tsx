import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { UserSettingsDialog } from "./UserSettingsDialog";
import useSession from "~/hooks/useSession";

export const UserDropdown = () => {
  const { user } = useSession();

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
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform mr-4 mt-1"
            name={user?.name ?? "Loading..."}
            size="sm"
            src={user?.image}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user?.email}</p>
          </DropdownItem>
          <DropdownItem onClick={toggleSettingsOpen} key="settings">
            My Settings
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <UserSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={toggleSettingsOpen}
      />
    </>
  );
};
