import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tab,
  Tabs,
  Textarea,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { Navbar } from "~/components/Navbar";
import Page from "~/components/Page";
import { TbRating18Plus } from "react-icons/tb";

const CreateChatPage = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  return (
    <Page metaTitle="Create chat with character">
      <Navbar />
      <div className="top-15 absolute left-0 h-[370px] w-full overflow-hidden sm:block">
        <Image
          alt="background"
          loading="eager"
          className="opacity-20"
          src={"/assets/background.png"}
          width={1920}
          height={1080}
        />
        <div className="absolute left-0 top-0 flex h-[370px] h-full w-full flex-row">
          <div className="align-center absolute mx-auto flex w-fit flex-row sm:relative">
            <Image
              alt="background"
              loading="eager"
              src={"/assets/character.png"}
              className="mt-[20px] h-[350px] w-[300px]"
              width={1920}
              height={1080}
            />
            <div className="flex w-[400px] flex-col">
              <h1 className="text-[100px] font-extrabold text-white">Fauna</h1>
              <p className="text-white">
                Fauna is a playful and energetic villager. She is very kind and
                friendly, and is very interested in music and singing. She is
                very motherly and caring to the player.
              </p>
              <div className="mt-7 flex flex-wrap">
                <Button onClick={toggle} color="primary">
                  Create a new chat with Fauna
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-[390px] w-[60%]">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-bold">Persona</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
              consectetur molestiae itaque cumque corporis recusandae veniam
              sunt, maiores ab placeat, voluptatem officiis, doloribus rem eos
              eaque vitae perferendis consequuntur fuga!
            </p>
          </div>

          <div>
            <h1 className="text-4xl font-bold">Example dialogue</h1>
            <p>
              Fauna loves nature so the conversation will be focused around
              nature, but don't worry to bring in a little bit of your life, she
              will happily talk about it. There can be moments when you receive
              no message from her, because she is too busy wandering around in
              forest
            </p>
          </div>

          <Modal isOpen={open} onOpenChange={toggle}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Create new chat with Fauna
                  </ModalHeader>

                  <ModalBody className="flex flex-col gap-8">
                    <div>
                      <label>Chat type</label>
                      <div className="mt-3">
                        <Tabs size="lg" aria-label="Tabs colors" radius="full">
                          <Tab key="photos" title="Roleplay" />
                          <Tab key="music" title="Classic chat" />
                          <Tab key="videos" title="Adventure" />
                        </Tabs>
                      </div>
                    </div>

                    <div>
                      <label>Relationship</label>
                      <div className="mt-3">
                        <Tabs size="lg" aria-label="Tabs colors" radius="full">
                          <Tab key="photos" title="Friendly" />
                          <Tab key="music" title="Romantic" />
                          <Tab key="videos" title="Stranger" />
                        </Tabs>
                      </div>
                    </div>

                    <div>
                      <Switch defaultSelected>
                        <div className="flex flex-row gap-2">
                          <TbRating18Plus size={30} /> NSFW
                        </div>
                      </Switch>
                    </div>

                    <div>
                      <label>About you</label>
                      <Textarea placeholder="What do you want the character to know about you..." />
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Create
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </Page>
  );
};

export default CreateChatPage;
