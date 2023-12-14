import { env } from "@/server/env";
import { ChatRole } from "@prisma/client";
import axios from "axios";
import { LangfuseTraceClient } from "langfuse";

type Message = {
  role: ChatRole;
  content: string;
};

// "openai/gpt-3.5-turbo"
const llm = [
  "jebcarter/psyfighter-13b",
  "gryphe/mythomax-l2-13b",
  "teknium/openhermes-2.5-mistral-7b",
  "mistralai/mixtral-8x7b-instruct",
];

// Note: change this according to model.
const params = {
  temperature: 0.89,
  max_tokens: 1024,
  frequency_penalty: 0.3,
  route: "fallback",
  //transforms: ["middle-out"],
  stream: false,
};

type OpenRouterOutput = {
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

type Input = {
  system_prompt: string;
  messages: Message[];
  trace: LangfuseTraceClient;
};

const convertToOpenaiRole = (role: ChatRole) => {
  switch (role) {
    case ChatRole.USER:
      return "user";
    case ChatRole.BOT:
      return "assistant";
    default:
      throw new Error("Invalid chat role.");
  }
};

const run = async (input: Input): Promise<string> => {
  const msgsTransformed = input.messages.map((msg) => {
    return {
      role: convertToOpenaiRole(msg.role),
      content: msg.content,
    };
  });

  console.debug("open router input: ", msgsTransformed.map((msg) => msg.content).join(" "));

  const generation = input.trace.generation({
    name: "reply-generation",
    model: llm[0],
    startTime: new Date(),
    // TODO: modelParameters:
    completionStartTime: new Date(),
    modelParameters: params,
  });

  const response = (await axios({
    method: "post",
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": `${"https://waifuu.com"}`,
      "X-Title": `${"Waifuu"}`,
      "Content-Type": "application/json",
    },
    // TODO: Make it specific to the model.
    data: {
      // TODO: models
      model: llm,
      ...params,
      messages: [
        {
          role: "system",
          content: input.system_prompt,
        },
        ...msgsTransformed,
      ],
    },
  })) as { data: OpenRouterOutput };

  generation.end();

  if (!response.data.choices || response.data.choices.length === 0) {
    throw new Error("Open router did not return any choices.");
  }

  console.debug("open router output: ", response.data.choices[0]!.message.content);

  const responseContent = response.data.choices[0]!.message.content;
  console.log(JSON.stringify(response.data));

  return responseContent;
};

export const roleplayLlm = { run };
export type { Message };
