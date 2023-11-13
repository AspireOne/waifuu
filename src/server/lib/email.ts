import { env } from "@/server/env";
import { emailClient } from "@/server/lib/emailClient";
import { render } from "@jsx-email/render";

const client = emailClient;
const from = {
  test: `Companion Test <mailgun@${env.MAILGUN_DOMAIN}>`,
  // TODO: Change this when we have a domain (Companion info@companion.com)
  info: `Companion <mailgun@${env.MAILGUN_DOMAIN}>`,
};

type SendProps = {
  template: JSX.Element;
  to: string[];
  subject: string;
  from: string;
};

const send = async (props: SendProps) => {
  await client.messages.create(env.MAILGUN_DOMAIN, {
    from: props.from,
    to: props.to,
    subject: props.subject,
    text: await render(props.template, {
      plainText: true,
      minify: true,
    }),
    html: await render(props.template, {
      minify: true,
    }),
  });
};

export const email = {
  client,
  from,
  send,
};
