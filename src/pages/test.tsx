import { useSession } from "@/hooks/useSession";
import { api } from "@/lib/api";
import { paths } from "@/lib/paths";
import { CombinedPage } from "@components/CombinedPage";
import { Button } from "@nextui-org/react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Test() {
  const health = api.general.health.useQuery();
  const protectedHealth = api.general.protectedHealth.useQuery();
  const dbHealth = api.general.dbHealth.useQuery();
  const session = useSession();

  const sendTestEmailMut = api.general.sendTestEmail.useMutation();

  return (
    <CombinedPage title={"Test Page"}>
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
      <Button
        onClick={async () => {
          await sendTestEmailMut.mutateAsync();
        }}
      >
        Send test email
      </Button>

      <Button
        variant={"bordered"}
        onClick={() => {
          // random type between "success", "error", "info", "warn"
          const type = ["success", "error", "info", "warn"][Math.floor(Math.random() * 4)];
          // @ts-ignore
          toast("Hey I fucked up", { type: type });
        }}
      >
        Test toast
      </Button>

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
    </CombinedPage>
  );
}
