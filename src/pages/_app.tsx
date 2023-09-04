import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {type AppType} from "next/app";
import {NextUIProvider} from "@nextui-org/react";
import {api} from "~/utils/api";
import "~/styles/globals.css";
import React from "react";
import {ToastContainer} from "react-toastify";

const MyApp: AppType<{ session: Session | null }> = ({Component, pageProps: {session, ...pageProps}}) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
      <ToastContainer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
