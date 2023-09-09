import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SkeletonTheme } from "react-loading-skeleton";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <SkeletonTheme
          baseColor={"rgba(255, 255, 255, 0.05)"}
          highlightColor={"rgba(255, 255, 255, 0.4)"}
        >
          <ToastContainer />
          <Component {...pageProps} />
        </SkeletonTheme>
      </NextUIProvider>
      <ToastContainer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
