import Head from "next/head";
import { PropsWithChildren } from "react";

export default function PageHead(
  props: PropsWithChildren<{ title: string | null; description?: string }>,
) {
  // TODO: Change this shit meta description.
  return (
    <Head>
      <title key={"page-title"}>
        {props.title ? props.title + " | Companion" : "Companion"}
      </title>
      {props.description && (
        <meta
          key="page-description"
          name="description"
          content={
            props.description ??
            "A role-playing app to make all your imaginations come true."
          }
        />
      )}
      {props.children}
    </Head>
  );
}
