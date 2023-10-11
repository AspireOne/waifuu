import { AnimatePresence, motion } from "framer-motion";
import React, { PropsWithChildren, useEffect } from "react";
import PageHead from "~/components/PageHead";
import { twMerge } from "tailwind-merge";
import SignInModal from "~/components/SignInModal";
import { BottomNavbar } from "~/components/BottomNavbar";
import useSession from "~/hooks/useSession";
import { useRouter } from "next/router";
import paths, { normalizePath } from "~/utils/paths";
import Header from "~/components/Header";

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

    /** Null for no back button, "previous" for the last opened page, and string for a certain path. Default: "previous" */
    back?: null | string | "previous";
    /** Triggered when the back button is clicked. Can be used for cleanups. */
    onBack?: () => void;
  }>,
) {
  // Set default values for props.
  const unprotected = props.unprotected ?? false;
  const showActionBar = props.showActionBar ?? false;
  const showHeader = props.showHeader ?? true;
  const back = props.back === undefined ? "previous" : props.back;

  const router = useRouter();

  function handleBackClick() {
    if (back === null) return;
    else if (back === "previous") router.back();
    else {
      router.push(back);
      // TODO: Remove the last path from history to not confuse mobile app back button (/swipe)?
    }

    if (props.onBack) props.onBack();
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
        <Header
          backButtonEnabled={!!back}
          onBackButtonPressed={handleBackClick}
        >
          {props.title}
        </Header>
      )}

      <PageWrapper
        unprotected={unprotected}
        showingBottomNav={showActionBar}
        showingHeader={showHeader}
        className={twMerge("flex-1", props.className)}
      >
        {props.children}
      </PageWrapper>

      {showActionBar && <BottomNavbar />}
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
  const { user, status } = useSession();

  const paddingBottom = props.showingBottomNav ? "pb-20" : "pb-4";
  const paddingTop = props.showingHeader ? "pt-20" : "pt-4";

  if (!props.unprotected && status === "unauthenticated") {
    const currPath = normalizePath(router.pathname);
    router.push(paths.login(currPath));
  }

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
