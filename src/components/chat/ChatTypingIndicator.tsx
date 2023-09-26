import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const ChatTypingIndicator = (props: { className?: string }) => {
  const DELAYS = [0, 0.25, 0.5];

  return (
    <div
      className={twMerge(
        "flex w-fit flex-row gap-2 rounded-full bg-white bg-opacity-20 p-3",
        props.className,
      )}
    >
      {DELAYS.map((delay) => {
        return (
          <motion.span
            animate={{
              translateY: [1, -4, 1],
              transition: {
                repeat: Infinity,
                duration: 1,
                delay,
                repeatDelay: 0.6,
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
