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
      const data = await fetchData(ip === "::1" ? "" : ip); // when localhost, do not specify ip.
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

async function fetchData(ip: string) {
  const response = await axios.get(`https://ipinfo.io/${ip}?token=${env.IPINFO_TOKEN}`);
  const data = response.data as IpInfoResponse;

  if (!data.country) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Geo API response object did not contain country.",
      toast: null,
    });
  }

  return data;
}
