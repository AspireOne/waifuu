import RLSkeleton, { SkeletonProps } from "react-loading-skeleton";

export const CharacterCardSkeleton = (props: SkeletonProps) => {
  return <Skeleton width={160} height={170} {...props} />;
};

// Custom skeleton for the character card.
const Skeleton = (props: SkeletonProps) => {
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
