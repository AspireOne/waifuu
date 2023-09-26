import { Button, Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { BotMode } from "@prisma/client";

const tabs = [
  {
    title: "Adventure",
    key: BotMode.ADVENTURE,
    description:
      "(i) Your world, your story. You control the character, and you decide how the story will unfold.",
  },
  {
    title: "Chat",
    key: BotMode.CHAT,
    description: "(i) Casually chat with the character. Hey, how r u?",
  },
  {
    title: "Roleplay",
    key: BotMode.ROLEPLAY,
    description: "(i) Talk with the character as if you were there with them.",
  },
];

const ChatSelectTabs = ({
  onSelect,
}: {
  onSelect: (data: BotMode) => void;
}) => {
  // TODO: FIX - Not working on firefox devtools,
  return (
    <div className="flex z-40 w-full flex-col">
      <Tabs
        color="primary"
        size="lg"
        className="mx-auto w-fit"
        variant="bordered"
        aria-label="Disabled Options"
      >
        {tabs.map((tab) => {
          return (
            <Tab key={tab.key} title={tab.title}>
              <Card>
                <CardBody>{tab.description}</CardBody>

                <Button
                  color="primary"
                  onClick={() => onSelect(tab.key)}
                  variant="solid"
                  className="mt-1"
                >
                  Start conversation
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
