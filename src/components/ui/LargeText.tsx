import { cva } from "class-variance-authority";
import React from "react";

type LargeTextProps = {
  content: string;
  maxLength: number;
  lines?: 1 | 2 | 3 | 4 | 5 | 6;
} & React.HTMLProps<HTMLParagraphElement>;

const LargeTextVariants = cva(["line-clamp"], {
  variants: {
    lines: {
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
      5: "line-clamp-5",
      6: "line-clamp-6",
    },
  },
});

export const LargeText = ({ content, maxLength, lines = 2, ...props }: LargeTextProps) => {
  return (
    <p className={LargeTextVariants({ lines })} {...props}>
      {content.length > maxLength ? `${content.slice(0, maxLength)}...` : content}
    </p>
  );
};
