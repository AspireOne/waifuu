// Note: change this according to model.
import { ChatMode } from "@prisma/client";

const universalParams = {
  temperature: 0.89,
  frequency_penalty: 0.3,
  route: "fallback",
  stream: false,
};

export type ModelId =
  | "gryphe/mythomax-l2-13b"
  | "nothingiisreal/mn-celeste-12b"
  | "mistralai/mixtral-8x22b-instruct";

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

type ModelKey = "mythomax" | "mnCeleste" | "mixtral";

export const models: Record<ModelKey, Model> = {
  mnCeleste: {
    id: "nothingiisreal/mn-celeste-12b",
    friendlyName: "Mistral Nemo Celeste",
    description:
      "Best roleplaying, output speed and reasoning might be on the slow side.",
    tokens: 15000,
    params: { ...universalParams, max_tokens: 15000 },
  },
  mixtral: {
    id: "mistralai/mixtral-8x22b-instruct",
    friendlyName: "Mixtral",
    description:
      "Great memory, high in reasoning, good roleplaying capabilities.",
    tokens: 32768,
    params: { ...universalParams, max_tokens: 32668 },
  },
  mythomax: {
    id: "gryphe/mythomax-l2-13b",
    friendlyName: "MythoMax",
    description: "Good overall capabilities - high in roleplaying and storytelling, but bad memory.",
    tokens: 4096,
    params: { ...universalParams, max_tokens: 3996 },
  },
};

export const defaultModels = {
  roleplay: models.mnCeleste,
  adventure: models.mnCeleste, // TODO: use mixtral later because of memory. It is just harder to prompt.
  chat: models.mnCeleste,
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
