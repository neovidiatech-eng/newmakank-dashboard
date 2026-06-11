/* eslint-disable @typescript-eslint/no-empty-object-type */
import { JSX as ReactJSX } from "react";

declare global {
  // Define ContextT which appears to be used but not defined in your example
  type ContextT = {
    params: Record<string, string>;
    searchParams: Record<string, string | string[]>;
  };

  // Make JSX globally available
  namespace JSX {
    interface Element extends ReactJSX.Element {}
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty
      extends ReactJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute
      extends ReactJSX.ElementChildrenAttribute {}
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }
}

declare module "react" {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

// This export is needed to make this a module
export {};
