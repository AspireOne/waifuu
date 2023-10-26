import * as React from "react";
import { useSession } from "@contexts/SessionProvider";
import Image from "next/image";
import Title from "@components/ui/Title";
import { Trans } from "@lingui/macro";

export const DiscoverHeader = (props: {}) => {
  const { user, status } = useSession();

  return (
    /*mb is to offset the absolute position.*/
    <div className="relative mb-14">
      <Image
        alt="background"
        loading="eager"
        className="opacity-30 h-[140px] mt-[-20px] object-cover z-10"
        src={"/assets/background.png"}
        width={1920}
        height={1080}
      />

      <div className="mx-auto mt-[-120px] z-20 relative">
        <div>
          <p className="text-2xl">👋</p>

          <div>
            <Title className={"my-1"} size={"md"} as={"p"} bold>
              <Trans>Hi, {user?.name}</Trans>
            </Title>
            <p className={"text-foreground-700"}>
              <Trans>Let's explore some new characters.</Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
