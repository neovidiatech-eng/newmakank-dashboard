"use client";

import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useRouter, useSearchParams, usePathname } from "@/lib/navigation";
import OffersColumns from "./OffersColumns";

// The backend rejects GET /bundles with a 400 ("storeId is required to list bundles")
// whenever storeId is missing — unlike every other list endpoint in this app, it's not
// optional. So the table only renders once a store is actually picked, instead of firing
// a doomed request (and a confusing error toast) on first load.
export default function OffersTable({ permission }: { permission?: Auth.PermissionsType }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <Store className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm max-w-sm">{t("offersPickStoreFirst")}</p>
          <div className="w-full max-w-xs">
            <SelectPaginated
              name="storeId"
              apiUrl={["stores"]}
              value=""
              placeholder={t("store")}
              onChange={value => {
                if (!value) return;
                const params = new URLSearchParams(searchParams.toString());
                params.set("storeId", String(value));
                router.push(`${pathname}?${params.toString()}`, { scroll: false });
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableWithQuery
      endPoint={["bundles"]}
      columns={OffersColumns}
      hideCreateNew={!permission?.post}
      createNewLink={`/stores/${storeId}/offers/create`}
      cardHeader={t("Offers")}
      tableActions={{
        onEdit: permission?.put || permission?.patch,
        onDelete: permission?.delete ? ["bundles"] : undefined
      }}
      filters={[
        {
          name: "storeId",
          type: "selectPaginated",
          apiUrl: ["stores"]
        },
        {
          name: "isActive",
          type: "select",
          options: [
            { label: t("true"), value: "true" },
            { label: t("false"), value: "false" }
          ]
        }
      ]}
    />
  );
}
