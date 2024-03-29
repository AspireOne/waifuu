import { env } from "@/server/env";
import { Model, models } from "@/server/lib/models";
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
  model: Model;
};

const fallbacks = [
  models.psyfighter.id,
  models.mythomax.id,
  models.openhermes25.id,
  models.mixtral.id,
];

const headers = {
  Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
  "HTTP-Referer": `${"https://waifuu.com"}`,
  "X-Title": `${"Waifuu"}`,
  "Content-Type": "application/json",
};

const run = async (input: Input) => {
  // Transform the messages to openAi format.
  const msgsTransformed = input.messages.map((msg) => {
    return {
      role: convertToOpenaiRole(msg.role),
      content: msg.content,
    };
  });

  // Create a generation trace.
  const generation = input.trace.generation({
    name: "generation",
    model: input.model.id,
    startTime: new Date(),
    completionStartTime: new Date(),
    modelParameters: input.model.params,
    prompt: input.system_prompt,
  });

  // Make the actual fetch.
  const { data: response } = (await axios({
    method: "post",
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: headers,
    data: {
      model: [input.model.id, ...fallbacks],
      ...input.model.params,
      messages: [
        {
          role: "system",
          content: input.system_prompt,
        },
        ...msgsTransformed,
      ],
    },
  })) as { data: OpenRouterOutput };

  const statsRetrievalSpan = generation.span({
    name: "stats_retrieval",
    input: response.id,
  });

  // Get stats for the generation.
  const statsResponse = await fetch(
    `https://openrouter.ai/api/v1/generation?id=${response.id}`,
    {
      headers,
    }
  );

  const stats = (await statsResponse.json())?.data as OpenRouterStatsJsonOutput;

  statsRetrievalSpan.end({
    output: {
      stats,
    },
    statusMessage: statsResponse.statusText,
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error("Open router did not return any choices.");
  }

  const textOutput = response.choices[0]!.message.content;

  generation.end({
    usage: {
      promptTokens: stats.tokens_prompt,
      completionTokens: stats.tokens_completion,
      totalTokens: stats.tokens_prompt + stats.tokens_completion,
    },
    metadata: {
      price: stats.usage,
    },
    completion: textOutput,
  });

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

export const mainLlm = { run };
export type { Message };
