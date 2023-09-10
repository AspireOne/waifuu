import { twMerge } from "tailwind-merge";
import React from "react";
import { Skeleton } from "@nextui-org/react";

export default function Stats(props: { className?: string }) {
  // Three circles, each with a number and a label below it. The middle circle will be a little bit bigger and lower.
  // They will be purple.
  return (
    <div
      className={twMerge(
        "flex w-full flex-row justify-between gap-6",
        props.className,
      )}
    >
      <StatCircle value={12} label={"Followers"} />
      <StatCircle
        value={12}
        label={"Characters"}
        main={true}
        className={"mt-10"}
      />
      <StatCircle value={12} label={"Following"} />
    </div>
  );
}

function StatCircle(props: {
  className?: string;
  main?: boolean;
  value?: number;
  label?: string;
  loading?: boolean;
}) {
  return (
    <Skeleton
      isLoaded={!props.loading}
      className={twMerge(
        "flex flex-col justify-center rounded-full bg-gradient-to-br text-center",
        props.main ? "h-24 w-24" : "h-20 w-20",
        props.main
          ? "from-[#7D5AB6] to-[#3B3080]"
          : "from-[#4A3868] to-[#322A63]",
        props.className,
      )}
    >
      <p className={"text-center font-bold text-white"}>{props.value}</p>
      <p className={"text-sm"}>{props.label}</p>
    </Skeleton>
  );
}