import { getCurrencyData } from "@/server/shared/currency";
import { LocaleCode } from "@lib/i18n";
import { i18n } from "@lingui/core";
import { useEffect, useState } from "react";

export const useCurrency = () => {
  const [data, setData] = useState(getCurrencyData(i18n.locale as LocaleCode));

  useEffect(() => {
    setData(getCurrencyData(i18n.locale as LocaleCode));
  }, [i18n, i18n.locale]);

  return { ...data };
};
