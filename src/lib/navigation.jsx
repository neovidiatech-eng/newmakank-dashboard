import { useMemo } from "react";
import { Link as RouterLink, Navigate, useLocation, useNavigate, useParams, useSearchParams as useRRSearchParams } from "react-router-dom";
import { useLocale } from "@/lib/i18n";

const SUPPORTED_LOCALES = new Set(["ar", "en"]);

function getCurrentLocale() {
  const pathLocale = window.location.pathname.split("/").filter(Boolean)[0];
  if (SUPPORTED_LOCALES.has(pathLocale)) return pathLocale;

  const storedLocale = localStorage.getItem("locale");
  return SUPPORTED_LOCALES.has(storedLocale) ? storedLocale : "ar";
}

export function localizePath(to, locale = getCurrentLocale()) {
  if (typeof to !== "string") return to;
  if (!to || to.startsWith("?") || to.startsWith("#")) return to;
  if (/^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(to)) return to;

  if (!to.startsWith("/")) return to;

  const [pathname] = to.split(/(?=[?#])/, 2);
  const segments = pathname.split("/").filter(Boolean);

  if (SUPPORTED_LOCALES.has(segments[0])) return to;

  return `/${locale}${to}`.replace(/\/+/g, "/");
}

export function useRouter() {
  const navigate = useNavigate();
  const locale = useLocale();

  return useMemo(() => ({
    push: (to, options) => navigate(localizePath(to, locale), options),
    replace: (to, options) => navigate(localizePath(to, locale), { replace: true, ...options }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => {
      import("@/lib/queryClient").then(({ queryClient }) => {
        queryClient.clear();
      });
      // Force remount by navigating to the same path
      navigate(window.location.pathname + window.location.search, { replace: true });
    }
  }), [navigate, locale]);
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const [params] = useRRSearchParams();
  return params;
}

export function redirect(to) {
  window.location.assign(localizePath(to));
}

export function notFound() {
  return <Navigate to="/404" replace />;
}

/**
 * @typedef {Omit<import("react-router-dom").LinkProps, "to"> & { to?: import("react-router-dom").LinkProps["to"]; href?: string; locale?: string | false; scroll?: boolean }} AppLinkProps
 */

/**
 * @param {AppLinkProps} props
 */
export function Link({ href, to, locale, scroll: _scroll, ...props }) {
  const activeLocale = useLocale();
  const target = to || href || "/";
  const localized = locale !== false ? localizePath(target, locale || activeLocale) : target;
  return <RouterLink to={localized} {...props} />;
}

export { useParams };
