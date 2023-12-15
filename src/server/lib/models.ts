// Note: change this according to model.
import { ChatMode } from "@prisma/client";

const universalParams = {
  temperature: 0.89,
  max_tokens: 1024,
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
    params: universalParams,
  },
  mythomax: {
    id: "gryphe/mythomax-l2-13b",
    friendlyName: "MythoMax",
    description: "Good overall capabilities - high in roleplaying and storytelling.",
    tokens: 4096,
    params: universalParams,
  },
  openhermes25: {
    id: "teknium/openhermes-2.5-mistral-7b",
    friendlyName: "",
    description:
      "Good roleplaying capabilities, fast replies, but output quality (consistency & repeating) may vary.",
    tokens: 4096,
    params: universalParams,
  },
  mixtral: {
    id: "mistralai/mixtral-8x7b-instruct",
    friendlyName: "Mixtral",
    description:
      "Great memory, high in reasoning (on par with ChatGPT), but creativity and roleplaying abilities may vary.",
    tokens: 32768,
    params: universalParams,
  },
};

export const defaultModels = {
  roleplay: models.psyfighter,
  adventure: models.mixtral,
  chat: models.mixtral,
};

export const getRoleplayModel = (preferredModelId?: ModelId | string | null) => {
  if (preferredModelId && getModelById(preferredModelId)) {
    return getModelById(preferredModelId)!;
  }
  return defaultModels.roleplay;
};

export const getAdventureModel = () => {
  return defaultModels.adventure;
};

export const getChatModel = (preferredModelId?: ModelId | string | null) => {
  if (preferredModelId && getModelById(preferredModelId)) {
    return getModelById(preferredModelId)!;
  }
  return defaultModels.chat;
};

export const getModelToUse = (
  mode: ChatMode,
  preferredModelId?: ModelId | string | null,
): Model => {
  switch (mode) {
    case ChatMode.ROLEPLAY:
      return getRoleplayModel(preferredModelId);
    case ChatMode.ADVENTURE:
      return getAdventureModel();
    case ChatMode.CHAT:
      return getChatModel(preferredModelId);
    default:
      console.warn(`Unknown mode: ${mode}`);
      return getRoleplayModel(preferredModelId);
  }
};

export const getModelById = (modelId: ModelId | string) => {
  return Object.values(models).find((m) => m.id === modelId);
};
