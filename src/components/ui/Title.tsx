import { twMerge } from "tailwind-merge";
import React from "react";
import { IconType } from "react-icons";

export default function Title(props: {
  children: React.ReactNode;
  /** @default "h2" */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | any;
  /** @default "lg" */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  /** @default false (semibold) */
  bold?: boolean;
  icon?: IconType;
  sideElements?: React.ReactNode;
}) {
  const size = props.size ?? "lg";
  const As = props.as ?? "h2";

  let iconSize;
  if (size === "sm") iconSize = 20;
  else if (size === "md") iconSize = 25;
  else if (size === "lg") iconSize = 29;
  else if (size === "xl") iconSize = 34;
  else if (size === "2xl") iconSize = 38;

  return (
    <As
      className={twMerge(
        props.bold ? "font-bold" : "font-semibold",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl",
        size === "xl" && "text-3xl",
        "flex flex-row items-center gap-2", // icon
        "mb-4",
        props.className,
      )}
    >
      {props.icon && <props.icon size={iconSize} />}
      {props.children}
    </As>
  );
}
