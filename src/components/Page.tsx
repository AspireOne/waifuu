import { AnimatePresence, motion } from "framer-motion";
import React, { PropsWithChildren, useEffect } from "react";
import PageHead from "~/components/PageHead";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import SignInModal from "~/components/SignInModal";

// Your existing Page component
let hasPrev = false;

function Page(
  props: PropsWithChildren<{
    className?: string;
    metaTitle: string;
    metaDesc?: string;
    protected?: boolean;
  }>,
) {
  const { data: session, status } = useSession();

  useEffect(() => {
    hasPrev = true;
  }, [props.children]);

  return (
    <div>
      <PageHead title={props.metaTitle} description={props.metaDesc} />
      {/*TODO: Navbar / sidebar*/}
      {/*<Navbar/>*/}

      <AnimatePresence>
        <motion.section
          initial={{ y: hasPrev ? -5 : 0, opacity: 1 }}
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
              "relative mx-auto min-h-[70vh] max-w-[1500px] p-4 px-4 pt-4 sm:px-8 md:px-14 lg:px-14",
              props.className,
            )}
          >
            {props.protected && status === "unauthenticated" && <SignInModal />}
            {props.children}
          </div>
        </motion.section>
      </AnimatePresence>

      {/*TODO: Footer*/}
      {/*<Footer/>*/}
    </div>
  );
}

export default Page;
