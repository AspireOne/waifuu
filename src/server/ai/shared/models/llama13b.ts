import { replicate } from "@/server/ai/shared/replicate";
import { BotChatRole } from "@prisma/client";
import { BaseOutputParser } from "langchain/dist/schema/output_parser";

type Message = {
  role: BotChatRole;
  content: string;
};

type ReplicateLlama13bInput = {
  system_prompt: string;
  prompt: Message | Message[] | string;
};

const run = async (input: {
  system_prompt: string;
  prompt: Message | Message[] | string;
}): Promise<string> => {
  let formattedPrompt;

  if (typeof input.prompt === "string") {
    formattedPrompt = input.prompt;
  } else if (input.prompt instanceof Array) {
    formattedPrompt = formatMessages(input.prompt);
  } else {
    formattedPrompt = formatMessage(input.prompt);
  }

  console.log("system prompt:", input.system_prompt);
  console.log("prompt:", formattedPrompt);

  const output = (await replicate.run(
    "a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
    {
      input: {
        system_prompt: input.system_prompt,
        prompt: formattedPrompt,
      },
    },
  )) as string[];

  return output.join("");
};

/**
 * Processes the messages before being put as a prompt for a bot. Messages MUST be processed.
 * */
const formatMessage = (message: Message) => {
  return message.role === BotChatRole.USER
    ? `[INST] ${message.content} [/INST]`
    : `${message.content}`;
};

/**
 * Processes the messages to put it as a prompt for a bot. Messages MUST be processed.
 * */
const formatMessages = (messages: Message[]) => {
  // In the future, the prompt will have to be altered to account for the following:
  // 1. ! The messages will have to be somehow truncated to fit into context window.
  // 2. Account for loss of context between messages (vector db / embeddings / extrahování důležitých věcí a dosazení do promptu jako kontext).
  // 3. Account for loss of system message context / loss of character (reminding every x messages?)
  // 4. Account for images.
  return messages
    .map((message) =>
      message.role === BotChatRole.USER
        ? `[INST] ${message.content} [/INST]`
        : `${message.content}`,
    )
    .join("\n");
};

export const llama13b = {
  run,
};
export type { ReplicateLlama13bInput };