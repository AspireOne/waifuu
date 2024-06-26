import { paths } from "@/lib/paths";
import { AppPage } from "@components/AppPage";
import Title from "@components/ui/Title";
import { addQueryParams } from "@lib/utils";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RRIndex() {
  const router = useRouter();
  const [anonymous, setAnonymous] = useState(false);
  const { _ } = useLingui();

  function handleStartClicked() {
    router.push(addQueryParams(paths.RRChat, ["anonymous", "true"]));
  }

  return (
    <AppPage backPath={paths.discover} title={_(msg`Character Roulette`)} topLevel>
      <Card>
        <CardBody>
          <Trans>
            <Title size={"md"} as={"h2"} className={"mb-2"}>
              What is Character Roulette?
            </Title>
            Meet new people, roleplay fictional situations and spark fun conversations. Get
            matched with a stranger for anonymous, entertaining chats!
            <br />
            <br />
            Easily skip to new matches and scenarios anytime. Unmask profiles to follow each
            other and turn chats into connections. Roleplay Roulette creates a space for shared
            imagination with the tap of a button.
            <br />
            <br />
            <Title size={"md"} as={"h2"} className={"mb-2"}>
              How does it work?
            </Title>
            When you enter a chat room, Character Roulette generates an interesting roleplay
            scenario or a situation to kickstart the conversation. Let your imagination run
            wild as you and your match improvise and build a fictional world together. From
            acting out funny slices of life to pretending you're secret agents on a mission,
            the possibilities are endless!
          </Trans>
        </CardBody>
        {/*TODO: Implement anonymous mode.*/}
        <CardFooter className={"flex flex-col items-start gap-4"}>
          <Button className={"w-full"} color={"primary"} onClick={handleStartClicked}>
            <Trans>Start</Trans>
          </Button>
          {/*<Switch isSelected={anonymous} onValueChange={setAnonymous}>
            Anonymous mode
          </Switch>*/}
        </CardFooter>
      </Card>
    </AppPage>
  );
}
