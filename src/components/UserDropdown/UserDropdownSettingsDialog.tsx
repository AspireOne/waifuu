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
import { useForm } from "react-hook-form";
import { api } from "~/lib/api";
import { useSession } from "~/hooks/useSession";

type UserSettingsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

type SubmitData = {
  addressedAs?: string;
  about?: string;
};

export const UserDropdownSettingsDialog = ({
  isOpen,
  onOpenChange,
}: UserSettingsDialogProps) => {
  const { user, refetch } = useSession();

  const selfUpdate = api.users.updateSelf.useMutation({
    onSuccess() {
      onOpenChange(false);
      refetch();
    },
  });
  const { handleSubmit, register } = useForm<SubmitData>();
  const onSubmit = (data: SubmitData) => selfUpdate.mutate(data);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Change your user settings
            </ModalHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Input
                  {...register("addressedAs")}
                  defaultValue={user?.addressedAs ?? ""}
                  label="How you wish characters to address you..."
                />

                <Textarea
                  {...register("about")}
                  className="w-full"
                  minRows={3}
                  defaultValue={user?.about ?? ""}
                  placeholder="Tell us about yourself..."
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>

                <Button
                  isLoading={selfUpdate.isLoading}
                  type="submit"
                  color="primary"
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
