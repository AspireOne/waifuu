import { paths, semanticPaths } from "@lib/paths";
import { useSession } from "@providers/SessionProvider";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

let redirectCount = 0;

export const useAutoRedirect = () => {
  const searchParams = useSearchParams();
  const session = useSession();
  const router = useRouter();
  let redirect = searchParams.get("redirect");

  async function redirectOnSuccessfulSignIn() {
    if (router.pathname !== semanticPaths.appIndex) {
      await router.replace(redirect || semanticPaths.appIndex);
    }
  }

  // If the redirect leads to this page itself, remove it.
  if ((redirect || "").replace("/", "").includes(paths.login().replace("/", ""))) {
    redirect = null;
    // Remove the "redirect" query param from the url.
    if (router?.isReady) router.replace(router.pathname);
  }

  // If the user is already logged in, redirect to 'redirect' or the app.
  // IMPORTANT: Check for session.user instead of session.status.
  useEffect(() => {
    // Just a safety handle, because there was some rare cycling issues.
    if (redirectCount > 2) {
      window.location.replace(semanticPaths.appIndex);
      return;
    }

    if (session.user?.id && router.isReady && router.pathname !== semanticPaths.appIndex) {
      redirectCount++;
      router.replace(redirect || semanticPaths.appIndex);
    }
  }, [router, session.user, session.user?.id]);

  return { redirectOnSuccessfulSignIn };
};
