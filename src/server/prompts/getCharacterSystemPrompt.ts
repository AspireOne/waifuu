import { Bot, BotMode, User, BotChat } from "@prisma/client";
import { PipelinePromptTemplate, PromptTemplate } from "langchain/prompts";
import { Prisma } from ".prisma/client";

const fullCharacterPrompt = PromptTemplate.fromTemplate(
  "{introduction}\n\n{exampleDialogue}\n\n{userInfo}\n{nsfwText}",
);

// ------ Mode-specific introduction prompts ------ //
const roleplayIntroductionPrompt = PromptTemplate.fromTemplate(
  "Roleplay {characterName}, a {characterPersona}.",
);

const adventureIntroductionPrompt = PromptTemplate.fromTemplate(
  "You are now having an adventure with the user. Lead the conversation while roleplaying {characterName}, a {characterPersona}.",
);

const chatModeIntroductionPrompt = PromptTemplate.fromTemplate(
  "You are chatting with the user. Lead the conversation like with a friend everyday. Roleplay {characterName}, a {characterPersona}.",
);
// ------------------------------------------------- //

const userInfoPrompt = PromptTemplate.fromTemplate(
  "Address the user as '{addressedAs}'. Here is some context about the user: '{about}'",
);

const allowNsfwPrompt = PromptTemplate.fromTemplate(
  "You {nsfwPronoun} respond in a NSFW way.",
);

// TODO
const examplePrompt = PromptTemplate.fromExamples(
  [],
  "",
  [],
  ", ",
  "Example dialogue: ",
);

export async function getCharacterSystemPrompt(
  chat: BotChat & { bot: Bot } & { user: User },
) {
  const prompt = new PipelinePromptTemplate({
    pipelinePrompts: [
      {
        name: "introduction",
        prompt: getIntroductionPrompt(chat.botMode),
      },
      {
        name: "exampleDialogue",
        prompt: examplePrompt,
      },
      {
        name: "userInfo",
        prompt: userInfoPrompt,
      },
      {
        name: "nsfwText",
        prompt: allowNsfwPrompt,
      },
    ],
    finalPrompt: fullCharacterPrompt,
  });

  const bot = chat.bot;
  const user = chat.user;

  return await prompt.format({
    characterName: bot.characterName,
    characterPersona: bot.characterPersona,
    addressedAs: user.addressedAs,
    about: user.about,
    nsfwPronoun: bot.characterNsfw ? "can" : "should not",
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
