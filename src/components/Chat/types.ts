export type ChatMessageProps = {
  message: string;
  className?: string;
  key: any;
  author: {
    bot: boolean;
    avatar?: string | null;
    name: string;
  };
};
