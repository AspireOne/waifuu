import { env } from "@/server/env";
import { ChatRole } from "@prisma/client";
import axios from "axios";

type Message = {
  role: ChatRole;
  content: string;
};

type Model = "openai/gpt-3.5-turbo" | "jebcarter/psyfighter-13b" | "gryphe/mythomax-l2-13b-8k";

type Output = {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
  created: number;
  object: string;
};

const chatRoleToOpenaiRole = (role: ChatRole) => {
  switch (role) {
    case ChatRole.USER:
      return "user";
    case ChatRole.BOT:
      return "assistant";
    default:
      throw new Error("Invalid chat role.");
  }
};

type OpenRouterModelInput = {
  model: Model;
  system_prompt: string;
  messages: Message[];
};

// TODO: Refactor all models to one class/interface.
const run = async (input: OpenRouterModelInput) => {
  const msgsTransformed = input.messages.map((msg) => {
    return {
      role: chatRoleToOpenaiRole(msg.role),
      content: msg.content,
    };
  });

  console.debug("open router input: ", msgsTransformed.map((msg) => msg.content).join(" "));

  const response = (await axios({
    method: "post",
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": `${"https://waifuu.com"}`,
      "X-Title": `${"Waifuu"}`,
      "Content-Type": "application/json",
    },
    data: {
      model: input.model,
      messages: [
        {
          role: "system",
          content: input.system_prompt,
        },
        ...msgsTransformed,
      ],
    },
  })) as { data: Output };

  if (!response.data.choices || response.data.choices.length === 0) {
    throw new Error("Open router did not return any choices.");
  }

  console.debug("open router output: ", response.data.choices[0]!.message.content);

  return response.data.choices[0]!.message.content;
};

export const openRouterModel = { run };
export type { Message };
