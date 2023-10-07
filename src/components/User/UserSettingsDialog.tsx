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
import { api } from "~/utils/api";

type UserSettingsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

type SubmitData = {
  addressedAs?: string;
  about?: string;
};

export const UserSettingsDialog = ({
  isOpen,
  onOpenChange,
}: UserSettingsDialogProps) => {
  const user = api.users.getSelf.useQuery();

  const selfUpdate = api.users.updateSelf.useMutation({
    onSuccess() {
      onOpenChange(false);
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
                  defaultValue={user.data?.addressedAs ?? ""}
                  label="How you wish characters to address you..."
                />

                <Textarea
                  {...register("about")}
                  className="w-full"
                  minRows={3}
                  defaultValue={user.data?.about ?? ""}
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
