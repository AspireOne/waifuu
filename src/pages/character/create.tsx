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
import { FilePond, registerPlugin } from "react-filepond";
import FilepondImagePreviewPlugin from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import { useState } from "react";
import Page from "~/components/Page";

registerPlugin(FilepondImagePreviewPlugin, FilePondPluginImageExifOrientation);

const CreateChatPage = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Page metaTitle="Create a new character">
      <Card>
        <div className="p-4">
          <h2 className="text-xl mb-4">About</h2>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-medium">Avatar</h3>
              <FilePond
                className="h-44 w-44"
                imagePreviewHeight={170}
                files={[]}
                onupdatefiles={() => {}}
                allowMultiple={false}
                stylePanelLayout="compact circle"
                stylePanelAspectRatio="1:1"
                name="files"
                labelIdle='Drag & Drop your character image or <span class="filepond--label-action">Browse</span>'
              />
            </div>

            <Input isRequired type="text" label="Title" />

            <Textarea isRequired type="text" label="Description" />

            <Select
              items={[
                {
                  label: "Public",
                  value: "public",
                },
                {
                  label: "Private",
                  value: "private",
                },
                {
                  label: "Only for friends",
                  value: "friends",
                },
              ]}
              label="Select visibility"
            >
              <SelectItem key="public" value="public">
                Public
              </SelectItem>
              <SelectItem key="private" value="private">
                Private
              </SelectItem>
              <SelectItem key="friends" value="friends">
                Only for friends
              </SelectItem>
            </Select>
          </div>

          <Divider className="mt-4 mb-4" />

          <h2 className="text-xl mb-4">Character's character</h2>

          <div className="flex flex-col gap-4">
            <Input isRequired type="text" label="Name" />

            <Textarea required label="Persona" labelPlacement="outside" />

            <Textarea label="Example dialogue" labelPlacement="outside" />

            <div className="flex flex-col gap-2">
              <Switch isSelected={isSelected} onValueChange={setIsSelected}>
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
              <FilePond
                required
                files={[]}
                onupdatefiles={() => {}}
                allowMultiple={false}
                name="files"
                labelIdle='Drag & Drop your character image or <span class="filepond--label-action">Browse</span>'
              />
            </div>
          </div>

          <div className="flex flex-row w-fit mx-auto mr-0 gap-2 mt-5">
            <Button color="primary" variant="bordered">
              Close
            </Button>
            <Button color="primary">Create</Button>
          </div>
        </div>
      </Card>
    </Page>
  );
};

export default CreateChatPage;
