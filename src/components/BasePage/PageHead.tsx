import Head from "next/head";
import { PropsWithChildren } from "react";

export default function PageHead(
  props: PropsWithChildren<{ title: string | null | undefined; description?: string }>,
) {
  return (
    <Head>
      <title key={"page-title"}>{props.title ? `${props.title} | Waifuu` : "Waifuu"}</title>
      {props.description && (
        <meta
          key="description"
          name="description"
          content={
            props.description ?? "A role-playing app to make all your imaginations come true."
          }
        />
      )}
      {props.children}
    </Head>
  );
}
