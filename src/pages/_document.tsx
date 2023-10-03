import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="referrer" content="no-referrer" />
        {/*<meta name="google-signin-client_id" content="24288336305-4508p4kdsovvoet4lgbi4kqfnako54a9.apps.googleusercontent.com"/>*/}
        <meta name="google-signin-scope" content="profile email" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
