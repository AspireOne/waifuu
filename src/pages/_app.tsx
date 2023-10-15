import { type AppType } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { api, globalForIdToken } from "~/utils/api";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "filepond/dist/filepond.min.css";
import "~/styles/globals.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "~/lib/firebaseConfig";
import getOrInitFirebaseAuth from "~/lib/getFirebaseAuth";
import { Preferences } from "@capacitor/preferences";

const MyApp: AppType<{}> = ({ Component, pageProps: { ...pageProps } }) => {
  // Initialize firebase.
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    async function init() {
      let auth = await getOrInitFirebaseAuth();
      if (!auth) return;

      auth.onIdTokenChanged(async (user) => {
        // We could also delete the idToken when the user is null, but we dont want to do that.
        if (user) {
          const idToken = await user.getIdToken();
          globalForIdToken.idToken = idToken;
          await Preferences.set({ key: "idToken", value: idToken });
        }
      });
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
          {/*TODO: 'Dark' is currently hardcoded. Make the user be able to change the theme (just get user session and also save it to local storage for faster loading?)*/}
          <main className={"bg-background text-foreground dark"}>
            <ToastContainer theme={"dark"} />
            <Component {...pageProps} />
          </main>
        </NextUIProvider>
      </SkeletonTheme>
    </>
  );
};

export default api.withTRPC(MyApp);
