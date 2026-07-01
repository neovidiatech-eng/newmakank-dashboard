import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

const messages = { ar, en };
const I18nContext = createContext(null);

function getPathValue(source, key) {
  if (!key) return undefined;
  return key.split(".").reduce((value, part) => value?.[part], source);
}

function formatTranslationValue(value, fallback) {
  if (typeof value === "string" || typeof value === "number") return value;
  return fallback;
}

export function I18nProvider({ children }) {
  const initialLocale = window.location.pathname.split("/").filter(Boolean)[0] || localStorage.getItem("locale") || "ar";
  const [locale, setLocaleState] = useState(messages[initialLocale] ? initialLocale : "ar");

  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo(() => {
    const translate = key => formatTranslationValue(getPathValue(messages[locale], key), key);
    return { locale, messages: messages[locale], setLocale: setLocaleState, t: translate };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale() {
  return useContext(I18nContext)?.locale || "ar";
}

export function useSetLocale() {
  return useContext(I18nContext)?.setLocale || (() => {});
}

export function useMessages() {
  return useContext(I18nContext)?.messages || messages.ar;
}

export function useTranslations() {
  return useContext(I18nContext)?.t || (key => key);
}

export async function getTranslations() {
  return key => formatTranslationValue(
    getPathValue(messages[localStorage.getItem("locale") || "ar"] || messages.ar, key),
    key
  );
}

export async function getLocale() {
  return localStorage.getItem("locale") || "ar";
}

export async function getFormatter() {
  const locale = localStorage.getItem("locale") || "ar";

  return {
    dateTime(value, options = {}) {
      const date = value instanceof Date ? value : new Date(value);
      return new Intl.DateTimeFormat(locale, options).format(date);
    },
    number(value, options = {}) {
      return new Intl.NumberFormat(locale, options).format(value);
    }
  };
}

export function hasLocale(locales, locale) {
  return locales.includes(locale);
}

export function NextIntlClientProvider({ children }) {
  return children;
}
