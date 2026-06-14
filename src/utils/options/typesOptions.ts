
export function DiscountType(t: TFunction) {
  return [
    { label: t("PERCENTAGE"), value: "PERCENTAGE" },
    { label: t("AMOUNT"), value: "AMOUNT" },
    { label: t("CODE"), value: "CODE" },
    { label: t("LINK"), value: "LINK" }
  ];
}

//  PENDING, IN_PROGRESS, RESOLVED, REJECTED
export function ComplaintTypeOptions(t: TFunction) {
  return [
    { label: t("PENDING"), value: "PENDING" },
    { label: t("IN_PROGRESS"), value: "IN_PROGRESS" },
    { label: t("RESOLVED"), value: "RESOLVED" },
    { label: t("REJECTED"), value: "REJECTED" }
  ];
}

export function CouponTypesOPtions(t: TFunction) {
  return [
    { label: t("ALL_USERS"), value: "ALL_USERS" },
    { label: t("ALL_STORES"), value: "ALL_STORES" },
    { label: t("FIRST_ORDER"), value: "FIRST_ORDER" },
    { label: t("USER_WISE"), value: "USER_WISE" },
    { label: t("STORE_WISE"), value: "STORE_WISE" },
    { label: t("ALL_MODULES"), value: "ALL_MODULES" },
    { label: t("MODULE_WISE"), value: "MODULE_WISE" }
  ];
}

// AMOUNT, PERCENTAGE 
export function CouponDiscountTypeOptions(t: TFunction) {
  return [
    { label: t("AMOUNT"), value: "AMOUNT" },
    { label: t("PERCENTAGE"), value: "PERCENTAGE" }
  ];
}


export function daysOptions(t: TFunction) {
  return [
    { label: t("Saturday"), value: "SATURDAY" },
    { label: t("Sunday"), value: "SUNDAY" }, 
    { label: t("Monday"), value: "MONDAY" },
    { label: t("Tuesday"), value: "TUESDAY" },
    { label: t("Wednesday"), value: "WEDNESDAY" },
    { label: t("Thursday"), value: "THURSDAY" },
    { label: t("Friday"), value: "FRIDAY" }
  ];
}
