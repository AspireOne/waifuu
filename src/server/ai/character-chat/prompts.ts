// Should contain all the prompts for character chat.
import { getSystemPrompt as _getSystemPrompt } from "@/server/ai/character-chat/systemPrompt";
import { ChatMode } from "@prisma/client";

const getSystemPrompt = (
  mode: ChatMode,
  persona: string,
  characterName: string,
  addressedAs: string | null,
) =>
  _getSystemPrompt(mode).format({
    characterPersona: persona,
    characterName: characterName,
    addressedAs: addressedAs ? ` addressed '${addressedAs}` : "",
  });

// TODO: Change the system prompt based on mode.
const getInitialMessagePrompt = (mode: ChatMode, userContext?: string | null) => {
  return `{{Welcome and engage the user with something fun. Stay in your character.${
    userContext ? ` Note this additional info about the user: '${userContext}'.` : ""
  }}}`;
};

// TODO: Model-specific finetuning. For example 'gryphe/mythomax-l2-13b-8k' needs "Do not prepend messages with any prefix. Write just raw message."

export { getSystemPrompt, getInitialMessagePrompt };
