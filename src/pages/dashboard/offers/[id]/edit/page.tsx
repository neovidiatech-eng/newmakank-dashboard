import CustomHeader from "@/components/layouts/header/CustomHeader";
import { fetchHelper } from "@/api/fetch";
import OffersFormPage from "@/components/pages/_offers/offersForm.page";

// The scope (which services are paid/free) comes back as ScopeServices, not as the
// paidServiceIds/freeServiceIds fields the create form uses — remap it here so editing an
// existing offer pre-fills the multi-selects instead of starting empty.
function extractScopeIds(scope: unknown, role: string): string[] {
  if (!scope) return [];
  const list = Array.isArray(scope) ? scope : [scope];
  return list
    .filter((entry: any) => !entry?.role || String(entry.role).toUpperCase() === role)
    .map((entry: any) => entry?.serviceId ?? entry?.Service?.id)
    .filter(Boolean)
    .map(String);
}

function extractScopeCategoryIds(scope: unknown, role: string): string[] {
  if (!scope) return [];
  const list = Array.isArray(scope) ? scope : [scope];
  return list
    .filter((entry: any) => !entry?.role || String(entry.role).toUpperCase() === role)
    .map((entry: any) => entry?.categoryId ?? entry?.Category?.id)
    .filter(Boolean)
    .map(String);
}

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ["bundles", Number((await params).id)],
    method: "GET"
  });

  const bundle = data?.data;

  return (
    <>
      <CustomHeader />
      <OffersFormPage
        data={
          bundle && {
            ...bundle,
            paidServiceIds: extractScopeIds(bundle.ScopeServices, "PAID"),
            freeServiceIds: extractScopeIds(bundle.ScopeServices, "FREE"),
            paidCategoryIds: extractScopeCategoryIds(bundle.ScopeCategories, "PAID"),
            freeCategoryIds: extractScopeCategoryIds(bundle.ScopeCategories, "FREE")
          }
        }
      />
    </>
  );
};

export default page;
