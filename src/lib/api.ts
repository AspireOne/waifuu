import { TRPCLink, httpLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { getIdToken } from "@/lib/firebase";
import { type AppRouter } from "@/server/routers/root";
import { Capacitor } from "@capacitor/core";

import { ClientTRPCError } from "@/server/lib/trpc";
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

          // Convert the received bag of shit to the a actual error object crafted at the backend.
          // biome-ignore format:
          const error = (err.meta?.responseJSON as any)?.error?.json as ClientTRPCError | undefined;

          if (!error) {
            // TODO: Sentry.
            console.warn("Received error, but error object is undefined.");
            return;
          }

          if (!error.data) {
            // TODO: Sentry.
            console.error("Received error, but error.data is undefined.");
            return;
          }

          // Don't show error to user if they are not logged in.
          if (
            error.data.code === "UNAUTHORIZED" ||
            // Can be thrown from Firebase.
            error.message === "No user is signed in."
          ) {
            return;
          }

          let msg: string;

          if (error.toast) msg = error.toast;
          else if (error.data.code === "PARSE_ERROR") msg = error.message;
          else msg = t`Something went wrong`;

          // Make the first letter uppercase and remove period from the end, if any.
          const formattedMsg = msg.charAt(0).toUpperCase() + msg.slice(1).replace(/\.$/, "");
          toast(formattedMsg, { type: error.toastType ?? "error" });
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
