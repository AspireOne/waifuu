import {withSentryConfig} from "@sentry/nextjs";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

//import next_transpile_modules from "next-transpile-modules";

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    sentry: {
        // Disable auto instrumentation because it throws an error in trpc api handler export for some reason.
        // The API routes can be instrumented/wrapped manually.
        autoInstrumentServerFunctions: false,
    },
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
};

// '@ionic/react', '@ionic/core', '@stencil/core',
//const withTM = next_transpile_modules([]);

export default withSentryConfig(config, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

// Suppresses source map uploading logs during build
    silent: true,
    org: "companion-ns",
    project: "javascript-nextjs",
}, {
// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

// Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

// Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
// tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
    hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
});