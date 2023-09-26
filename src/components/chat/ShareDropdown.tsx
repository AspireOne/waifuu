import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
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
          Share on Twitter
        </DropdownItem>
        <DropdownItem className="text-white" key="edit">
          Share on Instagram
        </DropdownItem>
        <DropdownItem className="text-white" key="edit">
          Share on Facebook
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export { ShareDropdown };
