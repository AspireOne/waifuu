// Should contain all the prompts for character chat.
import { getCharacterSystemPrompt } from "@/server/ai/character-chat/characterSystemPrompt";
import { getIntroductionPrompt } from "@/server/ai/character-chat/introductionPrompt";
import { ChatMode } from "@prisma/client";

const getInitialMessageSystemPrompt = (mode: ChatMode, persona: string) =>
  getIntroductionPrompt(mode).format({
    characterPersona: persona,
  });

const initialMessagePrompt =
  "Welcome and engage the user. Give hime something to talk about. It can be a question, a statement, it can be happy, sad... Anything to engage them.";

export { getInitialMessageSystemPrompt, getCharacterSystemPrompt, initialMessagePrompt };
