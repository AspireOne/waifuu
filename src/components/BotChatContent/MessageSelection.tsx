import { selectedMessagesAtom } from "@components/BotChatContent/BotChatContent";
import { useAtom } from "jotai";
import React, { useState } from "react";

type MessageSelectionProps = {
  onSelectionChange: (selectedMessages: number[]) => void;
  children: React.ReactNode;
};

export const MessageSelection = ({ onSelectionChange, children }: MessageSelectionProps) => {
  const [selectedMessages, setSelectedMessages] = useAtom(selectedMessagesAtom);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMessageClick = (messageId: number) => {
    if (isSelecting) {
      const updatedSelection = selectedMessages.includes(messageId)
        ? selectedMessages.filter((id) => id !== messageId)
        : [...selectedMessages, messageId];
      setSelectedMessages(updatedSelection);
      onSelectionChange(updatedSelection);

      if (updatedSelection.length === 0) setIsSelecting(false);
    }
  };

  const handleLongClick = (messageId: number) => {
    setIsSelecting(true);
    setSelectedMessages([messageId]);
    onSelectionChange([messageId]);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-ignore
            onClick: () => handleMessageClick(child.props.messageId),
            onLongClick: () => handleLongClick(child.props.messageId),
            selected: selectedMessages.includes(child.props.messageId),
          });
        }
        return child;
      })}
    </div>
  );
};
