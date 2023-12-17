import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

/**
 * Should be used together with PageTitle.
 * @param props
 * @constructor
 */
export const PageDescription = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <p className={twMerge("text-foreground-500 max-w-[700px] md:text-xl", props.className)}>
      {props.children}
    </p>
  );
};
