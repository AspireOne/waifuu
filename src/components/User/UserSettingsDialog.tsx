import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

type UserSettingsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UserSettingsDialog = ({
  isOpen,
  onOpenChange,
}: UserSettingsDialogProps) => {
  const { data } = useSession();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change your user settings
            </ModalHeader>
            <ModalBody>
              <Input
                defaultValue={data?.user.name ?? ""}
                label="How you wish characters to address you..."
              />
              <Textarea
                className="w-full"
                minRows={3}
                placeholder="Tell us about yourself..."
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
