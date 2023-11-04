import { Trans } from "@lingui/macro";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { BsShareFill } from "react-icons/bs";

const ShareDropdown = () => {
  return (
    <Dropdown className="flex-none">
      <DropdownTrigger>
        <button>
          <BsShareFill size={25} color="white" />
        </button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem className="text-white" key="edit">
          <Trans>Share on Twitter</Trans>
        </DropdownItem>
        <DropdownItem className="text-white" key="edit">
          <Trans>Share on Instagram</Trans>
        </DropdownItem>
        <DropdownItem className="text-white" key="edit">
          <Trans>Share on Facebook</Trans>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export { ShareDropdown };
