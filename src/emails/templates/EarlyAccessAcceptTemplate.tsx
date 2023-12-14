import { Email } from "@/emails/components/Email";
import { Link, Row, Text } from "@jsx-email/all";
import { fullUrl, paths } from "@lib/paths";
import { t } from "@lingui/macro";

type RegisterEmailProps = {
  username?: string;
};

export const getEarlyAccessSubject = () => {
  return t`You were accepted into the early access program`;
};

type EarlyAccessEmailProps = {
  email: string;
};

// Must be exported as defalt.
export default ({ email = "john.doe@gmail.com" }: EarlyAccessEmailProps) => {
  return (
    <Email
      preview={t`You request to join the early access program has been accepted.`}
      title={t`Your early access request to Waifuu has been accepted`}
    >
      <Text className={"whitespace-pre-wrap"}>
        Dear user,
        <Row />
        We have just accepted your request to join early access program. You can now{" "}
        {<Link href={fullUrl(paths.login())}>create an account</Link>} with this email and
        start using Waifuu.
        <Row />
        <Row />
        If you encounter a bug, or have a feature request, we would greatly appreciate if you
        let us know using the built-in feedback feature. Remember, Waifuu is still in beta, so
        there might be some hiccups here and there. We are actively working to polish all rough
        edges based on your feedback.
        <Row />
        <Row />
        We cannot wait for what you will create. Sincerely,
        <Row />
        Team Waifuu`,
      </Text>
    </Email>
  );
};
