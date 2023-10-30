import { httpBatchLink, httpLink, loggerLink, TRPCLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "@/server/routers/root";
import { Capacitor } from "@capacitor/core";
import { getIdToken } from "@/lib/firebase";
import { Constants } from "@/lib/constants";
import { observable } from "@trpc/server/observable";
import { toast } from "react-toastify";
import generateUUID, { generateID, showErrorToast } from "@lib/utils";
import { Preferences } from "@capacitor/preferences";
import { getLocale } from "@lib/i18n";
import { getAuth } from "firebase/auth";

export const customErrorLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      return next(op).subscribe({
        next(value) {
          //console.log("we received value", value);
          observer.next(value);
        },
        error(err) {
          // This already logs the error to the console.
          observer.error(err);

          // Don't show error to user if they are not logged in.
          if (
            err?.data?.code === "UNAUTHORIZED" ||
            // Firebase error thrown from backend. Kind of the same as unauthorized, but with a different message.
            err?.message === "No user is signed in."
          ) {
            return;
          }

          showErrorToast(err);
        },
        complete() {
          observer.complete();
        },
      });
    });
  };
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          // Disable most refetching because I deem it useless and wasteful.
          queries: {
            retry: 3,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            refetchOnReconnect: true,
            refetchOnMount: true,
          },
        },
      },
      /**
       * Transformer used for data de-serialization from the server.
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       * @see https://trpc.io/docs/links
       */
      links: [
        customErrorLink,
        loggerLink({
          enabled: (opts) => {
            return (
              process.env.NODE_ENV === "development" ||
              (opts.direction === "down" && opts.result instanceof Error)
            );
          },
        }),
        httpLink({
          url: apiBase("/api/trpc"),
          async fetch(url, options) {
            let idToken = await getIdToken();
            const locale = getLocale();

            return fetch(url, {
              ...options,
              // 'include' is required for cookies to be sent to the server.
              credentials: Capacitor.isNativePlatform() ? "include" : undefined,
              headers: {
                ...options?.headers,
                Authorization: idToken ? `Bearer ${idToken}` : "",
                locale: locale,
              },
            });
          },
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Adds base API path in front of the given path.
 * @param path Path to append to base URL, e.g. "/api/bots"
 * @returns {string} The full API URL
 *
 * @example Constants.apiBase("/api/bots") // "https://companion-red.vercel.app/api/bots"
 * @example Constants.apiBase() // "https://companion-red.vercel.app/api"
 **/
export const apiBase = (path?: string): string => {
  const base = getBaseServerUrl() + "/api";
  if (!path) return base;

  if (path.startsWith("/api")) path = path.slice(4);
  if (path.startsWith("api")) path = path.slice(3);
  if (!path.startsWith("/")) path = "/" + path;

  return base + path;
};

const getBaseServerUrl = () => {
  // Mobile = use the hosted prod server instead of localhost.
  if (Capacitor.isNativePlatform()) {
    return Constants.SERVER_URL;
  }

  // Browser = relative URL.
  if (typeof window !== "undefined") return "";

  // Web Server - Production. (Can oly be web server - android/ios don't have backend and browser always has window).
  if (process.env.NODE_ENV === "production") {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return Constants.SERVER_URL;
  }
  // Web Server - Development.
  return `http://localhost:${process.env.PORT ?? 3000}`; // Dev SSR should use localhost.
};

/**
 * Inference helper for inputs.
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
