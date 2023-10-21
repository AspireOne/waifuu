import { type AppType } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { api } from "@/lib/api";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "@/styles/globals.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { getAnalytics } from "firebase/analytics";
import { getOrInitFirebaseAuth } from "@/lib/firebase/getOrInitFirebaseAuth";
import { getOrInitFirebaseApp } from "@/lib/firebase/getOrInitFirebaseApp";
import { SessionProvider } from "@/contexts/SessionProvider";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { dynamicActivate } from "@lib/i18n";
import { T } from "@lib/T";

const MyApp: AppType<{}> = ({ Component, pageProps: { ...pageProps } }) => {
  // Initialize firebase.
  useEffect(() => {
    async function init() {
      // Initialize firebase.
      const app = getOrInitFirebaseApp();
      const auth = getOrInitFirebaseAuth();
      const analytics = getAnalytics(app);
    }

    init();
  }, []);

  useEffect(() => {
    dynamicActivate();
  }, []);

  return (
    <>
      <SkeletonTheme
        baseColor={"rgba(255, 255, 255, 0.06)"}
        highlightColor={"rgba(255, 255, 255, 0.5)"}
        borderRadius={"0.7rem"}
      >
        <NextUIProvider>
          <I18nProvider i18n={i18n}>
            <SessionProvider>
              {/*TODO: 'Dark' is currently hardcoded. Make the user be able to change the theme (just get user session and also save it to local storage for faster loading?)*/}
              <main className={"bg-background text-foreground dark"}>
                <ToastContainer theme={"dark"} />
                <Component {...pageProps} />
              </main>
            </SessionProvider>
          </I18nProvider>
        </NextUIProvider>
      </SkeletonTheme>
    </>
  );
};

export default api.withTRPC(MyApp);
