import RegisterEmailTemplate, {
  getRegisterEmailSubject,
} from "@/emails/templates/RegisterEmailTemplate";
import { email } from "@/server/lib/email";
import * as Sentry from "@sentry/nextjs";
import { DecodedIdToken } from "firebase-admin/lib/auth";

export const sendWelcomeEmail = async (decodedIdToken: DecodedIdToken) => {
  await email
    .send({
      from: email.from.info,
      to: [decodedIdToken.email!],
      template: RegisterEmailTemplate({ username: decodedIdToken.name || "user" }),
      subject: getRegisterEmailSubject(),
    })
    .catch((err) => {
      console.error("Error sending registration email. Reported to sentry.", err);
      Sentry.captureException(err);
    });
};
