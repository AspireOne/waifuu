import { t } from "@lingui/macro";
import { z } from "zod";

export default z.object({
  email: z
    .string()
    .email({ message: t`Email is invalid.` })
    .max(130, { message: t`Email is too long.` }),

  password: z
    .string()
    .min(6, { message: t`Password is too short.` })
    .max(100, { message: t`Password is too long.` }),
});
