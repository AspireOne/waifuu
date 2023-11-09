import { Body, Head, Html, Tailwind } from "@jsx-email/all";

import { PropsWithChildren } from "react";

type EmailProps = PropsWithChildren<{
  lang?: string;
}>;

/** Base email container. */
export const Email = ({ lang = "", children }: EmailProps) => {
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
          {children}
        </Tailwind>
      </Body>
    </Html>
  );
};
