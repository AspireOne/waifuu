import Image from "next/image";

type Props = {
  name: "chat" | "sparkles" | "globe" | "gem" | "money";
  className?: string;
};

export const Emoji = ({ name, className }: Props) => {
  return (
    <Image
      src={`/emojis/${name}.png`}
      alt={name}
      width={32}
      height={32}
      className={className}
    />
  );
};
