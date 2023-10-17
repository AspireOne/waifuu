import React, { PropsWithChildren } from "react";
import { Button } from "@nextui-org/react";
import { BiArrowBack } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { AppHeaderUserDropdown } from "@/components/AppHeader/AppHeaderUserDropdown";
import { useSession } from "@/hooks/useSession";

/**
 * Unifies page headers. Contains a back button and page title.
 * Back button can be configured to either navigate to a path, navigate to the previous page ("previous"),
 * or do nothing (null).
 */
export const AppHeader = (
  props: PropsWithChildren<{
    onBackButtonPressed: () => void;
    backButtonEnabled: boolean;
  }>,
) => {
  const session = useSession();
  return (
    <div
      className={
        "z-[100] h-[55px] fixed top-0 left-0 right-0 " +
        "backdrop-blur-xl bg-background/50 border-b-1 border-foreground-100 shadow"
      }
    >
      <div className={"flex flex-row items-center gap-5 h-full px-1"}>
        {/*Back button, on the left*/}
        <Button
          variant={"light"}
          isIconOnly
          onClick={
            props.backButtonEnabled ? props.onBackButtonPressed : undefined
          }
          className={twMerge(
            "p-0 mr-auto",
            !props.backButtonEnabled && "invisible",
          )}
        >
          <BiArrowBack size={25} />
        </Button>

        {/*Text, absolute, centered*/}
        <h2
          className={twMerge(
            "my-auto mx-auto text-center text-xl line-clamp-1 flex-1",
            "",
          )}
        >
          {props.children}
        </h2>

        {/*mr-2 to offset the dropdown, because it is natively slightly off.*/}
        {/*min-w-max to make it NOT shrink when title is too long*/}
        {/*User button, on the right*/}
        <AppHeaderUserDropdown className={"ml-auto mr-2 min-w-max"} />
      </div>
    </div>
  );
};
