import { env } from "@/server/env";
import { ChatRole } from "@prisma/client";
import axios from "axios";
import { LangfuseTraceClient } from "langfuse";

type Message = {
  role: ChatRole;
  content: string;
};

const models = {
  psyfighter: {
    model: "jebcarter/psyfighter-13b",
    tokens: 1024,
  },
};

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

const run = async (input: Input): Promise<string> => {
  const msgsTransformed = input.messages.map((msg) => {
    return {
      role: convertToOpenaiRole(msg.role),
      content: msg.content,
    };
  });

  const generation = input.trace.generation({
    name: "roleplay-generation",
    model: llm[0],
    startTime: new Date(),
    completionStartTime: new Date(),
    modelParameters: params,
  });

  const { data: response } = (await axios({
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

  //const tokens = response.json();
  //console.log({ tokens });

  // TODO: Price.
  generation.update({
    /*usage: {
      promptTokens: tokens.tokens_prompt,
      completionTokens: tokens.tokens_completion,
      totalTokens: tokens.tokens_prompt + tokens.tokens_completion,
    },*/
  });
  generation.end();

  if (!response.choices || response.choices.length === 0) {
    throw new Error("Open router did not return any choices.");
  }

  const responseContent = response.choices[0]!.message.content;
  return responseContent;
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

export const roleplayLlm = { run };
export type { Message };
