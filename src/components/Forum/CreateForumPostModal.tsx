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

type CreateForumPostModalProps = {
  isOpen: boolean;
  onToggle: VoidFunction;
};

type FormContentType = {
  title: string;
  content: string;
};

export const CreateForumPostModal = ({
  isOpen,
  onToggle,
}: CreateForumPostModalProps) => {
  const { register, handleSubmit } = useForm<FormContentType>();
  const createPostMutation = api.forum.create.useMutation();

  const onSubmit = async (data: FormContentType) => {
    await createPostMutation.mutateAsync(data);

    onToggle();
  };

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>
            <h1>Create Forum Post</h1>
          </ModalHeader>

          <ModalBody>
            <Input {...register("title")} autoFocus placeholder="Title" />
            <Textarea {...register("content")} placeholder="Content" />
          </ModalBody>

          <ModalFooter>
            <Button onClick={onToggle}>Close</Button>
            <Button
              type="submit"
              isLoading={createPostMutation.isLoading}
              color="primary"
              autoFocus
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
