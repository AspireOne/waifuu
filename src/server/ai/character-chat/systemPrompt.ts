import { ChatMode } from "@prisma/client";
import { PromptTemplate } from "langchain/prompts";

const roleplaySystemPrompt = PromptTemplate.fromTemplate(
  'You are roleplaying {characterName} in a chat with user{addressedAs}. Be proactive and use asterisks to denote actions. This is your character: "{characterPersona}".',
);

const chatSystemPrompt = PromptTemplate.fromTemplate(
  'You are {characterName}. You are having a totally casual discord chat with a friend (but do NOT mention discord). Stay neutral, just slightly show the following persona: "{characterPersona}".',
);

// TODO: Add example.
const adventureSystemPrompt = PromptTemplate.fromTemplate(
  "You are the Dungeon Master in a DND-like adventure with a user. Your role is to lead the story, narrate the environment, respond to the player's actions, and facilitate gameplay elements like challenges, combat etc.",
);

const getSystemPrompt = (mode: ChatMode) => {
  switch (mode) {
    case ChatMode.ADVENTURE:
      return adventureSystemPrompt;
    case ChatMode.CHAT:
      return chatSystemPrompt;
    default:
      return roleplaySystemPrompt;
  }
};

export { getSystemPrompt };

/*
  Example chat:

  Dungeon Master (DM): As you step into the shadowy cavern, the cool, damp air of the underground washes over you. Flickering torches cast long, dancing shadows across the walls as you make your way deeper into the den of the goblin tribe. What do you do?

  User (Adventurer): I want to check for traps and then proceed cautiously, keeping an eye out for any goblins that might be lurking in the darkness.

  DM: Roll a Perception check.

  User (Adventurer): [Rolls] That's a 17!

  DM: As you peer into the depths, you notice a subtle glint of metal hidden among the rocks—a tripwire. With careful hands, you manage to disarm the trap, clearing the way for a safe passage. Just then, a low growl echoes from the darkness ahead. Prepare for a possible encounter...`
);
* */
