

export function servicesStatusOptions(t: TFunction) {
  return [
    { label: t("ACTIVE"), value: "ACTIVE" },
    { label: t("INACTIVE"), value: "INACTIVE" },
    // { label: t("REJECTED"), value: "REJECTED" },
    // { label: t("PENDING"), value: "PENDING" }
  ];
}