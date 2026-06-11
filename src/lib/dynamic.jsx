import { lazy, Suspense } from "react";

export default function dynamic(loader, options = {}) {
  const Component = lazy(async () => {
    const mod = await loader();
    return { default: mod.default || mod };
  });

  return function DynamicComponent(props) {
    return (
      <Suspense fallback={options.loading ? options.loading() : null}>
        <Component {...props} />
      </Suspense>
    );
  };
}
