import { CurrencyData, currencyHelpers } from "@/server/shared/currency";
import { api } from "@lib/api";
import { getMostSuitableLocale } from "@lib/i18n";
import { Currency } from "@prisma/client";
import { useEffect, useState } from "react";

export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>();
  const [data, setData] = useState<CurrencyData>();
  const ipCurrency = api.plans.getIpBasedCurrency.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchInterval: false,
    refetchOnMount: false,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (ipCurrency.status === "success") {
      setCurrency(ipCurrency.data.currency as Currency);
    } else if (ipCurrency.status === "error") {
      getMostSuitableLocale().then((locale) => {
        const currency = currencyHelpers.byLocale(locale);
        if (currency) setCurrency(currency.code);
      });
    }
  }, [ipCurrency.status]);

  useEffect(() => {
    setData(!currency ? undefined : currencyHelpers.byCode(currency));
  }, [currency]);

  return { ...data, setCurrency };
};
