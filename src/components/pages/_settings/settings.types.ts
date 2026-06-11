export type SettingsItem = {
  setting: string;
  name: string | null;
  value: string;
  domain: string;
  enumValues: string[] | null;
  dataType: string;
};

export type SettingsFormValues = Record<string, unknown>;
