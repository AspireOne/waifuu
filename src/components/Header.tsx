import { PropsWithChildren } from "react";
import { Button } from "@nextui-org/react";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { UserDropdown } from "./User/UserDropdown";

export type HeaderProps = {
  /** Null for no back button, "previous" for the last opened page, and string for a certain path. Default: "previous" */
  back?: string | null | "previous";
  /** Triggered when the back button is clicked. Can be used for cleanups. */
  onBack?: () => void;
};

/**
 * Unifies page headers. Contains a back button and page title.
 * Back button can be configured to either navigate to a path, navigate to the previous page ("previous"),
 * or do nothing (null).
 */
export default function Header(props: PropsWithChildren<HeaderProps>) {
  const back = props.back === undefined ? "previous" : props.back;
  const router = useRouter();

  function handleBackClick() {
    if (back === null) return;
    else if (back === "previous") router.back();
    else {
      router.push(back);
      // TODO: Remove the last path from history to not confuse mobile app back button (/swipe)?
    }

    if (props.onBack) props.onBack();
  }

  return (
    <div
      className={
        "z-[100] h-[55px] fixed top-0 left-0 right-0 " +
        "backdrop-blur-xl bg-background/50 border-b-1 border-foreground-300 shadow"
      }
    >
      <div className={"flex flex-row items-center gap-5 h-full px-1"}>
        {/*Back button, on the left*/}
        <Button
          variant={"light"}
          isIconOnly
          onClick={handleBackClick}
          className={twMerge("p-0 mr-auto", back === null && "invisible")}
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
        <UserDropdown className={"ml-auto mr-2 min-w-max"} />
      </div>
    </div>
  );
}
