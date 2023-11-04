import { Bot, BotChat, BotMode, User } from "@prisma/client";

import { PipelinePromptTemplate, PromptTemplate } from "langchain/prompts";

const fullCharacterPrompt = PromptTemplate.fromTemplate(
  "{introduction}\n\n{userPronounsPrompt} {userContextPrompt}",
);

// ------ Mode-specific introduction prompts ------ //
const roleplayIntroductionPrompt = PromptTemplate.fromTemplate(
  'Roleplay a character and casually talk with a user. This is your character: "{characterPersona}".',
);

const adventureIntroductionPrompt = PromptTemplate.fromTemplate(
  "You are having a DND-like adventure with a user. Lead the story - you are the dungeon master.",
);

const chatModeIntroductionPrompt = PromptTemplate.fromTemplate(
  'You are having a totally casual discord chat with a friend. Stay neutral, just slightly show the following persona: "{characterPersona}".',
);
// ------------------------------------------------- //

const userPronounsPrompt = PromptTemplate.fromTemplate(
  "The user wishes to be addressed as '{userPronouns}'.",
);

const userContextPrompt = PromptTemplate.fromTemplate(
  "Note this additional info about the user: '{userContext}'.",
);

const emptyPrompt = PromptTemplate.fromTemplate("");

export async function getCharacterSystemPrompt(chat: BotChat & { bot: Bot } & { user: User }) {
  const bot = chat.bot;
  const user = chat.user;

  const prompt = new PipelinePromptTemplate({
    pipelinePrompts: [
      {
        name: "introduction",
        prompt: getIntroductionPrompt(chat.botMode),
      },
      // TODO: Example.
      {
        name: "userPronounsPrompt",
        prompt: user.addressedAs ? userPronounsPrompt : emptyPrompt,
      },
      {
        name: "userContextPrompt",
        prompt: user.about ? userContextPrompt : emptyPrompt,
      },
      // Here we intentionally omit NSFW prompt. The LLM will output NSFW only if the user explicitly prompts it to anyways.
    ],
    finalPrompt: fullCharacterPrompt,
  });

  return await prompt.format({
    characterPersona: bot.characterPersona,
    userPronouns: user.addressedAs,
    userContext: user.about,
  });
}

function getIntroductionPrompt(mode: BotMode) {
  switch (mode) {
    case BotMode.ADVENTURE:
      return adventureIntroductionPrompt;
    case BotMode.CHAT:
      return chatModeIntroductionPrompt;
    default:
      return roleplayIntroductionPrompt;
  }
}
