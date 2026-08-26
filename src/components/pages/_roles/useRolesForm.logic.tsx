"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect } from "react";
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

  // Build default values for permission group inputs
  const permDefaults: Record<string, string[]> = {};
  if (permissions) {
    const rawIds: (string | number)[] = [];
    if (Array.isArray((data as any)?.permissionIds)) {
      rawIds.push(...(data as any).permissionIds);
    }
    if (Array.isArray((data as any)?.RolePermission)) {
      rawIds.push(...(data as any).RolePermission.map((rp: any) => rp.permissionId ?? rp.Permission?.id ?? rp.id));
    }
    if (Array.isArray((data as any)?.Permissions)) {
      for (const p of (data as any).Permissions) {
        if (p.id) rawIds.push(p.id);
        if (Array.isArray(p.methods)) {
          p.methods.forEach((m: any) => { if (m.id) rawIds.push(m.id); });
        }
      }
    }
    const existingIds = new Set(rawIds.filter(Boolean).map(String));

    for (const group of permissions) {
      const key = `${PERM_PREFIX}${group.prefix}`;
      permDefaults[key] = data 
        ? (group.methods ?? [])
            .filter(m => existingIds.has(String(m.id)))
            .map(m => String(m.id))
        : [];
    }
  }

  const defaultValues = {
    ...extractFormDefaultInputs(inputs, data),
    ...permDefaults
  } as unknown as RolesType;

  const { control, handleSubmit, reset } = useForm<RolesType>({
    mode: "onSubmit",
    resolver: zodResolver(RolesSchema(t, permissions)),
    defaultValues
  });

  useEffect(() => {
    if (data || permissions) {
      reset(defaultValues);
    }
  }, [data, permissions]);

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
