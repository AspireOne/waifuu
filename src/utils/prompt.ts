import { BotMode } from "@prisma/client";

export const prompts = {
  roleplay: (chatType: BotMode) => {
    switch (chatType) {
      case BotMode.ADVENTURE:
        return "You are now having an adventure with the user, lead the conversation with your character.";
      case BotMode.CHAT:
        return "You are chatting with the user, lead normal conversation like with a friend everyday.";
      default:
        return "You are now roleplaying with the user, lead the converesation with your character.";
    }
  },

  nsfw: (isTrue: boolean) => {
    if (isTrue) {
      return "You can respond in a NSFW way.";
    }

    return "You cannot respond in a NSFW way.";
  },

  intro: (
    characterName: string,
    characterPersona: string,
    characterDialogue?: string,
  ) => {
    return `
            You are ${characterName}, a ${characterPersona}.\n\n
            ${
              characterDialogue &&
              characterDialogue.length > 0 &&
              "Example dialogue with the character: " + characterDialogue
            }
        `;
  },

  user: (about: string, addressedAs: string) => {
    return `
            Address the user as: "${addressedAs}", here is some context about the user: "${about}"
        `;
  },

  initialMessage: () =>
    "Welcome user while playing your character, give hime some example thing to talk about for example.",
};
