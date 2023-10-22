import React from "react";

type LargeTextProps = {
  content: string;
  maxLength: number;
} & React.HTMLProps<HTMLParagraphElement>;

export const LargeText = ({ content, maxLength, ...props }: LargeTextProps) => {
  return content.length > maxLength ? (
    <p className="" {...props}>
      {content.slice(0, maxLength)}...
    </p>
  ) : (
    <p className="" {...props}>
      {content}
    </p>
  );
};
