import {createInnerTRPCContext} from "~/server/api/trpc";
import {appRouter, type AppRouter} from "~/server/api/root";
import {getMockedProtectedTrpcContext} from "~/server/tests/utils";

const add = (a: number, b: number) => a + b

describe("Basic functionality pre-test", () => {
  test("test the test framework basic functionality", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  test("test tRPC", async () => {
    const ctx = createInnerTRPCContext({session: null});
    const caller = appRouter.createCaller(ctx);

    const response = await caller.general.health();
    expect(response).toMatchObject("ok");
  });

  test("test protected tRPC", async () => {
    const ctx = getMockedProtectedTrpcContext();
    const caller = appRouter.createCaller(ctx);

    const response = await caller.general.protectedHealth();
    expect(response).toMatchObject("ok");
  });
});