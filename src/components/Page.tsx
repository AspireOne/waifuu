import { AnimatePresence, motion } from "framer-motion";
import React, { PropsWithChildren, useEffect } from "react";
import PageHead from "~/components/PageHead";
import { twMerge } from "tailwind-merge";
import SignInModal from "~/components/SignInModal";
import { BottomNavbar } from "~/components/BottomNavbar";
import Header, { HeaderProps } from "~/components/Header";
import useSession from "~/hooks/useSession";
import { useRouter } from "next/router";
import paths, { normalizePath } from "~/utils/paths";

function Page(
  props: PropsWithChildren<{
    className?: string;
    /** Will be shown in the browser title bar. */
    metaTitle: string;
    description?: string;
    /** Default: false */
    unprotected?: boolean;
    /** Default: false */
    showActionBar?: boolean;
    /** Default enabled: true */
    header?: HeaderProps & {
      enabled?: boolean;
    };
  }>,
) {
  const unprotected = props.unprotected ?? false;
  const showActionBar = props.showActionBar ?? false;
  const showHeader = props.header?.enabled ?? true;

  return (
    <div
      id={"_page-root-container"}
      key={"_page-root-container"}
      className={"min-h-screen max-h-screen"}
    >
      <PageHead title={props.metaTitle} description={props.description} />

      {/*TODO: PC Navbar.*/}

      {showHeader && <Header {...props.header}>{props.metaTitle}</Header>}

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
