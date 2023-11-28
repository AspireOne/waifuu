import { Email } from "@/emails/components/Email";
import { Text } from "@jsx-email/all";
import { t } from "@lingui/macro";

// Notes:
// 1. Everything must be wrapped using t``. <Trans> does not work.

// Tips:
// https://jsx.email/docs/components
// <Container> = horizontally center

// Example usage:
/*
await email.messages.create(env.MAILGUN_DOMAIN, {
  from: `mailgun <mailgun@${env.MAILGUN_DOMAIN}>`,
  to: [env.TESTING_EMAIL],
  subject: getTestEmailSubject(),
  text: await render(TestEmailTemplate({ content: "Batman is dead." }), {
    plainText: true,
  }),
  html: await render(TestEmailTemplate({ content: "Batman is dead." })),
})
*/

type TestEmailProps = {
  content: string;
};

export const getTestEmailSubject = () => {
  return t({ message: "Some superman batman test", context: "Internal test email" });
};

// Must be exported as defalt.
export default ({
  content = t({
    message: "Message message you lorem ipsum dolor sit amet",
    context: "Internal test message",
  }),
}: TestEmailProps) => {
  return (
    <Email
      preview={t({
        message: "If you love dolor ipsum lorem sit amut, click this",
        context: "Internal test email",
      })}
      title={t({
        message: "This is a very important message from waifuu!",
        context: "Internal test email",
      })}
    >
      <Text>
        {t({
          message: "This is a test email, check out the content below!",
          context: "Internal test email",
        })}
      </Text>
      <Text>{content}</Text>
    </Email>
  );
};
