import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

/**
 * A wrapper around a public page's content. Adds padding (so that it is not too wide and there is space for navbar).
 * You do not have to use this with app-specific pages.
 * @param props
 * @constructor
 */
export const PagePadding = (
  props: PropsWithChildren<{
    className?: string;
    disableXPadding?: boolean;
    disableYPadding?: boolean;
  }>,
) => {
  return (
    <div
      className={twMerge(
        !props.disableXPadding && "md:px-16 lg:px-44 max-w-[1800px] mx-auto",
        !props.disableYPadding && "pt-6 sm:pt-12",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
