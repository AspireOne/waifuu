import Image from "next/image";
import { Navbar } from "~/components/Navbar";

const CreateChatPage = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <div className="hidden h-[350px] overflow-hidden sm:block">
        <Image
          alt="background"
          loading="eager"
          className="opacity-30"
          src={"/assets/background.png"}
          width={1920}
          height={1080}
        />
      </div>
    </div>
  );
};

export default CreateChatPage;