import Image from "next/image";
import React from "react";
import Page from "~/components/Page";
import { Capacitor } from "@capacitor/core";
import Home from "~/pages/home";
import { useRouter } from "next/router";
import paths from "~/utils/paths";

// If building for a native app, we don't want to show the landing page as the index screen.
// So if we are building for a native app, we export Homepage instead.

// prettier-ignore
export default process.env.NEXT_PUBLIC_BUILDING_NATIVE ? Home : function LandingPage() {
  const router = useRouter();
  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // replace current path with /home without reloading and without adding a new entry to the history.
      window.history.replaceState(null, document.title, paths.home);
    }
  }, []);

  // Todo: meta description.
  return (
    <Page
      metaTitle={"Companion"}
      unprotected
      header={{enabled: false}}
      showActionBar={false}
    >
      <div className="z-10">
        <Image
          src="/assets/default_landing.png"
          width={1920}
          height={1080}
          className="w-full absolute top-0 z-[0] left-0 h-3/6 opacity-20 object-cover"
          alt="Landing page image"
        />
        <div
          className={
            "absolute left-0 right-0 top-0 z-[0] h-3/6 bg-gradient-to-b to-black from-transparent"
          }
        />
      </div>

      <div className="z-20 relative text-center p-1">
        <div>
          <h1 className="text-4xl text-white font-bold">
            Come chat with your favourite characters
          </h1>

          <ul className="mt-5 text-left text-white">
            <li>
              😇 <b>Real feeling</b> - Characters have emotions and will respond
              acordingly to what you say
            </li>
            <li>
              📚 <b>Diversity</b> - Go on adventure, roleplay or simply chat
              with characters
            </li>
            <li>
              🧠 <b>Memory</b> - Characters remember you and will not forget
              things you tell them
            </li>
          </ul>
        </div>
      </div>
    </Page>
  );
}
