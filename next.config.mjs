/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import next_transpile_modules from "next-transpile-modules";
import {Capacitor} from "@capacitor/core";

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    async headers() {
        return [{
            // matching all API routes
            source: "/api/:path*",
            headers: [{key: "Access-Control-Allow-Credentials", value: "true"}, {
                key: "Access-Control-Allow-Origin",
                value: "http://localhost"
            }, {key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT"}, {
                key: "Access-Control-Allow-Headers",
                value: "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, authorization, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
            },]
        }]
    },

    images: {
        // Capacitor needs static export/build -> that doesn't support optimized images -> disable it so that Capacitor works.
        // TODO: Flip this back.
        unoptimized: true,
    },

/*    // !TODO: Remove this!!!
    webpack(webpackConfig) {
        return {
            ...webpackConfig,
            optimization: {
                minimize: false
            }
        };
    }*/

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

// '@ionic/react', '@ionic/core', '@stencil/core',
const withTM = next_transpile_modules([]);

export default withTM(config);