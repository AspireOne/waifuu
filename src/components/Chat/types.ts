export type ChatMessageProps = {
    message: string;
    author: {
        bot: boolean;
        avatar: string;
        name: string;
    };
}

export type ChatHeaderProps = {
    avatarPath: string;
    name: string;
    userName: string;
};