import { api } from "@/lib/api";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Wysiwyg } from "../Wysiwyg";
import { FileUploadRaw } from "../ui/FileUploadRaw";

type CreateForumPostModalProps = {
  isOpen: boolean;
  onToggle: VoidFunction;
  onCreate: VoidFunction;
};

type FormContentType = {
  title: string;
  content: string;
  category: string;
};

export const CreateForumPostModal = ({
  isOpen,
  onToggle,
  onCreate,
}: CreateForumPostModalProps) => {
  const { register, handleSubmit, setValue, getValues } = useForm<FormContentType>();
  const createPostMutation = api.forum.create.useMutation();

  const [bannerId, setBannerId] = useState<string | null | undefined>(null);
  const onSubmit = async (data: FormContentType) => {
    if (!bannerId) return;

    await createPostMutation.mutateAsync({
      ...data,
      bannerImage: bannerId,
    });

    onToggle();
    onCreate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>
            <h1>Create Forum Post</h1>
          </ModalHeader>

          <ModalBody>
            <FileUploadRaw label="Post banner image" onUpload={(id) => setBannerId(id)} />
            <Input {...register("title")} autoFocus placeholder="Title" />
            <Input label="Post category" {...register("category")} />
            <Wysiwyg
              onChange={(value) => setValue("content", value)}
              value={getValues("content")}
            />
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
