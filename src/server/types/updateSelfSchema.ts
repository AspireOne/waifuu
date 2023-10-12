import { z } from "zod";

export default z.object({
  username: z
    .string()
    .min(3, { message: "Required." })
    .max(16, { message: "Too long." }),
  name: z
    .string()
    .min(3, { message: "Required." })
    .max(80, { message: "Too long." })
    .nullable(),
  email: z
    .string()
    .email({ message: "Invalid." })
    .max(100, { message: "Too long." }),
  bio: z.string().max(500, { message: "Too long." }).nullable(),
  addressedAs: z.string().max(50, { message: "Too long." }).nullable(),
  about: z.string().max(500, { message: "Too long." }).nullable(),
});
