import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

export const ConfirmationModal = (props: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClick: () => void;
}) => {
  const { _ } = useLingui();
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {_(msg`Unsubscribe from current plan`)}
            </ModalHeader>
            <ModalBody>
              <p>
                <Trans>
                  Do you really want to unsubscribe from this subscription? This action cannot
                  be undone.
                </Trans>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Button
                color="danger"
                isLoading={!props.isOpen}
                onPress={() => {
                  onClose();
                  props.onClick();
                }}
              >
                <Trans>Unsubscribe</Trans>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
