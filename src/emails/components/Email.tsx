// biome-ignore lint:
import { Body, Head, Html, Preview, Tailwind } from "@jsx-email/all";

import { PropsWithChildren } from "react";
import { i18n } from "@lingui/core";
import { EmailFooter } from "@/emails/components/EmailFooter";

type EmailProps = PropsWithChildren<{
  preview: string;
}>;

/** Base email container. */
export const Email = ({ preview, children }: EmailProps) => {
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
          {children}
          <EmailFooter />
        </Tailwind>
      </Body>
    </Html>
  );
};
