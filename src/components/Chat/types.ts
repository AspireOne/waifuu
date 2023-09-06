export type ChatMessageProps = {
    message: string;
    author: {
        bot: boolean;
        avatar: string;
        name: string;
    };
};