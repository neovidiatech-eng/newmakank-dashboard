export function RoleTypes(t: TFunction) {
  return [
    { label: t("MANAGER"), value: "MANAGER" },
    { label: t("CUSTOMER"), value: "CUSTOMER" },
    { label: t("DELIVERYMAN"), value: "DELIVERYMAN" },

    { label: t("ADMIN"), value: "ADMIN" },
    { label: t("VENDOR"), value: "VENDOR" }
  ];
}
