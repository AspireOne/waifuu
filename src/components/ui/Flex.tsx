type FlexProps = {
  orientation: "row" | "col";
  gap?: string;
  children: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export const Flex = ({ gap, children, orientation, ...props }: FlexProps) => {
  return (
    <div className={`flex flex-${orientation} gap-${gap}`} {...props}>
      {children}
    </div>
  );
};
