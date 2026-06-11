
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { useLocale, useTranslations } from "@/lib/i18n";

export const PERM_PREFIX = "perm_";

export const RolesInputs = (permissions?: AppConfig.SystemPermission[]) => {
  const t = useTranslations()
  const locale = useLocale() as "ar" | "en";
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    // { name: "roleKey", type: "text", required: true },
    ...(permissions ?? []).map((group): FormInput => ({
      name: `${PERM_PREFIX}${group.prefix}`,
      label: (group.name as any)?.[locale] || group.prefix,
      type: "checkbox",
      cardId: "items",
      options: group.methods.map((method) => ({
        label: t(`${method.method}`.toLowerCase()),
        value: String(method.id),
      })),
    })),
  ];
  return inputs;
};
