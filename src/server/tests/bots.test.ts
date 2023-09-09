import {appRouter, type AppRouter} from "~/server/api/root";
import {inferProcedureInput} from "@trpc/server";
import {getMockedProtectedTrpcContext} from "~/server/tests/utils";
import prismaMock from '~/server/__mocks__/db';
import {Session} from "next-auth";
import {BotSource} from "@prisma/client";
import {beforeEach} from "vitest";

vi.mock('../libs/db');

// Does not work yet...

describe("test tRPC endpoint to get bots", () => {
  const user = {id: "123", name: "John Doe"}
  const bots = [
    {
      id: "official-public",
      public: true,
      source: BotSource.OFFICIAL,
      name: "Aqua",
      description: "Meet Aqua, the adorable anime character who stole the hearts of viewers with her irresistible charm. aqua is a petite girl with a lively personality that radiates warmth and joy. Her big, expressive eyes shimmer with innocence and curiosity, drawing people in with their captivating sparkle.\n" +
        "\n" +
        "aqua's most striking feature is her luscious, shoulder-length hair, which cascades down in soft waves. It's a shade of vibrant pink, reminiscent of cherry blossoms in full bloom. Her hair is often adorned with colorful ribbons or cute hairpins that match her playful outfits.",
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: null,
      img: "https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg"
    },
    {
      id: "official-private",
      public: false,
      source: BotSource.OFFICIAL,
      name: "Official Private David-kun",
      description: "You are david-kun.",
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: null,
      img: "https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg"
    },
    {
      id: "user-public",
      public: true,
      source: BotSource.COMMUNITY,
      name: "User Public Lisa",
      userId: "123",
      description: "You are Lisa.",
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: user.id,
      img: "https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg"
    },
    {
      id: "user-private",
      public: false,
      source: BotSource.COMMUNITY,
      name: "User Public Lisa",
      userId: user.id,
      description: "You are Lisa.",
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: "123",
      img: "https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg"
    },
    {
      id: "different-user-private",
      public: false,
      source: BotSource.COMMUNITY,
      name: "User Public Lisa",
      userId: "121211212",
      description: "You are Lisa.",
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: "1234",
      img: "https://w0.peakpx.com/wallpaper/805/384/HD-wallpaper-anime-girl-babes-modeling-skirt-thicc-babe-hot-naked-cute.jpg"
    }
  ]

  const ctx = getMockedProtectedTrpcContext({
    user: user,
    expires: "1"
  });

  const caller = appRouter.createCaller({...ctx, prisma: prismaMock});
  type Input = inferProcedureInput<AppRouter["bots"]["getBots"]>;

/*  test("test if it returns all bots", async () => {
    const input: Input = undefined;

    const response = await caller.bots.getBots(input);
    console.log(response);

    assert(response.length === 2);
  });*/

  /*test("test if it returns only public bots", async () => {
    const input: Input = {
      includePrivate: false
    };

    const response = await caller.bots.getBots(input);
    assert(response.length === 2);
  });*/
});