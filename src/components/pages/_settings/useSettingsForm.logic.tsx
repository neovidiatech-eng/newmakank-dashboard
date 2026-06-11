import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { SettingsInputs } from "./settings.inputs";
import { SettingsSchema } from "./settings.schema";
import type { SettingsFormValues, SettingsItem } from "./settings.types";

const mapSettingsToDefaults = (settings: SettingsItem[]): Record<string, unknown> => {
  return settings.reduce<Record<string, unknown>>((acc, item) => {
    acc[item.setting] = item.value ?? "";
    return acc;
  }, {});
};

export default function useSettingsLogic({
  settings,
  domain
}: {
  settings: SettingsItem[];
  domain: string;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = useMemo(() => SettingsInputs({ settings, t }), [settings, t]);
  const defaultValues = useMemo(() => {
    return extractFormDefaultInputs(inputs, mapSettingsToDefaults(settings)) as SettingsFormValues;
  }, [inputs, settings]);

  const { control, handleSubmit, reset } = useForm<SettingsFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(SettingsSchema()),
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);


  const onSubmit = async (formData: SettingsFormValues) => {
    const payload = new FormData();
    const settingsPayload = settings.map(item => {
      const value = formData[item.setting];
      return {
        setting: item.setting,
        value: value instanceof File ? "" : (value ?? ""),
        name: item.name ?? {}
      };
    });

    payload.append("settings", JSON.stringify(settingsPayload));

    settings.forEach((item, index) => {
      if (item.dataType !== "FILE") return;
      const value = formData[item.setting];
      if (value instanceof File) {
        payload.append(`settings[${index}].file`, value);
      } else {
        payload.append(`settings[${index}].file`, "");
      }
    });
    payload.append("domain", domain);
    await formAction({
      formData: payload,
      endpoint: ["settings"],
      method: "PATCH",
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
