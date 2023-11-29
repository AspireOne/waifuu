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
    let ip = ctx.req?.headers["x-forwarded-for"] || ctx.req?.socket?.remoteAddress;
    // 'x-forwarded-for' can return a list of IPs. The client's IP is the first one.
    if (Array.isArray(ip)) ip = ip[0];
    else if (typeof ip === "string") ip = ip.split(",")[0];

    // prefixes:
    // "::ffff:" = IPv4 to IPv6 conversion.
    // "::1" = localhost.
    // "::" = IPv6.
    // we keep it when saving to DB, but remove it when passing it to geo api.

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
      const _preparedIp = ip.replace("::ffff:", "").replace("::1", "").replace("::", "");
      const data = await fetchDataOrThrow(_preparedIp); // when localhost, do not specify ip.
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
