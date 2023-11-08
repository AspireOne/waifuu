import RLSkeleton, { SkeletonProps } from "react-loading-skeleton";

export const Skeleton = (props: SkeletonProps) => {
  const skeletonProps: SkeletonProps = { ...props, count: 1 };
  return (
    <>
      {Array.from({ length: props.count ?? 1 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: no other way to do it in this case.
        <RLSkeleton {...skeletonProps} key={index} />
      ))}
    </>
  );
};
