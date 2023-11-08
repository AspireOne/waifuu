import { FileUploadRaw } from "@/components/ui/FileUploadRaw";
import { api } from "@/lib/api";
import { paths } from "@/lib/paths";
import { AppPage } from "@components/AppPage";
import { Trans, msg, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { BotVisibility } from "@prisma/client";
import Router from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type CreateInput = {
  title: string;
  description: string;
  visibility: BotVisibility;
  category: string;

  name: string;
  persona: string;
  dialogue: string;
  nsfw: boolean;
};

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

  const createBot = api.bots.create.useMutation({
    onSuccess: (data) => {
      Router.push(paths.botChatMainMenu(data.id));
    },
  });

  const { register, handleSubmit } = useForm<CreateInput>();
  const submitHandler: SubmitHandler<CreateInput> = (data) => {
    createBot.mutate({
      ...data,
      nsfw: isSelected,
      backgroundImage: background,
      avatar,
      category: data.category,
      cover,
      moodImagesEnabled,
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
            <h2 className="text-xl mb-4">
              <Trans>About Character</Trans>
            </h2>

            <div className="flex flex-col gap-4">
              <FileUploadRaw onUpload={(id) => setAvatar(id)} label="Avatar" />

              <Input {...register("title")} isRequired type="text" label={_(msg`Title`)} />

              <Textarea
                {...register("description")}
                isRequired
                type="text"
                label={_(msg`Description`)}
              />

              <Select {...register("visibility")} label={_(msg`Select visibility`)} isRequired>
                <SelectItem key={BotVisibility.PUBLIC} value={BotVisibility.PUBLIC}>
                  {t`Public`}
                </SelectItem>
                <SelectItem key={BotVisibility.PRIVATE} value={BotVisibility.PRIVATE}>
                  {t`Private`}
                </SelectItem>
                <SelectItem key={BotVisibility.LINK} value={BotVisibility.LINK}>
                  {t`Only for friends`}
                </SelectItem>
              </Select>

              <Input {...register("category")} label={_(msg`Category`)} />
            </div>

            <Divider className="mt-4 mb-4" />

            <h2 className="text-xl mb-4">
              <Trans>Character's character</Trans>
            </h2>

            <div className="flex flex-col gap-4">
              <Input {...register("name")} isRequired type="text" label={_(msg`Name`)} />

              <Textarea
                {...register("persona")}
                isRequired
                label={_(msg`Persona`)}
                labelPlacement="outside"
              />

              <Textarea
                {...register("dialogue")}
                isRequired
                label={_(msg`Example dialogue`)}
                labelPlacement="outside"
              />

              <div className="flex flex-col gap-2">
                <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                  <Trans>NSFW content</Trans>
                </Switch>
                <p className="text-small text-default-500">
                  <Trans>
                    Whether the character will produce content not suitable for minors.
                  </Trans>
                </p>
              </div>
            </div>

            <Divider className="mt-4 mb-4" />

            <h2 className="text-xl mb-3">
              <Trans context={"New Character page category name"}>Images</Trans>
            </h2>
            <FileUploadRaw onUpload={(id) => setCover(id)} label={_(msg`Cover`)} />
            <FileUploadRaw onUpload={(id) => setBackground(id)} label="Background image" />

            <Divider className="mt-4 mb-4" />

            <Accordion>
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

            <div className="flex flex-row w-fit mx-auto mr-0 gap-2 mt-5">
              <Button color="primary" variant="bordered">
                <Trans>Close</Trans>
              </Button>
              <Button type="submit" color="primary">
                <Trans>Create</Trans>
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </AppPage>
  );
};

export default CreateChatPage;
