import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";
import { Trans, t } from "@lingui/macro";
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
              <Trans>Change your user settings</Trans>
            </ModalHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Input
                  {...register("addressedAs")}
                  defaultValue={user?.addressedAs ?? ""}
                  label={t`How you wish characters to address you...`}
                />

                <Textarea
                  {...register("about")}
                  className="w-full"
                  minRows={3}
                  defaultValue={user?.about ?? ""}
                  placeholder={t`Tell us about yourself`}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  `<Trans>Close</Trans>
                </Button>

                <Button isLoading={selfUpdate.isLoading} type="submit" color="primary">
                  <Trans>Save Changes</Trans>
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
