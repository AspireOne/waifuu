import { IPThrottler } from "@/server/lib/IPThrottler";
import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { IMailgunClient } from "mailgun.js/Interfaces";
import PusherServer from "pusher";
import Replicate from "replicate";
import Stripe from "stripe";

// Values are currently defined in src/server/clients. Might change.
export type Global = {
  prisma?: PrismaClient;
  pusher?: PusherServer;
  emailClient?: IMailgunClient;
  ioredis?: Redis;
  ipThrottler?: IPThrottler;
  replicate?: Replicate;
  s3Client?: S3Client;
  stripe?: Stripe;
};

/** Wraps globalThis and extends it with additional types. Used for storing global variables. */
export const global = globalThis as Global;
