import { Email } from "@/emails/components/Email";
import { Text } from "@jsx-email/all";
import { t } from "@lingui/macro";

type RegisterEmailProps = {
  username?: string;
};

export const getRegisterEmailSubject = () => {
  return t`Welcome To Waifuu`;
};

// Must be exported as defalt.
export default ({ username = "John Doe" }: RegisterEmailProps) => {
  return (
    <Email
      preview={t`Thank you for joining! What can you look forward to?`}
      title={t`A warm welcome from Waifuu ❤`}
    >
      <Text className={"whitespace-pre-wrap"}>
        {t({
          message: `Dear ${username ?? "user"},
          
            Welcome to Waifuu! We are thrilled to have you join our creative and adventurous community. Get ready to immerse yourself in a world of endless possibilities where your imagination takes center stage.
            At Waifuu, you will enter a realm filled with captivating fictional characters waiting to be explored, interacted with, and even created by you. Join in dynamic conversations, craft intriguing narratives, and embark on extraordinary experiences.
            
            We cannot wait for what you will create. If you have any problems, insights, or just want to say hello, don't hesitate and reach to us. We are a small team and we want to make your stay here as pleasant as possible.
            
            Sincerely,
            Team Waifuu`,
        })}
      </Text>
    </Email>
  );
};
