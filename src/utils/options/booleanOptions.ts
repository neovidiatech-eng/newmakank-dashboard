export function booleanOptions(t: TFunction) {
  return [
    { label: t("true"), value: "true" },
    { label: t("false"), value: "false" }
  ];
}
export function genderOptions(t: TFunction) {
  return [
    { label: t("male"), value: "true" },
    { label: t("female"), value: "false" }
  ];
}

export function StatusOptions(t: TFunction) {
  return [
    { label: t("ACTIVE"), value: "ACTIVE" },
    { label: t("DISABLED"), value: "DISABLED" }
  ];
}

export function HorseActivationOptions(t: TFunction) {
  return [
    { label: t("ACTIVE"), value: "ACTIVE" },
    { label: t("BLOCKED"), value: "BLOCKED" }
  ];
}
