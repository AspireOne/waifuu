import { AnimatePresence, motion } from "framer-motion";
import React, { PropsWithChildren, useEffect } from "react";
import PageHead from "~/components/PageHead";
import { twMerge } from "tailwind-merge";
import { ActionBar } from "~/components/ActionBar";
import { useSession } from "~/hooks/useSession";
import { useRouter } from "next/router";
import { paths } from "~/lib/paths";
import { AppHeader } from "src/components/AppHeader";
import { normalizePath } from "~/utils/utils";

function Page(
  props: PropsWithChildren<{
    className?: string;
    /** Will be shown in the browser title bar and in Header. */
    title: string;
    /** Meta description of the page. */
    description?: string;
    /** Default: false */
    unprotected?: boolean;
    /** Default: false */
    showActionBar?: boolean;
    /** Default enabled: true */
    showHeader?: boolean;

    /** Explicit path to a page that will be loaded on back button click. */
    backPath?: string;
    /** If enabled, will go to previous page on back button click.
     *
     * If enabled and backPath is specified, will go to previous page if exists, and if it doesn't, will go to the specified page.
     *
     * If enabled and there is no previous path nor backPath specified, will do nothing and back button will not be shown.
     * @default true
     */
    autoBack?: boolean;
    /** Triggered when the back button is clicked. Can be used for cleanups. */
    onBack?: () => void;
  }>,
) {
  // Set default values for props.
  const unprotected = props.unprotected ?? false;
  const showActionBar = props.showActionBar ?? false;
  const showHeader = props.showHeader ?? true;
  const autoBack = props.autoBack ?? true;
  const backPath = props.backPath;

  const [prevPathExists, setPrevPathExists] = React.useState(false);
  useEffect(() => {
    setPrevPathExists(window.history.length > 1);
  }, []);

  const router = useRouter();

  // TODO: HAndle hardware back button using Capacitor.
  function handleBackClick() {
    if (!backPath && !autoBack) return;

    if (autoBack && prevPathExists) {
      router.back();
      props.onBack?.();
      return;
    }

    if (backPath) {
      router.push(backPath);
      props.onBack?.();
      return;
    }
  }

  return (
    <div
      id={"_page-root-container"}
      key={"_page-root-container"}
      className={"min-h-screen max-h-screen"}
    >
      <PageHead title={props.title} description={props.description} />

      {/*TODO: PC Navbar.*/}

      {showHeader && (
        <AppHeader
          backButtonEnabled={(autoBack && prevPathExists) || !!backPath}
          onBackButtonPressed={handleBackClick}
        >
          {props.title}
        </AppHeader>
      )}

      <PageWrapper
        unprotected={unprotected}
        showingBottomNav={showActionBar}
        showingHeader={showHeader}
        className={twMerge("flex-1", props.className)}
      >
        {props.children}
      </PageWrapper>

      {showActionBar && <ActionBar />}
    </div>
  );
}

function PageWrapper(
  props: PropsWithChildren<{
    className?: string;
    unprotected: boolean;
    showingBottomNav: boolean;
    showingHeader: boolean;
  }>,
) {
  const router = useRouter();
  const { status } = useSession();

  const paddingBottom = props.showingBottomNav ? "pb-20" : "pb-4";
  const paddingTop = props.showingHeader ? "pt-20" : "pt-4";

  useEffect(() => {
    if (!props.unprotected && status === "unauthenticated") {
      const currPath = normalizePath(router.pathname);
      router.push(paths.login(currPath));
    }
  }, [status, props.unprotected, router, router.pathname]);

  return (
    <AnimatePresence>
      <motion.section
        key={"_page-root-div-anim-div"}
        id={"_page-rot-div-anim-div"}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        // change animation movement to be fast at the start and slow at the end.
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.1,
        }}
        exit={{ y: 5, opacity: 0 }}
      >
        <div
          className={twMerge(
            "mx-auto max-w-[1500px] px-4 sm:px-8 md:px-14 lg:px-14",
            paddingTop,
            paddingBottom,
            props.className,
          )}
        >
          {props.children}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

export default Page;
