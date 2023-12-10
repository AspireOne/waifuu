import { TRPCError } from "@/server/lib/TRPCError";

/**
 * Verifies the request by checking the authentication time and CSRF tokens.
 *
 * @param {number} authTime - The authentication time in seconds.
 * @param {string} [inputCsrf] - The input CSRF token.
 * @param {string} [cookieCsrf] - The cookie CSRF token.
 * @throws {TRPCError} When the authentication time is not recent or the CSRF tokens do not match.
 */
export async function verifyRequest(
  authTime: number,
  inputCsrf?: string | null,
  cookieCsrf?: string | null,
) {
  // Check if the user signed in recently.
  if (authTime < new Date().getTime() / 1000 - 5 * 60) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Sign in must be recent.",
    });
  }

  if (inputCsrf && cookieCsrf && inputCsrf !== cookieCsrf) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "CSRF token mismatch.",
    });
  }
}
