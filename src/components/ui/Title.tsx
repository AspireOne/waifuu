import React from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export default function Title(props: {
  children: React.ReactNode;
  /** @default "h2" */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | string;
  /** @default "lg" */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** @default true */
  bold?: boolean;
  icon?: IconType;
  sideElements?: React.ReactNode;
  description?: React.ReactNode;
}) {
  const size = props.size ?? "lg";
  const bold = props.bold ?? true;
  const As = props.as ?? "h2";

  let iconSize;
  if (size === "sm") iconSize = 20;
  else if (size === "md") iconSize = 25;
  else if (size === "lg") iconSize = 29;
  else if (size === "xl") iconSize = 34;
  //else if (size === "2xl") iconSize = 38;

  return (
    // @ts-ignore
    <As
      className={twMerge(
        bold ? "font-bold" : "font-semibold",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl",
        size === "xl" && "text-3xl",
        "mb-4",
        props.className,
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {props.icon && <props.icon size={iconSize} />}
        {props.children}
      </div>

      {props.description && (
        <p className="text-gray-400 text-[17px] font-normal">{props.description}</p>
      )}
    </As>
  );
}
