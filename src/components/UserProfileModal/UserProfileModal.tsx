import UserProfile from "@/pages/user/[username]";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";

export function UserProfileModal(props: {
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
