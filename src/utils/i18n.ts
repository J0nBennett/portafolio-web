import spanishSite from "../data/site.json";
import englishSite from "../data/site.en.json";
import englishUi from "../data/ui.en.json";
import { isExternalUrl, normalizeBasePath, withBasePath } from "./url";

export type Locale = "es" | "en";
const translations: Record<string, string> = englishUi;

export function routeWithoutLocale(pathname: string, base = import.meta.env.BASE_URL) {
  const prefix = normalizeBasePath(base);
  let route = pathname;
  if (prefix !== "/" && (route === prefix || route.startsWith(`${prefix}/`))) route = route.slice(prefix.length) || "/";
  return route.replace(/^\/en(?=\/|$)/, "") || "/";
}

export function getLocale(pathname: string, base = import.meta.env.BASE_URL): Locale {
  const prefix = normalizeBasePath(base);
  const route = prefix !== "/" && pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
  return /^\/en(?:\/|$)/.test(route) ? "en" : "es";
}

export function localizedPath(value: string, locale: Locale, base = import.meta.env.BASE_URL) {
  if (!value || isExternalUrl(value)) return value;
  let route = routeWithoutLocale(value, base);
  if (/^\/cv(?:-en)?\.pdf$/.test(route)) route = locale === "en" ? "/cv-en.pdf" : "/cv.pdf";
  const isAsset = /\.[a-z\d]+(?:[?#]|$)/i.test(route);
  return withBasePath(locale === "en" && !isAsset ? `/en${route.startsWith("/") ? route : `/${route}`}` : route, base);
}

export function languagePath(pathname: string, locale: Locale, base = import.meta.env.BASE_URL) {
  const route = routeWithoutLocale(pathname, base);
  return localizedPath(route.endsWith("/") ? route : `${route}/`, locale, base);
}

export const getSite = (locale: Locale): typeof spanishSite => locale === "en" ? englishSite : spanishSite;
export const translator = (locale: Locale) => (text: string) => locale === "en" ? translations[text] ?? text : text;
