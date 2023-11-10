import { Email } from "@/emails/components/Email";
import { Heading, Section, Text } from "@jsx-email/all";
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
  return t({ message: `Hot tiddy girls test`, context: "Internal test email" });
};

// Must be exported as defalt.
export default ({
  content = t({ message: "Fuck mee", context: "Internal test message" }),
}: TestEmailProps) => {
  return (
    <Email
      preview={t({
        message: `Do you love hot tiddy girls? Check this out!`,
        context: "Internal test email",
      })}
    >
      <Section className={"p-4"}>
        <Heading as="h1" className="text-2xl font-bold text-center text-blue-600">
          {t({
            message: `I love hot tiddy girls!`,
            context: "Internal test email",
          })}
        </Heading>
        <Text className="text-gray-700 text-center">
          {t({
            message: `Do you love hot tiddy girls? Check this out!`,
            context: "Internal test email",
          })}
        </Text>
        <Text>{content}</Text>
      </Section>
    </Email>
  );
};
