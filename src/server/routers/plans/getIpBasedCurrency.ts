import { publicProcedure } from "@/server/lib/trpc";

import { env } from "@/server/env";
import { TRPCError } from "@/server/lib/TRPCError";
import { currencyHelpers } from "@/server/shared/currency";
import axios from "axios";

import { z } from "zod";

type IpInfoResponse = {
  ip: string;
  hostname: string;
  city: string;
  region: string;
  country: string; // two-letter country code.
  loc: string; // lat,lng.
  org: string;
  postal: string;
  timezone: string;
};

// Gets Currency based on user's IP.
export default publicProcedure
  .output(
    z.object({
      currency: z.string(),
    }),
  )
  .query(async ({ ctx }) => {
    const ip = ctx.req?.socket.remoteAddress;
    if (!ip)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not get request IP address.",
        toast: null,
      });

    const dbData = await ctx.prisma.ipInfo.findUnique({
      where: {
        ip: ip,
      },
      select: {
        country: true,
      },
    });

    let country = dbData?.country;

    if (!country) {
      const data = await fetchDataOrThrow(ip === "::1" ? "" : ip); // when localhost, do not specify ip.
      // TODO(1): Save it AFTER the response is sent.
      await ctx.prisma.ipInfo.create({
        data: {
          ip: ip,
          country: data.country,
          city: data.city,
          loc: data.loc,
          region: data.region,
          timezone: data.timezone,
        },
      });
      country = data.country;
    }

    return {
      currency: currencyHelpers.byCountry(country)?.code || currencyHelpers.byCode("USD").code,
    };
  });

async function fetchDataOrThrow(ip: string) {
  let data: IpInfoResponse;

  try {
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${env.IPINFO_TOKEN}`);
    data = response.data as IpInfoResponse;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Could not get IP info. IP: ${ip} | Error: ${error}`,
      toast: null,
    });
  }

  if (!data.country) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Geo API response object did not contain country. IP: ${ip} | Response: ${JSON.stringify(
        data,
      )}`,
      toast: null,
    });
  }

  return data;
}
