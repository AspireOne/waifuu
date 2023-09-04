import { ChatMessage } from "~/components/Chat/ChatMessage";
import { Image } from "@nextui-org/react";
import { ChatInput } from "~/components/Chat/ChatInput";
import { ChatHeader } from "~/components/Chat/ChatHeader";

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
        className="fixed bottom-0 left-0 h-[800px] w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="fixed left-0 top-0 z-20 h-full w-full bg-gradient-to-b from-transparent via-black/40 to-black" />

      <ChatHeader />

      <ChatMessage
        author={{ avatar: "Pepe", name: "", bot: false }}
        message={"Hello world!"}
      />

      <div className="p-3">
        <div className="fixed bottom-0 z-30 flex flex-col gap-6">
          <ChatMessage
            author={{ avatar: "Nevim", name: "Nejaka loli waifu", bot: false }}
            message={
              "je mi to fakt jedno1!!!1! LOL XD *vytahne ar-15*"
            }
          />

          <ChatMessage
            author={{
              avatar: "Pepe",
              name: "Jdidopcice",
              bot: true,
            }}
            message={"AHA LOL TAK DOBRY VOLE, POJDME VYKROPIT NEJAKY DAV XOOXOXO 20!"}
          />

          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Chat;
