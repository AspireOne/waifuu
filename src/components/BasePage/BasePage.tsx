import { ActionBar } from "@components/ActionBar";
import { AppHeader } from "@components/AppHeader";
import PageHead from "@components/BasePage/PageHead";
import { Navbar } from "@components/Navbar";
import { useSession } from "@hooks/useSession";
import { paths } from "@lib/paths";
import { normalizePath } from "@lib/utils";
import { useCustomHistory } from "@providers/CustomHistoryProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export type PageProps = {
  className?: string;
  /** Will be shown in the browser title bar and in Header. */
  title: string;
  /** Meta description of the page. */
  description?: string;
  unprotected: boolean;
  topBar: "navbar" | "app-header";
  showActionBar: boolean;

  /** Explicit path to a page that will be loaded on back button click IF autoBack === true || there is no previous path on the stack. */
  backPath?: string | null;
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
  noPadding?: boolean;
};

/**
 * A base page that all specific pages derive from. Defines basic functionality.
 * @param props
 * @constructor
 */
export const BasePage = (props: PropsWithChildren<PageProps>) => {
  let { unprotected, showActionBar, topBar, autoBack, backPath } = props;
  showActionBar = false;

  const { historyStack } = useCustomHistory();
  const prevPathExists = historyStack.length > 1;

  const router = useRouter();

  // TODO: HAndle hardware back button using Capacitor.
  function handleBackClick() {
    if (!backPath && !autoBack) return;

    if (autoBack && prevPathExists) {
      // or use this?: customHistoryStack[customHistoryStack.length - 2]
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

      {topBar === "app-header" && (
        <AppHeader
          backButtonEnabled={(autoBack && prevPathExists) || !!backPath}
          onBackButtonPressed={handleBackClick}
        >
          {props.title}
        </AppHeader>
      )}

      {topBar === "navbar" && <Navbar />}

      <PageWrapper
        unprotected={unprotected}
        showingActionBar={showActionBar}
        showingTopBar={!!topBar}
        noPadding={props.noPadding}
        className={twMerge("flex-1", props.className)}
      >
        {props.children}
      </PageWrapper>

      {showActionBar && <ActionBar />}
    </div>
  );
};

function PageWrapper(
  props: PropsWithChildren<{
    className?: string;
    unprotected: boolean;
    showingActionBar: boolean;
    showingTopBar: boolean;
    noPadding?: boolean;
  }>,
) {
  const router = useRouter();
  const { status } = useSession();

  const paddingBottom = props.showingActionBar ? "pb-20" : "pb-4";
  const paddingTop = props.showingTopBar ? "pt-20" : "pt-4";

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
            !props.noPadding && "mx-auto px-4 sm:px-8 md:px-14 lg:px-14",
            !props.noPadding && paddingTop,
            !props.noPadding && paddingBottom,
            props.className,
          )}
        >
          {props.children}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
