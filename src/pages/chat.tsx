import { ChatMessage } from "~/components/Chat/ChatMessage";
import { ChatTypingIndicator } from "~/components/Chat/ChatTypingIndicator"
import { Image } from "@nextui-org/react";
import { BsShareFill, BsThreeDotsVertical } from "react-icons/bs";
import { RiSendPlane2Fill } from "react-icons/ri";

const Chat = () => {
  return (
    <div>
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
        className="fixed bottom-0 left-0 max-w-[500px] translate-x-[-50%] left-[50%] h-[800px] w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="fixed left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent via-black/40 to-black" />

      <div className="fixed z-30 w-full">
        <div className="mx-auto mt-5 flex w-[75%] flex-row rounded-lg bg-black p-3">
          <div>
            <Image
              height={50}
              width={50}
              loading="eager"
              src={"/assets/defaultuser.jpg"}
              alt="botavatar"
            />
          </div>

          <div className="ml-3">
            <h3 className="text-white">Fauna</h3>
            <h6 className="text-gray-400">@fauna_fyi</h6>
          </div>

          <div className="mx-auto mr-2 mt-3.5 flex flex-row gap-2">
            <BsThreeDotsVertical size={25} color="white" />
            <BsShareFill size={25} color="white" />
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="fixed bottom-6 z-30 md:left-[50%] md:translate-x-[-50%] flex flex-col gap-6">
          <ChatMessage
            author={{ avatar: "Nevim", name: "Nejaka loli waifu", bot: false }}
            message={"je mi to **fakt jedno**1!!!1! LOL XD *vytahne ar-15*"}
          />

          <ChatMessage
            author={{
              avatar: "Pepe",
              name: "Jdidopcice",
              bot: true,
            }}
            message={
              "AHA LOL TAK DOBRY VOLE, POJDME VYKROPIT NEJAKY DAV XOOXOXO 20!"
            }
          />

          <ChatTypingIndicator />

          <div className="w-full mx-auto">
            <div className="flex w-fit w-full mx-auto flex-row gap-2">
              <input
                placeholder="Your message..."
                className="rounded-lg w-[90%] border-2 border-white bg-transparent p-3 text-white outline-none"
                type="text"
              />

              <button className="w-13 h-13 rounded-lg bg-white p-2">
                <RiSendPlane2Fill size={30} color="black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
