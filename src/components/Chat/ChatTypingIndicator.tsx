import { motion } from "framer-motion";

const ChatTypingIndicator = () => {
  const DELAYS = [0, 0.25, 0.5];

  return (
    <div className="flex w-fit flex-row gap-2 rounded-full bg-white bg-opacity-20 p-3">
      {DELAYS.map((delay) => {
        return (
          <motion.span
            animate={{
              translateY: [1, -4, 1],
              transition: {
                repeat: Infinity,
                duration: 1,
                delay,
              },
            }}
            className="h-[11px] w-[11px] rounded-full bg-white"
          />
        );
      })}
    </div>
  );
};

export { ChatTypingIndicator };
