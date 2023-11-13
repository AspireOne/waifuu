import { TRPCLink, httpLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { getIdToken } from "@/lib/firebase";
import { type AppRouter } from "@/server/routers/root";
import { Capacitor } from "@capacitor/core";

import { getLocale } from "@lib/i18n";
import { baseApiUrl } from "@lib/paths";
import { t } from "@lingui/macro";
import { observable } from "@trpc/server/observable";
import { toast } from "react-toastify";

export const customErrorLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      return next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          // This already logs the error to the console.
          observer.error(err);

          // Don't show error to user if they are not logged in.
          if (
            err?.data?.code === "UNAUTHORIZED" ||
            // Can be thrown from Firebase.
            err?.message === "No user is signed in."
          ) {
            return;
          }

          // Show error message to user only if it's a zod error.
          // Otherwise show just "Something went wrong".

          const errorMsg =
            err?.data?.code === "PARSE_ERROR" ? err.message : t`Something went wrong`;

          toast(errorMsg, { type: "error" });
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
          url: baseApiUrl("/trpc"),
          async fetch(url, options) {
            const idToken = await getIdToken();
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
 * Inference helper for inputs.
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
