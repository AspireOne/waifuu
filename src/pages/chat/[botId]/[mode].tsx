import {ChatMessage} from "~/components/Chat/ChatMessage";
import {ChatTypingIndicator} from "~/components/Chat/ChatTypingIndicator";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  ScrollShadow,
} from "@nextui-org/react";
import {BsShareFill, BsThreeDotsVertical} from "react-icons/bs";
import {RiSendPlane2Fill} from "react-icons/ri";
import {api} from "~/utils/api";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import useBotChat from "~/use-hooks/useBotChat";
import {BotMode} from "@prisma/client";
import {useEffect} from "react";
import paths from "~/utils/paths";
import Page from "~/components/Page";
import Skeleton from "react-loading-skeleton";


/**
 * Custom hook that fetches the specified bot and redirects if the bot or mode is invalid.
 */
const useBot = (botId: string | undefined, mode: string | undefined, enabled: boolean = true) => {
  const router = useRouter();
  const bot = api.bots.getBot.useQuery({botId: botId!}, {enabled: enabled});

  useEffect(() => {
    if (!enabled) return;

    // If the bot does not exist, redirect to explore page.
    if (!bot.isLoading && !bot.data) {
      router.push(paths.explore);
    }

    // If mode does not exist, redirect to the bot main menu.
    if (!Object.values(BotMode).includes(mode as BotMode)) {
      router.push(paths.botChatMainMenu(botId!));
    }
  }, [mode, bot.isLoading, bot.data, botId, router]);

  return bot.data;
}

const Chat = () => {
  const router = useRouter();
  const botId = router.query.botId as string | undefined;
  const mode = (router.query.mode as string | undefined)?.toUpperCase();

  const {data: session} = useSession();

  const bot = useBot(botId, mode, router.isReady);
  const chat = useBotChat(botId, mode as BotMode, router.isReady);

  return (
    <Page protected={true} metaTitle={bot?.name || "Loading..."}>
      <Image
        alt="background"
        loading="eager"
        src={"/assets/background.png"}
        className="fixed left-0 top-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <Image
        alt="background"
        loading="eager"
        src={"/assets/character.png"}
        className="fixed bottom-0 left-0 left-[50%] h-[800px] w-full max-w-[500px] translate-x-[-50%] object-cover"
        width={1920}
        height={1080}
      />
      <div className="fixed left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent via-black/70 to-black"/>

      <div className="fixed z-30 w-full">
        <div className="mx-auto mt-5 flex w-[75%] flex-row rounded-lg bg-black bg-opacity-80 p-3">
          <div>
            <Image
              height={50}
              width={50}
              loading="eager"
              src={"/assets/default_user.jpg"}
              alt="botavatar"
            />
          </div>

          <div className="ml-3">
            <h3 className="text-white">{bot?.name || <Skeleton/>}</h3>
            <h6 className="text-gray-400">@fauna_fyi</h6>
          </div>

          <div className="align-center mx-auto mr-2 flex flex-row gap-2">
            <Dropdown className="flex-none">
              <DropdownTrigger>
                <button>
                  <BsThreeDotsVertical size={25} color="white"/>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem className="text-white" key="edit">
                  Remove chat
                </DropdownItem>
                <DropdownItem className="text-white" key="edit">
                  Settings
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown className="flex-none">
              <DropdownTrigger>
                <button>
                  <BsShareFill size={25} color="white"/>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem className="text-white" key="edit">
                  Share on Twitter
                </DropdownItem>
                <DropdownItem className="text-white" key="edit">
                  Share on Instagram
                </DropdownItem>
                <DropdownItem className="text-white" key="edit">
                  Share on Facebook
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="fixed bottom-6 z-30 flex flex-col gap-6 md:left-[50%] md:translate-x-[-50%]">
          <ScrollShadow className="flex h-[55vh] flex-col gap-7 overflow-scroll overflow-x-visible">
            {
              chat.messages.map((message, index) => {
                const botName = bot?.name || "Them";
                const userName = session?.user?.name || "You";

                return (
                  <ChatMessage
                    key={message.id}
                    author={{
                      bot: message.role === "BOT",
                      name: message.role === "BOT" ? botName : userName,
                      avatar: "/assets/default_user.jpg"
                    }}
                    message={message.content}
                  />
                );
              })
            }
            {chat.loadingReply && <ChatTypingIndicator/>}
          </ScrollShadow>

          <div className="mx-auto w-full">
            <div className="mx-auto flex w-fit w-full flex-row gap-2">
              <input
                placeholder="Your message..."
                className="w-[90%] rounded-lg border-1 border-white bg-transparent p-3 text-white outline-none"
                type="text"
              />

              <button className="w-13 h-13 rounded-lg bg-white p-2">
                <RiSendPlane2Fill size={30} color="black"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Chat;
