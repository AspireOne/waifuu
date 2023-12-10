import { PropsWithChildren } from "react";

/**
 * Should be used together with PageTitle.
 * @param props
 * @constructor
 */
export const PageDescription = (props: PropsWithChildren) => {
  return <p className="text-foreground-500 max-w-[700px] md:text-xl">{props.children}</p>;
};
