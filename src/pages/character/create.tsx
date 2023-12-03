import { FileUploadRaw } from "@/components/ui/FileUploadRaw";
import { TagMultiSelect } from "@/components/ui/TagMultiSelect";
import { api } from "@/lib/api";
import { paths } from "@/lib/paths";
import { AppPage } from "@components/AppPage";
import Title from "@components/ui/Title";
import { Trans, msg, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
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
import { BotVisibility, CharacterTag } from "@prisma/client";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaUserFriends } from "react-icons/fa";
import { IoLockClosed, IoLockOpenOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

type CreateInput = {
  title: string;
  description: string;
  visibility: BotVisibility;
  tags: CharacterTag[];

  name: string;
  persona: string;
  dialogue: string;
  nsfw: boolean;
};

const icons = {
  [BotVisibility.PUBLIC]: <IoLockOpenOutline />,
  [BotVisibility.PRIVATE]: <IoLockClosed />,
  [BotVisibility.LINK]: <FaUserFriends />,
};

const getDescriptions = () => {
  return {
    [BotVisibility.PUBLIC]: t`Listed publicly among community characters.`,
    [BotVisibility.PRIVATE]: t`Only you can view or access the character.`,
    [BotVisibility.LINK]: t`The character will only be accessible through a link.`,
  };
};

// funny loading texts
/*const getLoadingTexts = () => {
  return [
    t`Creating...`,
    t`Creating...`,
    t`Summoning your character...`,
  ]
} */

const CreateChatPage = () => {
  const { _ } = useLingui();
  const [isSelected, setIsSelected] = useState(false);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [background, setBackground] = useState<string | undefined>(undefined);

  // Mood states
  const [moodImagesEnabled, setMoodImagesEnabled] = useState(false);

  const [sad, setSad] = useState<string | undefined>(undefined);
  const [happy, setHappy] = useState<string | undefined>(undefined);
  const [blushed, setBlushed] = useState<string | undefined>(undefined);
  const [neutral, setNeutral] = useState<string | undefined>(undefined);

  const [visibilityIcon, setVisibilityIcon] = useState<React.ReactNode>();

  const createBot = api.bots.create.useMutation({
    onSuccess: (data) => {
      Router.replace(paths.botChatMainMenu(data.id));
    },
  });

  const { register, handleSubmit, setValue, watch } = useForm<CreateInput>();
  const visibility = watch("visibility");

  useEffect(() => {
    setVisibilityIcon(visibility ? icons[visibility] : undefined);
  }, [visibility]);

  const submitHandler: SubmitHandler<CreateInput> = (data) => {
    if (!avatar) {
      toast(_(msg`Avatar is required`), { type: "warning" });
      return;
    }

    createBot.mutate({
      ...data,
      nsfw: isSelected,
      backgroundImage: background,
      avatar: avatar,
      tags: data.tags,
      cover: cover,
      moodImagesEnabled: moodImagesEnabled,
      sadImageId: sad,
      happyImageId: happy,
      neutralImageId: neutral,
      blushedImageId: blushed,
    });
  };

  return (
    <AppPage title={_(msg`Create New Character`)} backPath={paths.discover}>
      <form className="md:w-[600px] mx-auto" onSubmit={handleSubmit(submitHandler)}>
        <Card>
          <div className="p-4">
            <Title
              as={"h2"}
              description={_(msg`The public information about your character.`)}
            >
              <Trans>About Character</Trans>
            </Title>

            <div className="flex flex-col gap-4">
              <Input
                variant={"faded"}
                labelPlacement={"inside"}
                description={_(msg`The public title of your character.`)}
                max={43}
                maxLength={43}
                {...register("title")}
                isRequired
                type="text"
                label={_(msg`Title`)}
              />

              <Textarea
                {...register("description")}
                description={_(msg`A public description of your character.`)}
                max={1000}
                maxLength={1000}
                isRequired
                type="text"
                label={_(msg`Description`)}
                variant={"faded"}
              />

              <Select
                variant={"faded"}
                startContent={visibilityIcon}
                {...register("visibility")}
                label={_(msg`Select visibility`)}
                defaultSelectedKeys={[BotVisibility.PUBLIC]}
                description={
                  getDescriptions()[visibility] ||
                  _(msg`Who will be able to see and access your character?`)
                }
                isRequired={true}
              >
                <SelectItem
                  startContent={icons[BotVisibility.PUBLIC]}
                  key={BotVisibility.PUBLIC}
                  value={BotVisibility.PUBLIC}
                >
                  {t`Public`}
                </SelectItem>
                <SelectItem
                  startContent={icons[BotVisibility.PRIVATE]}
                  key={BotVisibility.PRIVATE}
                  value={BotVisibility.PRIVATE}
                >
                  {t`Private`}
                </SelectItem>
                <SelectItem
                  startContent={icons[BotVisibility.LINK]}
                  key={BotVisibility.LINK}
                  value={BotVisibility.LINK}
                >
                  {t`Only friends`}
                </SelectItem>
              </Select>

              <TagMultiSelect
                description={_(msg`Select what describes the character best.`)}
                onSelectTagIds={(ids) => setValue("tags", ids)}
              />
            </div>

            <CategoryDivider />

            <Title
              as={"h2"}
              description={_(msg`Define how the character will act and respond.`)}
            >
              <Trans>Persona</Trans>
            </Title>

            <div className="flex flex-col gap-4">
              <Input
                variant={"faded"}
                {...register("name")}
                isRequired
                type="text"
                max={43}
                maxLength={43}
                label={_(msg`Name`)}
                description={_(msg`The name of your character.`)}
              />

              <Textarea
                variant={"faded"}
                {...register("persona")}
                isRequired
                label={_(msg`Persona`)}
                max={500}
                maxLength={500}
                maxRows={3}
                description={_(
                  msg`The personality of your character. Keep it short and simple. Our AI can infer a lot.`,
                )}
              />

              <Textarea
                variant={"faded"}
                {...register("dialogue")}
                label={_(msg`Example dialogue`)}
                placeholder={_(msg`User: Hello! Bot: Hi!`)}
                description={_(
                  msg`If you want to specify your character's behavior even more precisely, you can provide an example dialogue.`,
                )}
              />
            </div>

            <CategoryDivider />

            <Title as={"h2"} description={_(msg`Now the really important part!`)}>
              Images
            </Title>
            {/*TODO: Add descriptions, improve design.s*/}
            <div className={"space-y-4"}>
              <FileUploadRaw required onUpload={(id) => setAvatar(id)} label="Avatar" />
              <FileUploadRaw onUpload={(id) => setCover(id)} label={_(msg`Cover`)} />
              <FileUploadRaw
                onUpload={(id) => setBackground(id)}
                label={_(msg`Background image`)}
              />
            </div>

            {/*compensate for the file upload having a large marginh*/}
            <CategoryDivider className={"my-7"} />

            {/*Comment it out for now since we do not have it implemented yet.*/}
            {/*<Accordion>
              <AccordionItem
                key="1"
                aria-label={_(msg`Advanced mood settings`)}
                subtitle={
                  <>
                    <Checkbox
                      checked={moodImagesEnabled}
                      onChange={() => setMoodImagesEnabled(!moodImagesEnabled)}
                    />
                    <Trans>Click to enable advanced mood settings</Trans>
                  </>
                }
                title={_(msg`Advanced mood settings`)}
              >
                <FileUploadRaw
                  label={_(msg`Image for mood 'neutral'`)}
                  onUpload={(id) => setNeutral(id)}
                />
                <FileUploadRaw
                  label={_(msg`Image for mood 'sad'`)}
                  onUpload={(id) => setSad(id)}
                />
                <FileUploadRaw
                  label={_(msg`Image for mood 'blushed'`)}
                  onUpload={(id) => setBlushed(id)}
                />
                <FileUploadRaw
                  label={_(msg`Image for mood 'happy'`)}
                  onUpload={(id) => setHappy(id)}
                />
              </AccordionItem>
            </Accordion>

            <CategoryDivider/>
            */}

            <div className="flex flex-row justify-between w-full items-center">
              <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                <Trans>NSFW</Trans>
              </Switch>
              {/* TODO: Add some fun texts or submit it and show some loading toast, because this might take long time. */}
              <Button
                type="submit"
                color="primary"
                isLoading={createBot.isLoading}
                variant={"solid"}
              >
                <Trans>Create</Trans>
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </AppPage>
  );
};

const CategoryDivider = (props: { className?: string }) => {
  // specify mt bigger to compensate.
  return <Divider className={twMerge("mb-4 mt-5", props.className)} />;
};

export default CreateChatPage;
