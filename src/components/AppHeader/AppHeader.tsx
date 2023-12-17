import { FeedbackButton } from "@components/AppHeader/FeedbackButton";
import { UserDropdown } from "@components/AppHeader/UserDropdown";
import { useIsOnline } from "@hooks/useIsOnline";
import { Button } from "@nextui-org/react";
import { useSession } from "@providers/SessionProvider";
import { PropsWithChildren, ReactNode } from "react";
import { IoChevronBack } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

export type AppHeaderInput = PropsWithChildren<{
  onBackButtonPressed: () => void;
  backButtonEnabled: boolean;
  endContent?: ReactNode;
}>;

export const AppHeader = (props: AppHeaderInput) => {
  const session = useSession();
  const isOnline = useIsOnline();

  return (
    <div
      className={twMerge(
        "z-[100] h-[55px] fixed top-0 left-0 right-0",
        "backdrop-blur-md bg-background/50 border-b-1 border-foreground-100 shadow",
        "lg:top-4 lg:rounded-full lg:max-w-[700px] lg:mx-auto lg:border-2 lg:background-blur-xl",
      )}
    >
      <div className={"flex flex-row items-center justify-between h-full px-4 gap-4"}>
        {/* Left-aligned back button */}
        {props.backButtonEnabled && (
          <Button
            isDisabled={!isOnline}
            variant={"light"}
            isIconOnly
            onClick={props.onBackButtonPressed}
            className={"flex-shrink-0"}
          >
            <IoChevronBack size={25} />
          </Button>
        )}

        {/* Center text, allow it to take remaining space */}
        <h2
          className={twMerge(
            "text-[19px] font-semibold flex-grow",
            "overflow-hidden overflow-ellipsis whitespace-nowrap",
            props.backButtonEnabled && "-ml-2",
          )}
        >
          {props.children}
        </h2>

        {/* Spacer to maintain layout when back button is disabled */}
        {!props.backButtonEnabled && <div className={"flex-grow"} />}

        {/* Right-aligned user dropdown */}

        {session.status === "authenticated" && <FeedbackButton />}

        {props.endContent}
        <UserDropdown className={"flex-shrink-0"} />
      </div>
    </div>
  );
};
