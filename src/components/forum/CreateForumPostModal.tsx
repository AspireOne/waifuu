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
import { useMemo, useState } from "react";
import { FileUploadRaw } from "../ui/FileUploadRaw";

type CreateForumPostModalProps = {
  isOpen: boolean;
  onToggle: VoidFunction;
};

type FormContentType = {
  title: string;
  content: string;
  category: string;
};

export const CreateForumPostModal = ({
  isOpen,
  onToggle,
}: CreateForumPostModalProps) => {
  const { register, handleSubmit } = useForm<FormContentType>();
  const createPostMutation = api.forum.create.useMutation();

  const [bannerId, setBannerId] = useState<string | null | undefined>(null);
  const onSubmit = async (data: FormContentType) => {
    if (!bannerId) return;

    await createPostMutation.mutateAsync({
      ...data,
      bannerImage: bannerId,
    });

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
            <FileUploadRaw
              label="Post banner image"
              onUpload={(id) => setBannerId(id)}
            />
            <Input {...register("title")} autoFocus placeholder="Title" />
            <Textarea {...register("content")} placeholder="Content" />
            <Input label="Post category" {...register("category")} />
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
