import {
  Button,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { FileUpload } from "../shared/FileUpload";
import { useMemo, useState } from "react";

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

  const BannerImageUpload = useMemo(() => {
    return (
      <FileUpload
        onFileRemove={() => setBannerId(null)}
        onSuccess={(data) => setBannerId(data.message && data.message[0]?.id)}
        onError={() => {}}
        structure="SQUARE"
      />
    );
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>
            <h1>Create Forum Post</h1>
          </ModalHeader>

          <ModalBody>
            <h2>Post banner image</h2>
            {BannerImageUpload}
            <Select label="Post category" {...register("category")}>
              <MenuItem value="GENERAL">General</MenuItem>
              <MenuItem value="ART">Art</MenuItem>
              <MenuItem value="ANIMATION">Animation</MenuItem>
              <MenuItem value="MUSIC">Music</MenuItem>
              <MenuItem value="PROGRAMMING">Programming</MenuItem>
              <MenuItem value="GAME_DESIGN">Game Design</MenuItem>
              <MenuItem value="GAME_DEV">Game Development</MenuItem>
            </Select>
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
