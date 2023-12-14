import { env } from "@/server/env";
import { ChatRole } from "@prisma/client";
import axios from "axios";
import { LangfuseTraceClient } from "langfuse";

type Message = {
  role: ChatRole;
  content: string;
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

type OpenRouterStatsJsonOutput = {
  id: string;
  model: string;
  streamed: boolean;
  generation_time: number;
  created_at: string;
  tokens_prompt: number;
  tokens_completion: number;
  native_tokens_prompt: null;
  native_tokens_completion: null;
  num_media_prompt: null;
  num_media_completion: null;
  origin: string;
  usage: number;
};

type Input = {
  system_prompt: string;
  messages: Message[];
  trace: LangfuseTraceClient;
};

// Note: change this according to model.
const universalParams = {
  temperature: 0.89,
  max_tokens: 1024,
  frequency_penalty: 0.3,
  route: "fallback",
  stream: false,
};

const models = {
  psyfighter: {
    model: "jebcarter/psyfighter-13b",
    tokens: 4096,
    params: universalParams,
  },
  mythomax: {
    model: "gryphe/mythomax-l2-13b",
    tokens: 4096,
    params: universalParams,
  },
  openhermes25: {
    model: "teknium/openhermes-2.5-mistral-7b",
    tokens: 4096,
    params: universalParams,
  },
  mixtral: {
    model: "mistralai/mixtral-8x7b-instruct",
    tokens: 32768,
    params: universalParams,
  },
};

const llm = [models.psyfighter, models.mythomax, models.openhermes25, models.mixtral];

const headers = {
  Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
  "HTTP-Referer": `${"https://waifuu.com"}`,
  "X-Title": `${"Waifuu"}`,
  "Content-Type": "application/json",
};

const run = async (input: Input) => {
  const msgsTransformed = input.messages.map((msg) => {
    return {
      role: convertToOpenaiRole(msg.role),
      content: msg.content,
    };
  });

  const generation = input.trace.generation({
    name: "roleplay-generation",
    model: llm[0]!.model,
    startTime: new Date(),
    completionStartTime: new Date(),
    modelParameters: universalParams,
  });

  const { data: response } = (await axios({
    method: "post",
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: headers,
    data: {
      model: llm.map((m) => m.model),
      ...llm[0]!.params,
      messages: [
        {
          role: "system",
          content: input.system_prompt,
        },
        ...msgsTransformed,
      ],
    },
  })) as { data: OpenRouterOutput };

  const statsResponse = await fetch(
    `https://openrouter.ai/api/v1/generation?id=${response.id}`,
    {
      headers,
    },
  );

  const stats = (await statsResponse.json()) as OpenRouterStatsJsonOutput;

  // TODO: Price.
  generation.update({
    usage: {
      promptTokens: stats.tokens_prompt,
      completionTokens: stats.tokens_completion,
      totalTokens: stats.tokens_prompt + stats.tokens_completion,
    },
    metadata: {
      price: stats.usage,
    },
  });
  generation.end();

  if (!response.choices || response.choices.length === 0) {
    throw new Error("Open router did not return any choices.");
  }

  const textOutput = response.choices[0]!.message.content;
  return {
    text: textOutput,
    price: stats.usage,
  };
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

export const roleplayLlm = { run, model: llm[0]! };
export type { Message };
