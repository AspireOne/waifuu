import {Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {signIn} from "next-auth/react";
import {FcGoogle} from "react-icons/fc";
import {Button} from "@nextui-org/react";

export default function SignInModal(props: {}) {
  return (
    <Modal
      isOpen={true}
      placement={"auto"}
      hideCloseButton={true}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>
          Please log in before continuing
        </ModalHeader>
        <ModalBody>
          <Button
            startContent={<FcGoogle size={20}/>}
            onClick={() => signIn("google")}
            className={"px-3 py-2 bg-transparent rounded-md border border-zinc-500 " +
              "mx-auto my-6"}>
            <p className={"font-bold text-sm"}>
              Log in using Google
            </p>
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}