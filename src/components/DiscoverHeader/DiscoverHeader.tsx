import { useSession } from "@/providers/SessionProvider";
import Title from "@components/ui/Title";
import { paths } from "@lib/paths";
import { Trans } from "@lingui/macro";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const DiscoverHeader = (props: { className?: string }) => {
  const { user } = useSession();

  return (
    /*mb is to offset the absolute position.*/
    <div className={twMerge("absolute left-0 right-0 top-14 lg:top-0", props.className)}>
      <Image
        alt="background"
        loading="eager"
        className="opacity-30 h-full w-full object-cover z-10 absolute"
        src={"/assets/background.png"}
        width={1920}
        height={1080}
      />

      <div className="z-20 relative sm:ml-10 ml-5 lg:ml-20 mt-10">
        <p className="text-2xl md:text-4xl">👋</p>

        <div>
          <Title className={"my-1 text-2xl md:text-4xl"} as={"h4"} bold>
            <Trans>Hi, {user?.name}</Trans>
          </Title>
          <p className="text-foreground-700 text-lg md:text-xl">
            <Trans>Let's explore some new characters.</Trans>
          </p>
          <Link href={paths.friends}>
            <Button color={"primary"} variant={"bordered"} className={"my-4 w-[220px]"}>
              <Trans>Friends</Trans>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
