import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Trans } from "@lingui/macro";

export function MessageDropdown() {
  return (
    <Dropdown className="flex-none">
      <DropdownTrigger>
        <button>
          <BsThreeDotsVertical size={24} color="white" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem className="text-white" key="edit">
          <Trans>Edit</Trans>
        </DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          <Trans>Delete</Trans>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
