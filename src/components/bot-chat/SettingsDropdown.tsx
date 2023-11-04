import { Trans } from "@lingui/macro";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { BsThreeDotsVertical } from "react-icons/bs";

const SettingsDropdown = () => {
  return (
    <Dropdown className="flex-none">
      <DropdownTrigger>
        <button>
          <BsThreeDotsVertical size={25} color="white" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem className="text-white" key="remove">
          <Trans>Remove chat</Trans>
        </DropdownItem>
        <DropdownItem className="text-white" key="settings">
          <Trans>Settings</Trans>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export { SettingsDropdown };
