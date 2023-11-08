import { protectedProcedure } from "@/server/lib/trpc";
import { CharacterTag } from "@prisma/client";
import { z } from "zod";

export default protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(10).default(10),
    }),
  )
  .query(() => {
    const characterCategoryMapping: Record<CharacterTag, string> = {
      [CharacterTag.GIRLFRIEND]: 'Girlfriend',
      [CharacterTag.BOYFRIEND]: 'Boyfriend',
      [CharacterTag.ROMANCE]: 'Romance',
      [CharacterTag.FANTASY]: 'Fantasy',
      [CharacterTag.SUPERNATURAL]: 'Supernatural',
      [CharacterTag.FEMALE]: 'Female',
      [CharacterTag.MALE]: 'Male',
      [CharacterTag.HORROR]: 'Horror',
      [CharacterTag.HERO]: 'Hero',
      [CharacterTag.COMEDY]: 'Comedy',
      [CharacterTag.NERD]: 'Nerd',
      [CharacterTag.SHY]: 'Shy',
      [CharacterTag.BAD]: 'Bad',
      [CharacterTag.ANIME]: 'Anime',
      [CharacterTag.GAME_CHARACTER]: 'Game Character',
      [CharacterTag.HISTORY]: 'History',
      [CharacterTag.MOVIE]: 'Movie',
      [CharacterTag.MONSTER]: 'Monster',
      [CharacterTag.BOOKS]: 'Books',
      [CharacterTag.OC]: 'OC',
    };

    return characterCategoryMapping;
  });
