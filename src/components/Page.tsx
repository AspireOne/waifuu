import { AnimatePresence, motion } from "framer-motion";
import React, { PropsWithChildren, useEffect } from "react";
import PageHead from "~/components/PageHead";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import SignInModal from "~/components/SignInModal";
import { BottomNavbar } from "~/components/BottomNavbar";

// Your existing Page component
let hasPrev = false;

function Page(
  props: PropsWithChildren<{
    className?: string;
    metaTitle: string;
    metaDesc?: string;
    unprotected?: boolean;
    showNav?: boolean;
  }>,
) {
  useEffect(() => {
    hasPrev = true;
  }, [props.children]);

  const showBottomNav = props.showNav ?? false;

  return (
    <div id={"_page-root-container"} key={"_page-root-container"}>
      <PageHead title={props.metaTitle} description={props.metaDesc} />

      {/*TODO: Upper navbar for PC.*/}

      <div className={"min-h-screen max-h-screen"}>
        <PageWrapper
          unprotected={props.unprotected ?? false}
          showingBottomNav={showBottomNav}
          className={twMerge(props.className)}
        >
          {props.children}
        </PageWrapper>

        {showBottomNav && <BottomNavbar />}
      </div>
    </div>
  );
}

function PageWrapper(
  props: PropsWithChildren<{
    className?: string;
    unprotected: boolean;
    showingBottomNav: boolean;
  }>,
) {
  const { data: session, status } = useSession();

  const paddingBottom = props.showingBottomNav ? "pb-20" : "pb-4";

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
            "mx-auto max-w-[1500px] px-4 pt-4 sm:px-8 md:px-14 lg:px-14",
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
