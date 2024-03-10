import { IPThrottler } from "@/server/lib/IPThrottler";
import RateLimiterClass from "@/server/lib/RateLimiterClass";
import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import Langfuse from "langfuse";
import PusherServer from "pusher";
import Replicate from "replicate";
import Stripe from "stripe";

// Values are currently defined in src/server/clients. Might change.
export type Global = {
  prisma?: PrismaClient;
  pusher?: {
    instance: PusherServer;
    appId: string;
    key: string;
    secret: string;
    host: string;
    port?: string;
  };
  ioredis?: Redis;
  ipThrottler?: IPThrottler;
  rateLimiter?: RateLimiterClass;
  replicate?: Replicate;
  s3Client?: S3Client;
  stripe?: Stripe;
  langfuse?: Langfuse;
  nonces?: string[];
};

/** Wraps globalThis and extends it with additional types. Used for storing global variables. */
export const global = globalThis as Global;
