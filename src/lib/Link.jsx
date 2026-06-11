import { Link as RouterLink } from "react-router-dom";

/**
 * @typedef {Omit<import("react-router-dom").LinkProps, "to"> & { to?: import("react-router-dom").LinkProps["to"]; href?: string; locale?: string | false; scroll?: boolean }} AppLinkProps
 */

/**
 * @param {AppLinkProps} props
 */
export default function Link({ href, to, locale: _locale, scroll: _scroll, ...props }) {
  return <RouterLink to={to || href || "/"} {...props} />;
}

export { Link };
