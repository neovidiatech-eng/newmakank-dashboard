import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
import { useSearchParams } from "@/lib/navigation";

const DOMAINS = [
  "BUSINESS",
  "DELIVERY",
  "ORDER",
  // "REFUND",
  "STORE",
  // "CUSTOMER",
  // "PRIORITY",
  // "DISBURSEMENT"
];

export default function SettingsDomainNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeDomain = searchParams.get("domain") ?? DOMAINS[0];
  const t = useTranslations()
  const createDomainUrl = (domain: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("domain", domain);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {DOMAINS.map(domain => (
        <Link
          key={domain}
          href={createDomainUrl(domain)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition",
            activeDomain === domain
              ? "border-primary bg-primary/10 text-primary"
              : "border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary dark:border-gray-700 dark:text-gray-300"
          )}
        >
          {t(domain)}
        </Link>
      ))}
    </div>
  );
}
