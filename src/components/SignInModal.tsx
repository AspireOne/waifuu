import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@nextui-org/react";

export default function SignInModal(props: {}) {
  return (
    <Modal
      isOpen={true}
      placement={"auto"}
      hideCloseButton={true}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>Please log in before continuing</ModalHeader>
        <ModalBody>
          <Button
            startContent={<FcGoogle size={20} />}
            // TODO: Implement this.
            //onClick={() => signIn("google")}
            className={
              "rounded-md border border-zinc-500 bg-transparent px-3 py-2 " +
              "mx-auto my-6"
            }
          >
            <p className={"text-sm font-bold"}>Log in using Google</p>
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
