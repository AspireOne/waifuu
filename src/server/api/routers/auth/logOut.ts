import { protectedProcedure } from "@/server/api/trpc";

export default protectedProcedure.mutation(async ({ ctx }) => {
  // Remove the session cookie.
  ctx.res?.setHeader(
    "Set-Cookie",
    `session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
  );
  return undefined;
});
