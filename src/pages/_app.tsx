import { api } from "@/lib/api";
import { NextUIProvider } from "@nextui-org/react";
import { type AppType } from "next/app";
import { useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";

import "@/styles/globals.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";

import { SessionProvider } from "@/providers/SessionProvider";
import { getOrInitFirebaseApp, getOrInitFirebaseAuth } from "@lib/firebase";
import { initGlobalLocale } from "@lib/i18n";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { MountPersistenceProvider } from "@providers/MountPersistenceProvider";
import { PersistedScrollPositionProvider } from "@providers/PersistedScrollPositionProvider";
import { getAnalytics } from "firebase/analytics";

initGlobalLocale();

// biome-ignore lint: I keep it here so that I do not forget it exists.
const MyApp: AppType<{}> = ({ Component, pageProps: { ...pageProps } }) => {
  // Initialize app.
  useEffect(() => {
    async function init() {
      // Initialize firebase.
      const app = getOrInitFirebaseApp();
      const auth = getOrInitFirebaseAuth();
      const analytics = getAnalytics(app);
    }

    init();
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
              <PersistedScrollPositionProvider>
                <MountPersistenceProvider>
                  <main className={"bg-background text-foreground dark"}>
                    <div className="font-inter">
                      <ToastContainer
                        autoClose={4000}
                        limit={4}
                        newestOnTop={true}
                        theme={"dark"}
                      />
                      <Component {...pageProps} />
                    </div>
                  </main>
                </MountPersistenceProvider>
              </PersistedScrollPositionProvider>
            </SessionProvider>
          </I18nProvider>
        </NextUIProvider>
      </SkeletonTheme>
    </>
  );
};

export default api.withTRPC(MyApp);
