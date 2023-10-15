/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "~/server/api/root";
import { Capacitor } from "@capacitor/core";
import { apiBase } from "~/utils/constants";
import { Preferences } from "@capacitor/preferences";

export const globalForIdToken = globalThis as unknown as {
  idToken: string | null | undefined;
};

async function retrieveIdTokenOrNull() {
  try {
    const { value } = await Preferences.get({ key: "idToken" });
    return value;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClientConfig: {
        defaultOptions: {
          // Disable most refetching because I deem it useless and wasteful.
          queries: {
            // These are in-line with the defaults.
            retry: 3,
            refetchInterval: false,
            refetchIntervalInBackground: false,
            refetchOnReconnect: true,
            refetchOnMount: true,

            //refetchOnWindowFocus: false,
          },
        },
      },
      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: apiBase("/api/trpc"),
          async fetch(url, options) {
            let idToken = globalForIdToken.idToken;
            // keep the comparison like this, because it differentiates between null and undefined.
            if (idToken === undefined) {
              idToken = await retrieveIdTokenOrNull();
              globalForIdToken.idToken = idToken;
            }

            return fetch(url, {
              ...options,
              // 'include' is required for cookies to be sent to the server.
              credentials: Capacitor.isNativePlatform() ? "include" : undefined,
              // Add authorization bearer token from Preferences.get("idToken").
              headers: {
                ...options?.headers,
                Authorization: idToken ? `Bearer ${idToken}` : "",
              },
            });
          },
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
