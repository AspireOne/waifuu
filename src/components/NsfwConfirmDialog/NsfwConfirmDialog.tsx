import { Trans } from "@lingui/macro";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: VoidFunction;
};

// TODO: Server must remember this value to not show this dialog over and over again
export const NsfwConfirmDialog = ({ isOpen, onOpenChange, onConfirm }: Props) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Trans>Are you sure you want to view NSFW content?</Trans>
            </ModalHeader>
            <ModalBody>
              <Trans>
                You must be 18 years or older to view content only meant for adults.
              </Trans>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Button color="primary" onPress={onConfirm}>
                <Trans>I am 18 or older</Trans>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
