import { Currency } from "@prisma/client";

export type CurrencyData = {
  code: Currency;
  symbol: string;
  countries: string[];
  locales: string[];
};

export type CurrencyToLocale = {
  [K in Currency]: string[];
};

export const currencyData: CurrencyData[] = [
  {
    code: "USD",
    symbol: "$",
    countries: ["US", "EC", "SV", "BZ", "PW"],
    locales: ["en", "es"],
  },
  {
    code: "CZK",
    symbol: "Kč",
    countries: ["CZ"],
    locales: ["cs"],
  },
  {
    code: "EUR",
    symbol: "€",
    // prettier-ignore format: off
    countries: [
      "SK",
      "SI",
      "EE",
      "LT",
      "LV",
      "FI",
      "BE",
      "NL",
      "LU",
      "IE",
      "MT",
      "CY",
      "FR",
      "DE",
      "AT",
      "ES",
      "PT",
      "IT",
      "GR",
    ],
    // prettier-ignore format: off
    locales: ["sk", "sl", "et", "lt", "lv", "fi", "nl", "fr", "de", "es", "pt", "it", "el"],
  },
];

export const currencyHelpers = {
  byCode: (code: Currency) => currencyData.find((c) => c.code === code)!,
  byCountry: (country: string) => currencyData.find((c) => c.countries.includes(country)),
  byLocale: (locale: string) => currencyData.find((c) => c.locales.includes(locale)),
};
