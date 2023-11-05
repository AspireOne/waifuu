import { ChatMode } from "@prisma/client";
import { PromptTemplate } from "langchain/prompts";

const roleplayIntroductionPrompt = PromptTemplate.fromTemplate(
  'Roleplay a character and casually talk with a user. This is your character: "{characterPersona}".',
);

const adventureIntroductionPrompt = PromptTemplate.fromTemplate(
  "You are having a DND-like adventure with a user. Lead the story - you are the dungeon master.",
);

const chatModeIntroductionPrompt = PromptTemplate.fromTemplate(
  'You are having a totally casual discord chat with a friend. Stay neutral, just slightly show the following persona: "{characterPersona}".',
);

const getIntroductionPrompt = (mode: ChatMode) => {
  switch (mode) {
    case ChatMode.ADVENTURE:
      return adventureIntroductionPrompt;
    case ChatMode.CHAT:
      return chatModeIntroductionPrompt;
    default:
      return roleplayIntroductionPrompt;
  }
};

export { getIntroductionPrompt };
