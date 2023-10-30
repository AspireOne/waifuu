import * as React from "react";
import RLSkeleton, { SkeletonProps } from "react-loading-skeleton";

export const Skeleton = (props: SkeletonProps) => {
  const skeletonProps: SkeletonProps = { ...props, count: 1 };
  return (
    <>
      {Array.from({ length: props.count ?? 1 }).map((_, index) => (
        <RLSkeleton {...skeletonProps} key={index} />
      ))}
    </>
  );
};
