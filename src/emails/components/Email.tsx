// biome-ignore lint:
import { Body, Head, Heading, Hr, Html, Preview, Section, Tailwind } from "@jsx-email/all";

import { PropsWithChildren } from "react";
import { i18n } from "@lingui/core";
import { EmailFooter } from "@/emails/components/EmailFooter";

type EmailProps = PropsWithChildren<{
  preview: string;
  title?: string;
}>;

/** Base email container. */
export const Email = ({ preview, title, children }: EmailProps) => {
  const lang = i18n.locale;
  console.log("=>(Email.tsx:13) lang", lang);

  return (
    <Html lang={lang}>
      <Head>{/*Some content here...*/}</Head>
      <Body>
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  brand: "#007291",
                },
              },
            },
          }}
        >
          <Preview>{preview}</Preview>
          <Section className={"px-4 pt-12 max-w-[800px] mx-auto whitespace-pre-line"}>
            {title && (
              <Heading as="h1" className="text-3xl font-bold mb-8">
                {title}
              </Heading>
            )}
            {children}
          </Section>
          <Hr className={"my-8"} />
          <EmailFooter />
        </Tailwind>
      </Body>
    </Html>
  );
};
