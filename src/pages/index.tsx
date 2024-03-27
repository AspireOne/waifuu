import { Emoji } from "@/components/ui/Emoji";
import Discover from "@/pages/discover";
import { Spacer } from "@nextui-org/react";

import { PublicPage } from "@components/PublicPage";
import { semanticPaths } from "@lib/paths";
import { useSession } from "@providers/SessionProvider";
import { useRouter } from "next/router";
import React from "react";
import { IconType } from "react-icons";

import { CgGhostCharacter } from "react-icons/cg";
import { Fa42Group } from "react-icons/fa6";
import { MdOutlineEmojiPeople } from "react-icons/md";

const Header = () => {
  return (
    <header className="text-center">
      <h1 className="lg:text-8xl text-5xl w-fit mx-auto font-black flex flex-row gap-6">
        <p>Meet</p>
        <Emoji className="lg:w-[100px] lg:h-[100px] h-[50px] w-[50px]" name="chat" />
        <p>Waifuu</p>
      </h1>

      <Spacer y={5} />

      <h2 className="w-fit mx-auto text-3xl lg:text-5xl flex flex-row gap-2">
        <p className="font-light">The virtual</p>
        <p className="text-pink-400 font-bold">friend</p>
      </h2>

      <Spacer className="my-5 lg:my-10" />
      <button className="mx-auto border-2 flex flex-row gap-2 bg-[#8D8D8D] bg-opacity-20 lg:px-10 px-7 border-[#A0A0A0] rounded-full p-1.5 lg:p-2">
        <Emoji name="sparkles" className="h-7 w-7" />
        <p className="mt-0.5 font-semibold">Try it out</p>
      </button>
    </header>
  );
};

const Feature = (props: {
  title: string;
  description: string;
  icon: IconType;
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:gap-6 text-center lg:text-left">
      <props.icon className="lg:w-28 lg:h-28 lg:align-middle w-16 h-16 mx-auto text-pink-400" />

      <div className="flex flex-col lg:flex-wrap gap-2">
        <h1 className="font-bold text-3xl">{props.title}</h1>
        <p className="w-[400px]">{props.description}</p>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="w-fit mx-auto flex flex-col lg:gap-18 gap-14">
      <Feature
        title="Always with you"
        description="Waifuu is there 24/7 with you, there is not time that the bot is offline, it's always there for you."
        icon={MdOutlineEmojiPeople}
      />
      <Feature
        title="Personalised experience"
        description="Waifuu tailors the chatting experience specifically to you using the info you provide."
        icon={Fa42Group}
      />
      <Feature
        title="Create your own characters"
        description="There isn't character that is designed the way you want it? No problem, you can create your own truly special characters."
        icon={CgGhostCharacter}
      />
    </div>
  );
};

const MiniFooter = () => {
  return (
    <footer className="text-center">
      <p className="font-bold text-lg text-pink-400">Enough talking...</p>
      <div className="w-fit mx-auto flex text-4xl font-bold flex-row gap-2">
        <h1>Let's begin</h1>
        <Emoji name="sparkles" />
        <h1>your journey</h1>
      </div>

      <button className="bg-gray-500 flex flex-row gap-2 mx-auto px-8 font-semibold p-3 rounded-full mt-5">
        <Emoji name="globe" className="h-7 w-7" />
        Open app
      </button>
    </footer>
  );
};

export default process.env.NEXT_PUBLIC_BUILDING_NATIVE
  ? Discover
  : function LandingPage() {
      const { status } = useSession();
      const router = useRouter();

      React.useEffect(() => {
        if (status === "authenticated") router.replace(semanticPaths.appIndex);
      }, [status]);

      // Todo: meta description.
      return (
        <PublicPage
          disableXPadding
          className="bg-contain bg-no-repeat"
          title={"Meet Waifuu"}
          description={""}
        >
          <Spacer y={40} />
          <Header />
          <Spacer y={40} />
          <Features />
          <Spacer y={40} />
          <MiniFooter />
          <Spacer y={40} />
        </PublicPage>
      );
    };
