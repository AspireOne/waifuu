import { t } from "@lingui/macro";
import { z } from "zod";

export default z.object({
  username: z
    .string()
    .min(3, { message: t`Username is required.` })
    .max(16, { message: t`Username is too long.` })
    .optional(),
  name: z
    .string()
    .min(3, { message: t`Name is required.` })
    .max(80, { message: t`Name is too long.` })
    .optional(),
  email: z
    .string()
    .email({ message: t`Email is invalid.` })
    .max(130, { message: t`Email is too long.` })
    .optional(),
  bio: z.string().max(500, { message: t`Bio is too long.` }).optional(),
  addressedAs: z.string().max(30, { message: t`'Adressed as' is too long.` }).optional(),
  botContext: z.string().max(500, { message: t`About is too long.` }).optional(),
  imageUrl: z.string().max(500, { message: t`Image url is too long.` }).optional(),
  locale: z.string().length(2, { message: t`Must be a 2-letter code.` }).optional(),
});
