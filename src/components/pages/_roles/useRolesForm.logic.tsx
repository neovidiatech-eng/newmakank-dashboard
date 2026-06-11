"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { PERM_PREFIX, RolesInputs } from "./roles.inputs";
import { RolesSchema, type RolesType } from "./roles.schema";

export default function useRolesLogic({
  data,
  permissions
}: {
  permissions?: AppConfig.SystemPermission[];
  data?: RolesType;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = RolesInputs(permissions);

  // Build default values for permission group inputs from existing data
  const permDefaults: Record<string, string[]> = {};
  if (data && permissions) {
    const existingIds = new Set(
      ((data as any)?.RolePermission ?? []).map((rp: any) => String(rp.permissionId))
    );
    for (const group of permissions) {
      const key = `${PERM_PREFIX}${group.prefix}`;
      permDefaults[key] = group.methods
        .filter(m => existingIds.has(String(m.id)))
        .map(m => String(m.id));
    }
  }
  const { control, handleSubmit, reset } = useForm<RolesType>({
    mode: "onSubmit",
    resolver: zodResolver(RolesSchema(t, permissions)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      ...permDefaults
    } as unknown as RolesType
  });

  const onSubmit = async (formData: RolesType) => {
    // Aggregate all perm_* fields into a single permissionIds array
    const permissionIds: number[] = [];
    const cleanData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(formData)) {
      if (key.startsWith(PERM_PREFIX)) {
        if (Array.isArray(value)) {
          permissionIds.push(...value.map(Number));
        }
      } else {
        cleanData[key] = value;
      }
    }

    const extracted = extractFormNameInputs({ inputs, data: cleanData });
    const payload =
      extracted instanceof FormData
        ? (() => {
            permissionIds.forEach(id =>
              (extracted as FormData).append("permissionIds[]", String(id))
            );
            return extracted;
          })()
        : { ...extracted, permissionIds };

    await formAction({
      data,
      formData: payload,
      endpoint: ["role"],
      reset: reset,

      t
    });
  };

  const formSubmit = handleSubmit(onSubmit);

  return {
    control,
    inputs,
    formSubmit,
    t
  };
}
