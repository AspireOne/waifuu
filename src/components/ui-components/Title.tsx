import { twMerge } from "tailwind-merge";
import React from "react";

export default function Title(props: {
  children: React.ReactNode;
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | any;
  /** @default "md" */
  size: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}) {
  return (
    <props.as
      className={twMerge(
        "font-semibold",
        props.size === "sm" && "text-lg",
        props.size === "md" && "text-xl",
        props.size === "lg" && "text-2xl",
        props.size === "xl" && "text-3xl",
      )}
    >
      {props.children}
    </props.as>
  );
}
