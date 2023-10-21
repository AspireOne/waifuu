import { i18n } from "@lingui/core";
import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { Preferences } from "@capacitor/preferences";

export type LocaleCode = "en" | "cs";
const defaultLoc: LocaleCode = "en";

type Locales = {
  code: LocaleCode;
  label: string;
}[];

export const locales: Locales = [
  { code: "en", label: "English" },
  { code: "cs", label: "Čeština" },
];

export function getLocale() {
  return i18n.locale;
}

export async function changeAndSaveGlobalLocale(locale: LocaleCode) {
  if (!isLocaleSupported(locale)) {
    throw new Error(`Locale ${locale} is not supported.`);
  }

  await setI18nLocale(locale);
  if (locale === defaultLoc) {
    await Preferences.remove({ key: "locale" });
  } else {
    await Preferences.set({ key: "locale", value: locale });
  }
}

export async function initGlobalLocale() {
  const locale = await getMostSuitableLocale();
  await setI18nLocale(locale);
}

async function setI18nLocale(locale: LocaleCode) {
  const { messages } = await import(`../locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
  // Set html lang attribute.
  document.documentElement.lang = locale;
}

async function getMostSuitableLocale(): Promise<LocaleCode> {
  const { value: localeFromStorage } = await Preferences.get({
    key: "locale",
  });
  if (localeFromStorage && isLocaleSupported(localeFromStorage))
    return localeFromStorage as LocaleCode;

  if (Capacitor.isNativePlatform()) {
    const { value } = await Device.getLanguageCode();
    if (isLocaleSupported(value)) return value as LocaleCode;
  } else {
    for (let i = 0; i < navigator.languages.length; i++) {
      const lang = navigator.languages[i]!;
      if (isLocaleSupported(lang)) return lang as LocaleCode;
    }
  }

  return defaultLoc;
}

function isLocaleSupported(locale: string) {
  return locales.some((l) => l.code === locale);
}
