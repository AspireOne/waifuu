import { TRPCLink, httpLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { getIdToken } from "@/lib/firebase";
import { type AppRouter } from "@/server/routers/root";
import { Capacitor } from "@capacitor/core";

import { ClientTRPCError } from "@/server/lib/trpc";
import { getCurrentLocale } from "@lib/i18n";
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

          // Get the custom data we sent from the server.
          const trpcErrData = (err.meta?.responseJSON as any)?.error?.json as
            | ClientTRPCError
            | undefined;

          // biome-ignore format: more readable.
          const isUnsignedError = err.data?.code === "UNAUTHORIZED" || err.message === "No user is signed in.";
          const isZodError = err.data?.code === "PARSE_ERROR";
          const isTRPCError = !!trpcErrData && !!trpcErrData.data;

          //console.log({ isUnsignedError, isZodError, isTRPCError });

          let toastMsg = t`Something went wrong`;
          // Don't show unsigned error.
          if (isUnsignedError) return;
          if (isZodError) return toast(err.message, { type: "error" });
          if (!isTRPCError) return toast(toastMsg, { type: "error" });

          // Do not shown toast if toast === null.
          if (trpcErrData.toast === null) return;

          if (trpcErrData.toast) toastMsg = trpcErrData.toast;

          // Make the first letter uppercase and remove period from the end, if any.
          const formattedMsg =
            toastMsg.charAt(0).toUpperCase() + toastMsg.slice(1).replace(/\.$/, "");

          toast(formattedMsg, { type: trpcErrData.toastType ?? "error" });
          console.log("Server response error toast: ", formattedMsg);
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
            const locale = getCurrentLocale();

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
