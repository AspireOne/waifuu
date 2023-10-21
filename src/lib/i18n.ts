import { i18n } from "@lingui/core";

export type LocaleCode = "en" | "cs";

type Locales = {
  [key in LocaleCode]: string;
};

export const locales: Locales = {
  en: "English",
  cs: "Czech",
};

export async function dynamicActivate(locale: LocaleCode = "en") {
  const { messages } = await import(`../locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
