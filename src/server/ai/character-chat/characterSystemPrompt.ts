import { Bot, Chat, User } from "@prisma/client";

import { getIntroductionPrompt } from "@/server/ai/character-chat/introductionPrompt";
import { PipelinePromptTemplate, PromptTemplate } from "langchain/prompts";

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

export async function getCharacterSystemPrompt(chat: Chat & { bot: Bot } & { user: User }) {
  const bot = chat.bot;
  const user = chat.user;

  const prompt = new PipelinePromptTemplate({
    pipelinePrompts: [
      {
        name: "introduction",
        prompt: getIntroductionPrompt(chat.mode),
      },
      // TODO: Example.
      {
        name: "userPronounsPrompt",
        prompt: user.addressedAs ? userPronounsPrompt : emptyPrompt,
      },
      {
        name: "userContextPrompt",
        prompt: user.botContext ? userContextPrompt : emptyPrompt,
      },
      // Here we intentionally omit NSFW prompt. The LLM will output NSFW only if the user explicitly prompts it to anyways.
    ],
    finalPrompt: fullCharacterPrompt,
  });

  return await prompt.format({
    characterPersona: bot.persona,
    userPronouns: user.addressedAs,
    userContext: user.botContext,
  });
}
