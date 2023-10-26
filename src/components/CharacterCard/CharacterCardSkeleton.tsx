import { Skeleton } from "@components/Skeleton";
import { SkeletonProps } from "react-loading-skeleton";

export const CharacterCardSkeleton = (props: SkeletonProps) => {
  return <Skeleton width={160} height={170} {...props} />;
};
