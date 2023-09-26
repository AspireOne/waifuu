import Page from "~/components/Page";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button, Switch } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";
import paths, { addQueryParams } from "~/utils/paths";

export default function RRIndex() {
  const router = useRouter();
  const [anonymous, setAnonymous] = useState(false);

  function handleStartClicked() {
    router.push(addQueryParams(paths.RRChat, ["anonymous", "true"]));
  }

  return (
    <Page
      metaTitle={"Character Roulette"}
      header={{ back: null }}
      showMobileNav
    >
      <Card>
        <CardBody>
          <h2 className={"title mb-1"}>What is Character Roulette?</h2>
          Meet new people, roleplay fictional situations and spark fun
          conversations. Get matched with a stranger for anonymous, entertaining
          chats!
          <br />
          <br />
          Easily skip to new matches and scenarios anytime. Unmask profiles to
          follow each other and turn chats into connections. Roleplay Roulette
          creates a space for shared imagination with the tap of a button.
          <br />
          <br />
          <h2 className={"title mb-1"}>How does it work?</h2>
          When you enter a chat room, Character Roulette generates an
          interesting roleplay scenario or a situation to kickstart the
          conversation. Let your imagination run wild as you and your match
          improvise and build a fictional world together. From acting out funny
          slices of life to pretending you're secret agents on a mission, the
          possibilities are endless!
        </CardBody>
        {/*TODO: Implement anonymous mode.*/}
        {/*<CardFooter className={"flex flex-col items-start gap-4"}>
          <Button
            className={"w-full"}
            color={"primary"}
            onClick={handleStartClicked}
          >
            Start
          </Button>
          <Switch isSelected={anonymous} onValueChange={setAnonymous}>
            Anonymous mode
          </Switch>
        </CardFooter>*/}
      </Card>
    </Page>
  );
}
