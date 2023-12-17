import { env } from "@/server/env";
import { render } from "@jsx-email/render";
import nodemailer from "nodemailer";

const from = {
  info: `Waifuu ${env.MAIL_INFO_ADDRESS}`,
};

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  // @ts-ignore bad nodemailer types
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_ENCRYPTION === "ssl", // If using SSL (port 465), set to true; for STARTTLS (port 587), set to false
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
});

type SendProps = {
  template: JSX.Element;
  to: string | string[];
  subject: string;
  from?: string;
};

const send = async (props: SendProps) => {
  const htmlContent = await render(props.template, { minify: true });
  const textContent = await render(props.template, { plainText: true, minify: true });

  const mailOptions = {
    from: props.from ?? from.info,
    to: props.to,
    subject: props.subject,
    text: textContent,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

export const email = {
  send,
  from,
};
