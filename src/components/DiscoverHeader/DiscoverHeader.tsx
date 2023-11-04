import Title from "@components/ui/Title";
import { useSession } from "@contexts/SessionProvider";
import { Trans } from "@lingui/macro";
import Image from "next/image";

export const DiscoverHeader = () => {
  const { user } = useSession();

  return (
    /*mb is to offset the absolute position.*/
    <div className="relative mb-10">
      <Image
        alt="background"
        loading="eager"
        className="opacity-30 h-[140px] mt-[-20px] object-cover z-10"
        src={"/assets/background.png"}
        width={1920}
        height={1080}
      />

      <div className="mx-auto mt-[-120px] z-20 relative">
        <p className="text-2xl md:text-4xl">👋</p>

        <div>
          <Title className={"my-1 text-2xl md:text-4xl"} as={"p"} bold>
            <Trans>Hi, {user?.name}</Trans>
          </Title>
          <p className="text-foreground-700 text-lg md:text-xl ">
            <Trans>Let's explore some new characters.</Trans>
          </p>
        </div>
      </div>
    </div>
  );
};
