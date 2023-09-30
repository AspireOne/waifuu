import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gmail.matejpesl1.companion",
  appName: "companion",
  webDir: "out", // Default Next.JS static build output dir.
  server: {
    //androidScheme: 'https',
    // The LAN URL of your web app (e.g. http://192.168.x.xx:3000)
    // On MAC: ipconfig getifaddr en0
    // On Windows: Run ipconfig in cmd and look for IPv4 Address of your network adapter.
    //url: 'http://192.168.137.1:3000'

    //hostname: 'companion-red.vercel.app',
    //url: 'https://companion-red.vercel.app',
    cleartext: true,
    allowNavigation: [
      "companion-red.vercel.app",
      "https://companion-red.vercel.app",
      "https://companion-red.vercel.app/*",
      "https://companion-red.vercel.app/api/",
      "https://companion-red.vercel.app/api/trpc",
      "https://companion-red.vercel.app/api/auth/callback/google",
      "companion-red.vercel.app/api/auth/callback/google",
    ],
  },

  plugins: {
    GoogleAuth: {
      // prettier-ignore
      clientId: "24288336305-mr8ndfp2t5n5bh5ukg2d94ni1qrgjbkd.apps.googleusercontent.com",
      // prettier-ignore
      serverClientId: "24288336305-mr8ndfp2t5n5bh5ukg2d94ni1qrgjbkd.apps.googleusercontent.com",
      // prettier-ignore
      iosClientId: "24288336305-2l0mt6bhbbjts6bb3q43a0lha63m6geb.apps.googleusercontent.com",
      // prettier-ignore
      androidClientId: "24288336305-floii6bqkrr34a6rin4rnh43in1vu8pl.apps.googleusercontent.com",
      scopes: ["profile", "email"],
      forceCodeForRefreshToken: true, // Might not be needed. Enabled because it "is used for serverside handling".
    },
    CapacitorCookies: {
      enabled: true,
      androidCustomSchemeAllowInsecureAccess: true,
    },
  },
};

export default config;
