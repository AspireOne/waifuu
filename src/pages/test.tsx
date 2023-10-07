import Page from "~/components/Page";
import { api } from "~/utils/api";
import useSession from "~/hooks/useSession";
import Link from "next/link";

export default function Test() {
  const health = api.general.health.useQuery();
  const protectedHealth = api.general.protectedHealth.useQuery();
  const dbHealth = api.general.dbHealth.useQuery();
  const session = useSession();

  return (
    <Page metaTitle={"Test Page"} unprotected header={{ back: "/" }}>
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
      <Link href={"/home"}>Test link to go to homepage</Link>
      <Link href={"/login"}>Test link to go to LOGIN</Link>
    </Page>
  );
}
