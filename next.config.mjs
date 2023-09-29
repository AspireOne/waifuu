/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,

    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {key: "Access-Control-Allow-Credentials", value: "true"},
                    {key: "Access-Control-Allow-Origin", value: "*"},
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value:
                            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            }
        ];
    },

    redirects: process.env.NATIVE ? async () => {
        return [
            {
                source: '/api/:path*',
                destination: `https://companion-red.vercel.app/api/:path*`, // TODO: Change this to a new domain.
                permanent: true
            },
        ]
    } : undefined,

    images: {
        // Capacitor needs static export/build -> that doesn't support optimized images -> disable it so that Capacitor works.
        unoptimized: true,
    },
    /**
     * If you are using `appDir` then you must comment the below `i18n` config out.
     *
     * @see https://github.com/vercel/next.js/issues/41980
     */
    /*i18n: {
      locales: ["en"],
      defaultLocale: "en",
    },*/
};

export default config;
