import { Bot, BotChat, User } from "@prisma/client";

import { PipelinePromptTemplate, PromptTemplate } from "langchain/prompts";
import { getIntroductionPrompt } from "@/server/ai/character-chat/introductionPrompt";

const fullCharacterPrompt = PromptTemplate.fromTemplate(
  "{introduction}\n\n{userPronounsPrompt} {userContextPrompt}",
);

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
