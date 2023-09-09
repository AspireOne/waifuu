export type ChatMessageProps = {
    message: string;
    key: any;
    author: {
        bot: boolean;
        avatar: string;
        name: string;
    };
};