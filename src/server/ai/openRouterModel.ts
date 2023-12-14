import { env } from "@/server/env";
import { ChatRole } from "@prisma/client";
import axios from "axios";

type Message = {
  role: ChatRole;
  content: string;
};

type OpenRouterModel =
  | "openai/gpt-3.5-turbo"
  | "jebcarter/psyfighter-13b"
  | "gryphe/mythomax-l2-13b"
  | "teknium/openhermes-2.5-mistral-7b"
  | "mistralai/mixtral-8x7b-instruct";

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
  model: OpenRouterModel;
  system_prompt: string;
  messages: Message[];
};

const run = async (input: OpenRouterModelInput): Promise<string> => {
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
      // TODO: models
      model: [input.model],
      route: "fallback",
      transforms: ["middle-out"],
      stream: false,
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

  const responseContent = response.data.choices[0]!.message.content;
  console.log(JSON.stringify(response.data));

  return responseContent;
};

export const openRouterModel = { run };
export type { Message };
