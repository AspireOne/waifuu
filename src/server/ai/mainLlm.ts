import { env } from "@/server/env";
import { Model, models } from "@/server/lib/models";
import { ChatRole } from "@prisma/client";
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

const fallbacks = [models.mixtral.id, models.mythomax.id, models.openhermes25.id];

const headers = {
  Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
  "HTTP-Referer": "https://waifuu.com",
  "X-Title": "Waifuu",
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
  input.trace.generation({
    name: "generation",
    model: input.model.id,
    startTime: new Date(),
    completionStartTime: new Date(),
    modelParameters: input.model.params,
    prompt: input.system_prompt,
  });

  // Make the actual fetch.
  const response = (await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: input.model.id,
      ...input.model.params,
      messages: [
        {
          role: "system",
          content: input.system_prompt,
        },
        ...msgsTransformed,
      ],
    }),
  }).then((res) => res.json())) as OpenRouterOutput;

  if (!response.choices || response.choices.length === 0) {
    throw new Error("Open router did not return any choices.");
  }

  const textOutput = response.choices[0]!.message.content;
  
  return {
    text: textOutput,
    price: 0, // placeholder.
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
