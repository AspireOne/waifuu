import { Trans, t } from "@lingui/macro";
import { Button, Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { ChatMode } from "@prisma/client";

function getTabs() {
  return [
    {
      title: t`Adventure`,
      key: ChatMode.ADVENTURE,
      description: t`Your world, your story. You control the character, and you decide how the story will unfold.`,
    },
    {
      title: t`Chat`,
      key: ChatMode.CHAT,
      description: t`Casually chat with the character. Hey, how r u?`,
    },
    {
      title: t`Roleplay`,
      key: ChatMode.ROLEPLAY,
      description: t`Talk with the character as if you were there with them.`,
    },
  ];
}

const ChatSelectTabs = ({
  onSelect,
  isLoading,
}: {
  onSelect: (data: ChatMode) => void;
  isLoading: boolean;
}) => {
  // TODO: FIX - Not working on firefox devtools,
  return (
    <div className="flex z-40 w-full flex-col">
      <Tabs
        color="primary"
        size="lg"
        className="mx-auto w-fit mb-4"
        variant="bordered"
        aria-label="Disabled Options"
      >
        {getTabs().map((tab) => {
          return (
            <Tab key={tab.key} title={tab.title}>
              <Card>
                <CardBody>{tab.description}</CardBody>

                <Button
                  isLoading={isLoading}
                  color="primary"
                  onClick={() => onSelect(tab.key)}
                  variant="solid"
                  className="mt-1 mx-2"
                >
                  <Trans>Start conversation</Trans>
                </Button>
              </Card>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ChatSelectTabs;
