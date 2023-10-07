import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    /*TODO: Switch lang appropriately.*/
    <Html lang="en">
      <Head>
        {/* Otherwise google profile pics don't load. */}
        <meta name="referrer" content="no-referrer" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
