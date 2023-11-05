import Page from "@/components/Page";
import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";
import { paths } from "@/lib/paths";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

export default function Test() {
  const health = api.general.health.useQuery();
  const protectedHealth = api.general.protectedHealth.useQuery();
  const dbHealth = api.general.dbHealth.useQuery();
  const session = useSession();

  return (
    <Page title={"Test Page"} unprotected backPath={"/"}>
      <p>Backend API Health: {health.isLoading ? "Loading..." : health.data}</p>
      <p>DB Health: {dbHealth.isLoading ? "Loading..." : dbHealth.data}</p>
      <p>
        Protected backend API Health:{" "}
        {protectedHealth.isLoading ? "Loading..." : protectedHealth.data}
      </p>
      <p>
        Session:{" "}
        {session.status === "loading"
          ? "Loading..."
          : JSON.stringify(session.user) ?? "undefined"}
      </p>
      <Link href={paths.home}>Test link to go to homepage</Link>
      <Link href={paths.login()}>Test link to go to LOGIN</Link>

      <button
        type="button"
        style={{
          padding: "12px",
          cursor: "pointer",
          backgroundColor: "#AD6CAA",
          borderRadius: "4px",
          border: "none",
          color: "white",
          fontSize: "14px",
          margin: "18px",
        }}
        onClick={async () => {
          const transaction = Sentry.startTransaction({
            name: "Example Frontend Transaction",
          });

          Sentry.configureScope((scope) => {
            scope.setSpan(transaction);
          });

          try {
            const res = await fetch("/api/sentry-example-api");
            if (!res.ok) {
              throw new Error("Sentry Example Frontend Error");
            }
          } finally {
            transaction.finish();
          }
        }}
      >
        Test sentry.
      </button>
    </Page>
  );
}
