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

type CreateForumPostModalProps = {
  isOpen: boolean;
  onToggle: VoidFunction;
};

type FormContentType = {
  title: string;
  description: string;
};

export const CreateForumPostModal = ({
  isOpen,
  onToggle,
}: CreateForumPostModalProps) => {
  const { register, handleSubmit } = useForm<FormContentType>();

  const onSubmit = (data: FormContentType) => {
    console.log(data);
    onToggle();
  };

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <ModalContent>
        <ModalHeader>
          <h1>Create Forum Post</h1>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("title")} autoFocus placeholder="Title" />
            <Textarea {...register("description")} placeholder="Description" />
          </form>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onToggle}>Close</Button>
          <Button color="primary" autoFocus>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
