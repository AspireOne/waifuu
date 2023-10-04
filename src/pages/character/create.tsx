import {
  Button,
  Card,
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import Page from "~/components/Page";
import { FileUpload } from "~/components/shared/FileUpload";
import { useForm, SubmitHandler } from "react-hook-form";
import { Visibility } from "@prisma/client";
import Router from "next/router";
import { api } from "~/utils/api";

type CreateInput = {
  title: string;
  description: string;
  visibility: Visibility;

  name: string;
  persona: string;
  dialogue: string;
  nsfw: boolean;
};

const CreateChatPage = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [cover, setCover] = useState<string | undefined>(undefined);

  const createBot = api.bots.create.useMutation({
    onSuccess: (data) => {
      Router.push(`/character/${data.id}/create`);
    },
  });

  const { register, handleSubmit } = useForm<CreateInput>();
  const submitHandler: SubmitHandler<CreateInput> = (data) => {
    createBot.mutateAsync({
      ...data,
      nsfw: data.nsfw ?? false,
      avatar,
      cover,
    });
  };

  const AvatarUpload = useMemo(
    () =>
      FileUpload({
        onSuccess: (data) => setAvatar(data.message[0]?.id),
        onError: () => setAvatar(undefined),
        onFileRemove: () => {},
        structure: "CIRCLE",
      }),
    [],
  );

  const CoverUpload = useMemo(
    () =>
      FileUpload({
        onSuccess: (data) => setCover(data.message[0]?.id),
        onError: () => setCover(undefined),
        onFileRemove: () => {},
        structure: "SQUARE",
      }),
    [],
  );

  return (
    <Page metaTitle="Create a new character">
      <form onSubmit={handleSubmit(submitHandler)}>
        <Card>
          <div className="p-4">
            <h2 className="text-xl mb-4">About</h2>

            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium">Avatar</h3>
                {AvatarUpload}
              </div>

              <Input
                {...register("title")}
                isRequired
                type="text"
                label="Title"
              />

              <Textarea
                {...register("description")}
                isRequired
                type="text"
                label="Description"
              />

              <Select
                {...register("visibility")}
                label="Select visibility"
                isRequired
              >
                <SelectItem key={Visibility.PUBLIC} value={Visibility.PUBLIC}>
                  Public
                </SelectItem>
                <SelectItem key={Visibility.PRIVATE} value={Visibility.PRIVATE}>
                  Private
                </SelectItem>
                <SelectItem key={Visibility.LINK} value={Visibility.LINK}>
                  Only for friends
                </SelectItem>
              </Select>
            </div>

            <Divider className="mt-4 mb-4" />

            <h2 className="text-xl mb-4">Character's character</h2>

            <div className="flex flex-col gap-4">
              <Input
                {...register("name")}
                isRequired
                type="text"
                label="Name"
              />

              <Textarea
                {...register("persona")}
                isRequired
                label="Persona"
                labelPlacement="outside"
              />

              <Textarea
                {...register("dialogue")}
                isRequired
                label="Example dialogue"
                labelPlacement="outside"
              />

              <div className="flex flex-col gap-2">
                <Switch
                  {...register("nsfw")}
                  defaultChecked={false}
                  isSelected={isSelected}
                  onValueChange={setIsSelected}
                >
                  NSFW content
                </Switch>
                <p className="text-small text-default-500">
                  Character will produce content {!isSelected && "not"} suitable
                  for minors
                </p>
              </div>
            </div>

            <Divider className="mt-4 mb-4" />

            <h2 className="text-xl mb-3">Images</h2>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium">Character image</h3>
                {CoverUpload}
              </div>
            </div>

            <div className="flex flex-row w-fit mx-auto mr-0 gap-2 mt-5">
              <Button color="primary" variant="bordered">
                Close
              </Button>
              <Button type="submit" color="primary">
                Create
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </Page>
  );
};

export default CreateChatPage;
