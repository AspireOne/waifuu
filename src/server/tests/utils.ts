import { createInnerTRPCContext } from "~/server/api/trpc";
import { Session } from "next-auth";

export function getMockedProtectedTrpcContext(session?: Session) {
  return createInnerTRPCContext({
    session: session ?? {
      user: { id: "123", name: "John Doe", image: "/assets/default_user.jpg" },
      expires: "1",
    },
  });
}

export function getMockedTrpcContext() {
  return createInnerTRPCContext({ session: null });
}
