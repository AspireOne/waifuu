import { t } from "@lingui/macro";
import { z } from "zod";

export const requestEarlyAccessFormValues = z.object({
  email: z.string().email(t`Invalid email`),
  name: z.string().min(1, t`Name is required`),
  age: z.union([z.number().min(10).max(100), z.string()]),
  hearAboutUs: z.enum(["friends", "social_media", "google_search", "advertisement", "other"], {
    errorMap: (issue, ctx) => ({ message: t`This is required` }),
  }),
});

export type RequestEarlyAccessFormValues = z.infer<typeof requestEarlyAccessFormValues>;
