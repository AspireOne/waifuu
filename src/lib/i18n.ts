import { i18n } from "@lingui/core";

export type LocaleCode = "en" | "cs";

type Locales = {
  [key in LocaleCode]: string;
};

export const locales: Locales = {
  en: "English",
  cs: "Arabic",
};

export async function dynamicActivate(locale?: LocaleCode) {
  const { messages } = await import(`./locales/${locale}.po`);

  locale ??= "en";

  i18n.load(locale, messages);
  i18n.activate(locale);
}
