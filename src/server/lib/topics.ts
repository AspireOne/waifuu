// The topic will be generated based on the user's preferred tags, combined with the other users preferred tags.

// We could present it like this:
// [A situation where there are two or more characters]
// ["You are {Character A}"]  OR  ["You are {Character B}"]
//
// Then they can start talking directly in their role.

// TODO: Translate :(
export type TopicTags =
  | "Anime"
  | "Isekai"
  | "NSFW"
  | "Real World"
  | "Strategy"
  | "Mystery";

type Topic = {
  tags: TopicTags[];
  content: string;
  characters?: [string, string]; // If this is set, on top of writing the topic, each of the user will be assigned one of the characters.
};
export default [
  {
    tags: ["Anime", "Mystery"],
    content:
      "Two individuals wake up in a strange mansion with no memory of how they got there, clues scattered around suggest something sinister.",
  },
  {
    tags: ["Anime", "Real World"],
    content:
      "Two high school students discover they have superpowers and must balance their normal life with their new responsibilities.",
  },
  {
    tags: ["Anime", "NSFW"],
    content:
      "A private investigator is approached by a mysterious woman with a case, insisting on partnering for the investigation.",
  },
  {
    tags: ["Anime", "Isekai", "Strategy"],
    content:
      "Summoned to a fantasy world, a chief strategist and a royal advisor find themselves tasked with helping a struggling kingdom thrive.",
  },
];
