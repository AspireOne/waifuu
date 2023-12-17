// Note: change this according to model.
import { ChatMode } from "@prisma/client";

const universalParams = {
  temperature: 0.89,
  frequency_penalty: 0.3,
  route: "fallback",
  stream: false,
};

export type ModelId =
  | "jebcarter/psyfighter-13b"
  | "gryphe/mythomax-l2-13b"
  | "teknium/openhermes-2.5-mistral-7b"
  | "mistralai/mixtral-8x7b-instruct";

export type ModelParams = {
  temperature: number;
  max_tokens: number;
  frequency_penalty: number;
  route: string;
  stream: boolean;
};

export type Model = {
  id: ModelId;
  friendlyName: string;
  description: string;
  tokens: number;
  params: ModelParams;
};

type ModelKey = "psyfighter" | "mythomax" | "openhermes25" | "mixtral";

export const models: Record<ModelKey, Model> = {
  psyfighter: {
    id: "jebcarter/psyfighter-13b",
    friendlyName: "Psyfighter",
    description: "Good overall capabilities - high in roleplaying and output consistency.",
    tokens: 4096,
    params: { ...universalParams, max_tokens: 3996 },
  },
  mythomax: {
    id: "gryphe/mythomax-l2-13b",
    friendlyName: "MythoMax",
    description: "Good overall capabilities - high in roleplaying and storytelling.",
    tokens: 4096,
    params: { ...universalParams, max_tokens: 3996 },
  },
  openhermes25: {
    id: "teknium/openhermes-2.5-mistral-7b",
    friendlyName: "Open Hermes 2.5",
    description:
      "Good roleplaying capabilities, fast replies, but output quality (consistency & repeating) may vary.",
    tokens: 4096,
    params: { ...universalParams, max_tokens: 3996 },
  },
  mixtral: {
    id: "mistralai/mixtral-8x7b-instruct",
    friendlyName: "Mixtral",
    description:
      "Great memory, high in reasoning (on par with ChatGPT), good roleplaying capabilities, but might repeat itself a bit.",
    tokens: 32768,
    params: { ...universalParams, max_tokens: 32668 },
  },
};

export const defaultModels = {
  roleplay: models.psyfighter,
  adventure: models.mixtral,
  chat: models.mixtral,
};

export const getModelToUse = (
  mode: ChatMode,
  preferredModelId?: ModelId | string | null,
): Model => {
  const hasPreferredModel = preferredModelId && getModelById(preferredModelId);
  const preferredModel = hasPreferredModel ? getModelById(preferredModelId)! : null;

  if (ChatMode.ROLEPLAY) return preferredModel ?? defaultModels.roleplay;
  if (ChatMode.CHAT) return preferredModel ?? defaultModels.chat;
  if (ChatMode.ADVENTURE) return defaultModels.adventure;

  throw new Error(`Unknown mode: ${mode}`);
};

export const getModelById = (modelId: ModelId | string) => {
  return Object.values(models).find((m) => m.id === modelId);
};
