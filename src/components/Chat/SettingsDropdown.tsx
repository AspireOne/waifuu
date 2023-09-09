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
          Remove chat
        </DropdownItem>
        <DropdownItem className="text-white" key="settings">
          Settings
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export { SettingsDropdown };
