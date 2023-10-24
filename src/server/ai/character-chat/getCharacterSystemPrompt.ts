import { Bot, BotMode, User, BotChat } from "@prisma/client";
import { PipelinePromptTemplate, PromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/dist/schema/output_parser";

const fullCharacterPrompt = PromptTemplate.fromTemplate(
  "{formatInstructions} {introduction} {exampleDialogue} {userAddress} {userAbout} {nsfwText}",
);

// ------ Mode-specific introduction prompts ------ //
const roleplayIntroductionPrompt = PromptTemplate.fromTemplate(
  'You are {characterName}. You casually chat with a person. Your persona: "{characterPersona}"',
);

const adventureIntroductionPrompt = PromptTemplate.fromTemplate(
  "You are having an adventure with a user. Lead the conversation. Be neutral, just slightly show the following persona: {characterPersona}",
);

const chatModeIntroductionPrompt = PromptTemplate.fromTemplate(
  "You are having a very casual conversation with a friend. You should stay neutral, just slightly show the following persona: {characterPersona}",
);
// ------------------------------------------------- //

const userAboutPrompt = PromptTemplate.fromTemplate(
  "Here is some context about the user: '{about}'.",
);

const userAddressPrompt = PromptTemplate.fromTemplate(
  "If you need to, address the user as '{addressedAs}'.",
);

const allowNsfwPrompt = PromptTemplate.fromTemplate(
  "You {nsfwPronoun} respond in a NSFW way.",
);

// ------ Mode-specific examples ------ //

// TODO: fill a default example and create two more example for other modes.
const roleplayExamplePrompt = PromptTemplate.fromExamples(
  [],
  "",
  [],
  ", ",
  "Example dialogue: ",
);

// ------------------------------------ //

const emptyPrompt = PromptTemplate.fromTemplate("");

export async function getCharacterSystemPrompt(
  chat: BotChat & { bot: Bot } & { user: User },
  parser?: BaseOutputParser,
) {
  const bot = chat.bot;
  const user = chat.user;

  const prompt = new PipelinePromptTemplate({
    pipelinePrompts: [
      {
        name: "introduction",
        prompt: getIntroductionPrompt(chat.botMode),
      },
      {
        // If the user does not provide an example, provide a default one.
        name: "exampleDialogue",
        prompt: /*roleplayExamplePrompt*/ emptyPrompt,
      },
      {
        name: "userAddress",
        prompt: user.addressedAs ? userAddressPrompt : emptyPrompt,
      },
      {
        name: "userAbout",
        prompt: user.about ? userAboutPrompt : emptyPrompt,
      },
      {
        name: "nsfwText",
        prompt: allowNsfwPrompt,
      },
    ],
    finalPrompt: fullCharacterPrompt,
  });

  return await prompt.format({
    formatInstructions: parser ? parser.getFormatInstructions() + "\n" : "",
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
