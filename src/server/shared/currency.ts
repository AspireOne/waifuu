import { LocaleCode } from "@lib/i18n";
import { Currency } from "@prisma/client";

export type CurrencyData = {
  code: Currency;
  symbol: string;
};

export function getCurrencyData(locale: LocaleCode): CurrencyData {
  switch (locale) {
    case "cs":
      return {
        code: "CZK",
        symbol: "Kč",
      };
    case "en":
      return {
        code: "USD",
        symbol: "$",
      };
    default:
      throw new Error(`Tried to get currency for unsupported locale: ${locale}`);
  }
}
