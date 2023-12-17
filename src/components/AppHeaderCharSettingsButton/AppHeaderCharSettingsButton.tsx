import { tokensToMessages } from "@/server/helpers/helpers";
import { defaultModels, models } from "@/server/lib/models";
import { UpdateSelfInput } from "@/server/shared/updateSelfSchema";
import { CustomRadio } from "@components/ui/CustomRadio";
import Title from "@components/ui/Title";
import { api } from "@lib/api";
import { Trans, t } from "@lingui/macro";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioGroup,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "@providers/SessionProvider";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { GrUserSettings } from "react-icons/gr";

type Data = {
  addressedAs?: UpdateSelfInput["addressedAs"];
  botContext?: UpdateSelfInput["botContext"];
  preferredModelId?: UpdateSelfInput["preferredModelId"];
};

// jotai store
const dataAtom = atom<Data>({
  addressedAs: undefined,
  botContext: undefined,
  preferredModelId: undefined,
});

export const AppHeaderCharSettingsButton = () => {
  const { refetch, user } = useSession();
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useAtom(dataAtom);

  useEffect(() => {
    setData({
      addressedAs: user?.addressedAs ?? undefined,
      botContext: user?.botContext ?? undefined,
      preferredModelId: user?.preferredModelId ?? defaultModels.roleplay.id,
    });
  }, [user]);

  const selfUpdate = api.users.updateSelf.useMutation({
    onSuccess() {
      refetch();
      onClose();
    },
  });

  return (
    <>
      <Button
        isIconOnly
        // @ts-ignore
        variant={null}
        className={"p-0 m-0 text-primary-200"}
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        <GrUserSettings className={"p-0 m-0"} size={25} />
      </Button>

      <Modal
        className={"z-[300]"}
        scrollBehavior={"inside"}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        size={"lg"}
        backdrop={"blur"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <Trans>Character Settings</Trans>
              </ModalHeader>
              <ModalBody>
                <div>
                  <Title size={"md"}>User settings</Title>
                  <UserSettings />
                </div>
                <div>
                  <Title size={"md"}>Preferred A.I. model</Title>
                  <Models />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={selfUpdate.isLoading}
                  color="primary"
                  onClick={() => selfUpdate.mutate(data)}
                >
                  <Trans>Save Changes</Trans>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const Models = () => {
  const [data, setData] = useAtom(dataAtom);

  return (
    <RadioGroup
      onValueChange={(value) =>
        setData({
          ...data,
          preferredModelId: value,
        })
      }
      className="w-full"
      value={data.preferredModelId}
    >
      {Object.values(models).map((model) => {
        const messageMemory = tokensToMessages(model.tokens);

        return (
          <CustomRadio
            key={model.id}
            value={model.id}
            description={
              t`Short-term memory: ~${messageMemory} messages` + `\n${model.description}`
            }
          >
            {model.friendlyName}
          </CustomRadio>
        );
      })}
    </RadioGroup>
  );
};

const UserSettings = () => {
  const [data, setData] = useAtom(dataAtom);

  return (
    <div className={"flex flex-col gap-4"}>
      <Input
        onValueChange={(value) =>
          setData({
            ...data,
            addressedAs: value,
          })
        }
        defaultValue={data?.addressedAs ?? ""}
        label={t`How you wish characters to address you...`}
      />

      <Textarea
        className="w-full"
        minRows={3}
        onValueChange={(value) =>
          setData({
            ...data,
            botContext: value,
          })
        }
        defaultValue={data?.botContext ?? ""}
        placeholder={t`What should characters know about you?`}
      />
    </div>
  );
};
