import { Email } from "@/emails/components/Email";
import { Text } from "@jsx-email/all";
import { paths } from "@lib/paths";
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
        {t({
          message: `Dear user,
          
            We have just accepted your request to join early access program. You can now ${(
              <a href={paths.login()}>{t`create an account`}</a>
            )} with this email and start using Waifuu.
            
            If you encounter a bug, or have a feature request, we would greatly appreciate if you let us know using the built-in feedback feature. Remember, Waifuu is still in beta, so there might be some hiccups here and there. We are actively working to polish all rough edges based on your feedback.            
            
            If you have any problems, insights, or just want to say hello, don't hesitate and reach to us.
            We cannot wait for what you will create. Sincerely,
            Team Waifuu`,
        })}
      </Text>
    </Email>
  );
};
