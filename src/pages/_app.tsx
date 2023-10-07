import { type AppType } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { api } from "~/utils/api";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "~/styles/globals.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Capacitor } from "@capacitor/core";

import { getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "~/lib/firebaseConfig";
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";

const MyApp: AppType<{
  /*session: Session | null*/
}> = ({ Component, pageProps: { /*session,*/ ...pageProps } }) => {
  // Initialize firebase.
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    let auth;
    if (Capacitor.isNativePlatform()) {
      auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
      });
    } else {
      auth = getAuth();
    }
  }, []);

  return (
    <>
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
    </>
  );
};

export default api.withTRPC(MyApp);
