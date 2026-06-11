import type { Option } from "@/components/common/Form/CustomFormTypes.types";
import SelectPaginatedInput from "@/components/common/Inputs/select/SelectPaginatedInput";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation";
import { useTransition } from "react";

interface ModuleSelectorProps {
  moduleKey?: string;
  placeholderKey?: string;
}

export default function ModuleSelector({
  moduleKey = "moduleId",
  placeholderKey = "Module"
}: ModuleSelectorProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const selectedModuleId = searchParams.get(moduleKey) ?? "";

  const handleModuleChange = (value?: string | Option[]) => {
    const params = new URLSearchParams(searchParams.toString());

    const resolvedValue = Array.isArray(value) ? value[0] : value;
    const resolvedValueString =
      typeof resolvedValue === "object" ? resolvedValue?.value?.toString() : resolvedValue;

    if (
      resolvedValueString === undefined ||
      resolvedValueString === null ||
      resolvedValueString === ""
    ) {
      params.delete(moduleKey);
    } else {
      params.set(moduleKey, resolvedValueString);
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  };

  return (
    <div className="flex items-center min-w-[150px] gap-2">
      <SelectPaginatedInput
        name={moduleKey}
        apiUrl={["modules"]}
        value={selectedModuleId}
        placeholder={t(placeholderKey)}
        onChange={handleModuleChange}
      />
    </div>
  );
}
