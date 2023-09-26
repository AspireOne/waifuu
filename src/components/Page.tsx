import { AnimatePresence, motion } from "framer-motion";
import React, { PropsWithChildren, useEffect } from "react";
import PageHead from "~/components/PageHead";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import SignInModal from "~/components/SignInModal";
import { BottomNavbar } from "~/components/BottomNavbar";
import Header, { HeaderProps } from "~/components/Header";

function Page(
  props: PropsWithChildren<{
    className?: string;
    metaTitle: string;
    description?: string;
    unprotected?: boolean;
    showMobileNav?: boolean;
    header?: HeaderProps & {
      enabled?: boolean;
    };
  }>,
) {
  const unprotected = props.unprotected ?? false;
  const showBottomNav = props.showMobileNav ?? false;
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
        showingBottomNav={showBottomNav}
        showingHeader={showHeader}
        className={twMerge("flex-1", props.className)}
      >
        {props.children}
      </PageWrapper>

      {showBottomNav && <BottomNavbar />}
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
  const { data: session, status } = useSession();

  const paddingBottom = props.showingBottomNav ? "pb-20" : "pb-4";
  const paddingTop = props.showingHeader ? "pt-20" : "pt-4";

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
          {!props.unprotected && status === "unauthenticated" && (
            <SignInModal />
          )}
          {props.children}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}

export default Page;
