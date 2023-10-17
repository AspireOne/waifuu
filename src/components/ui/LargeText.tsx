type LargeTextProps = {
  content: string;
  maxLength: number;
} & React.HTMLProps<HTMLParagraphElement>;

export const LargeText = ({ content, maxLength, ...props }: LargeTextProps) => {
  return content.length > maxLength ? (
    <p className="text-white" {...props}>
      {content.slice(0, maxLength)}...
    </p>
  ) : (
    <p className="text-white" {...props}>
      {content}
    </p>
  );
};
