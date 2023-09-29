import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { api } from "~/utils/api";
import React from "react";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "~/styles/globals.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { getBaseServerUrl } from "~/utils/constants";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session} baseUrl={getBaseServerUrl()}>
      <SkeletonTheme
        baseColor={"rgba(255, 255, 255, 0.06)"}
        highlightColor={"rgba(255, 255, 255, 0.5)"}
        borderRadius={"0.7rem"}
      >
        <NextUIProvider>
          {/*TODO: 'Dark' is currently hardcoded. Make the user be able to change the theme (just get user session and also save it to local storage for faster loading?)*/}
          <main className={"bg-background text-foreground dark"}>
            <ToastContainer />
            <Component {...pageProps} />
          </main>
        </NextUIProvider>
      </SkeletonTheme>
      <ToastContainer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
