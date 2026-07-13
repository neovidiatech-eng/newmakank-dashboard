import { SearchField } from "@/components/ui/dashboard-primitives";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "@/lib/navigation";
import { useEffect, useState, useTransition } from "react";
import { FormInput } from "../../Form/CustomFormTypes.types";
import { renderInput } from "../../Form/inputs-render";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";

function TableSearch({ searchFilter }: { searchFilter: FormInput }): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const getInitialValue = () => {
    if (searchFilter.isMulti) {
      const values = searchParams.getAll(searchFilter.name);
      if (searchFilter.type === "date") {
        return values.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
      }
      return values;
    }
    const value = searchParams.get(searchFilter.name);
    if (value && searchFilter.type === "date") {
      const date = new Date(value);
      return !isNaN(date.getTime()) ? date : value;
    }
    return value || "";
  };

  const [filterValue, setFilterValue] = useState<any>(getInitialValue());

  useEffect(() => {
    setFilterValue(getInitialValue());
  }, [searchParams, searchFilter.name, searchFilter.isMulti]);

  const onFilterSubmit = (value: any) => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing for this key
    params.delete(searchFilter.name);
    params.delete("page");

    // If changing orderType to something other than CUSTOM_DELIVERY, delete customDeliveryKind!
    if (searchFilter.name === "orderType" && value !== "CUSTOM_DELIVERY") {
      params.delete("customDeliveryKind");
    }

    const normalize = (val: any) => {
      if (val instanceof Date) return val.toISOString();
      return String(val);
    };

    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v) params.append(searchFilter.name, normalize(v));
      });
    } else if (value) {
      params.set(searchFilter.name, normalize(value));
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  if (searchFilter.type === "tabs") {
    const options = searchFilter.options || [];
    const allOptions = [{ label: t("ALL") || "All", value: "" }, ...options];

    return (
      <div className="flex flex-col gap-1.5 min-w-[200px]">
        {searchFilter.label && (
          <span className="text-xs font-semibold text-muted-foreground px-1">
            {searchFilter.label}
          </span>
        )}
        <div className="inline-flex items-center gap-1 rounded-xl bg-muted/60 p-1 border border-border/60">
          {allOptions.map(opt => {
            const isActive = (filterValue || "") === opt.value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  setFilterValue(opt.value);
                  onFilterSubmit(opt.value);
                }}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition",
                  isActive
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (searchFilter.type !== "text") {
    return (
      <div className="relative min-w-[200px]">
        {renderInput(searchFilter, {
          value: filterValue,
          onChange: (e: any) => {
            let newValue: any;
            if (typeof e === "string" || typeof e === "number") {
              newValue = e;
            } else if (e?.target) {
              newValue = e.target.value;
            } else if (Array.isArray(e)) {
              newValue = e.map(item => item?.value ?? item);
            } else if (e?.value !== undefined) {
              newValue = e.value;
            } else {
              newValue = e;
            }

            setFilterValue(newValue);
            // For non-text inputs, we usually want to submit immediately
            onFilterSubmit(newValue);
          }
        })}
        {isPending && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      className="relative min-w-[200px]"
      onSubmit={e => {
        e.preventDefault();
        onFilterSubmit(filterValue);
      }}
    >
      <SearchField
        name={searchFilter.name}
        placeholder={searchFilter.placeholder}
        value={typeof filterValue === 'string' ? filterValue : ''}
        onChange={setFilterValue}
        className={isPending ? "pr-10" : ""}
      />
      {isPending && (
        <div className="absolute inset-y-0 right-10 flex items-center pr-3 pointer-events-none">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </form>
  );
}

export default TableSearch;

