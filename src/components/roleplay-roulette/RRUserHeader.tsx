import UserProfile from "@/pages/user/[user]";
import PresenceChannelMember from "@/server/shared/presenceChannelMember";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody } from "@nextui-org/card";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export default function RRUserHeader(props: {
  className?: string;
  user: PresenceChannelMember;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = React.useState<boolean>(false);
  const { _ } = useLingui();

  function showProfile() {
    setProfileOpen(true);
  }

  function blockUser() {
    // TODO: Implement.
  }

  return (
    <Card className={twMerge("h-24", props.className)}>
      <UserProfileModal
        username={props.user.info.username}
        isOpen={profileOpen}
        onOpenChange={setProfileOpen}
      />
      <CardBody onClick={showProfile} className={twMerge("flex flex-row gap-4")}>
        <Avatar
          //isBlurred={true} // OMG TENHLE EFEKT MUSÍME NĚKDE POUŽÍT
          name={props.user.info.username}
          onClick={showProfile}
          src={props.user.info.image ?? undefined}
          isBordered={true}
          className={"h-12 w-12 aspect-square rounded-full cursor-pointer"}
          alt="avatar"
        />
        <div className="flex flex-col flex-1">
          <h3 className="text-white">{props.user.info.username}</h3>
          <h6 className="text-gray-400 line-clamp-1">
            {props.user.info.bio || _(msg`No bio.`)}
          </h6>
        </div>

        <HeaderUserDropdown handleShowProfile={showProfile} handleBlockUser={blockUser} />
      </CardBody>
    </Card>
  );
}

/*TODO: Detail, but hide the close button.*/
function HeaderUserDropdown(props: {
  handleShowProfile: () => void;
  handleBlockUser: () => void;
}) {
  return (
    <Dropdown size={"lg"}>
      <DropdownTrigger>
        <Button isIconOnly className={"h-12 w-16 bg-transparent"}>
          <BiDotsVerticalRounded size={30} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with user actions">
        <DropdownItem
          startContent={<BsPerson size={20} />}
          key={"profile"}
          onClick={props.handleShowProfile}
        >
          <Trans>Show Profile</Trans>
        </DropdownItem>
        {/*TODO: Implement.*/}
        {/*<DropdownItem
          startContent={<BsSlashCircle size={20} />}
          color={"danger"}
          key={"block"}
          className={"text-danger"}
          onClick={props.handleBlockUser}
        >
          Block User
        </DropdownItem>*/}
      </DropdownMenu>
    </Dropdown>
  );
}

function UserProfileModal(props: {
  username: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <>
      <Modal
        isDismissable={true}
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className={"p-0 rounded-xl overscroll-contain"}>
              <UserProfile username={props.username} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
