import { useRouter } from "@/lib/navigation";

export default function useRouterLang() {
  const router = useRouter();
  const routerLang = (pathname: string, routerFunction?: "push" | "replace") => {
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    if (routerFunction == "replace") {
      router.replace(`${path}`);
    } else {
      router.push(`${path}`);
    }
  };

  return {
    routerLang
  };
}
