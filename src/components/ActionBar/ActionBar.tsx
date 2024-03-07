import { paths } from "@/lib/paths";
import { Capacitor } from "@capacitor/core";
import { normalizePath } from "@lib/utils";
import { t } from "@lingui/macro";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiOutlineUser } from "react-icons/ai";

import { RiSearch2Fill, RiSearch2Line } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
// import svg assets/icons/history.svg

// Mapping of paths and their icons.
type ButtonProp = {
  path: string;
  title: string;
  icon: IconType;
  iconFilled: IconType;
  pathExactMatch?: boolean;
};

function getButtons() {
  const buttons: ButtonProp[] = [
    {
      path: paths.discover,
      title: t`Discover`,
      icon: RiSearch2Line,
      iconFilled: RiSearch2Fill,
    },
    /*{
      path: paths.RR,
      title: t`Roulette`,
      icon: IoChatbubblesOutline,
      iconFilled: IoChatbubbles,
    },*/
    {
      path: paths.profile,
      title: t`Profile`,
      icon: AiOutlineUser,
      iconFilled: AiOutlineUser,
    },
  ];
  return buttons;
}

/**
 * The action bar on the bottom, which allows to switch pages.
 * @param props
 * @constructor
 */
export const ActionBar = () => {
  const [activeButtId, setActiveButtId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Make the path that starts with the current path and matches the largest part of it active.
    // Example: If we have paths "hi.com/user/21" and "hi.com/user", and the current path is "hi.com/user/21",
    // then the active path should be "hi.com/user/21".'
    let activeButton: ButtonProp | null = null;
    const currPathname = normalizePath(router.pathname);

    // Check which button is active.
    for (let i = 0; i < getButtons().length; i++) {
      const button = getButtons()[i]!;
      const pathname = normalizePath(button.path);

      if (button.pathExactMatch && pathname === currPathname) {
        activeButton = button;
        break;
      }

      if (
        currPathname.startsWith(pathname) &&
        (activeButton?.path?.length ?? 0) < pathname.length
      )
        activeButton = button;
    }
    setActiveButtId(activeButton?.title ?? null);
  }, [router.pathname]);

  return (
    <div
      className={
        "bg-default-50 min-h-max p-1 py-2 z-[100] rounded-xl fixed left-2 right-2 bottom-2 border border-default-100 shadow"
      }
    >
      <div className={"flex flex-row justify-between items-center"}>
        {getButtons().map((button) => {
          return (
            <ActionButton
              key={button.title}
              {...button}
              isActive={button.title === activeButtId}
            />
          );
        })}
      </div>
    </div>
  );
};

function ActionButton(props: ButtonProp & { isActive: boolean }) {
  const router = useRouter();

  function handleClick() {
    // Because of back button binding.
    if (Capacitor.isNativePlatform()) {
      router.replace(props.path);
    } else {
      router.push(props.path);
    }
  }

  const transitionDuration = ""; // duration-100

  return (
    <div className={""}>
      <Button
        disableRipple={false}
        onPressStart={handleClick}
        className={twMerge(
          "m-0 bg-transparent hover:bg-none h-12",
          "flex flex-col items-center justify-center gap-0",
          props.isActive ? "text-foreground-900" : "text-foreground-400"
        )}
      >
        {props.isActive && (
          <props.iconFilled
            className={`flex-1 ${transitionDuration}`}
            size={26}
          />
        )}
        {!props.isActive && (
          <props.icon className={`flex-1 ${transitionDuration}`} size={26} />
        )}
        {
          <p className={`text-sm font-semibold ${transitionDuration}`}>
            {props.title}
          </p>
        }
      </Button>
    </div>
  );
}
