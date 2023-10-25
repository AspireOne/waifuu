// Should contain all the prompts for character chat.
import { getCharacterSystemPrompt } from "@/server/ai/character-chat/getCharacterSystemPrompt";

const getInitialMessagePrompt =
  "Welcome and engage the user. Give hime something to talk about. It can be a question, a statement, it can be happy, sad... Anything to engage them.";

export { getInitialMessagePrompt, getCharacterSystemPrompt };
