// export function getBgColorOfStatus(status: string) {
//   switch (status?.toLocaleUpperCase()) {
//     case "PENDING":
//       return "hsl(var(--info))";
//     case "ACTIVE":
//       return "hsl(var(--success))";
//     case STATUS.VERIFIED.text:
//       return STATUS.VERIFIED.color;
//     case STATUS.NOT_VERIFIED.text:
//       return STATUS.NOT_VERIFIED.color;

//     default:
//       return "hsl(var(--foreground))";
//   }
// }
// export function getBgVariantOfStatus(status: string) {
//   const upperCaseStatus = status?.toLocaleUpperCase();
//   const secondaryStatuses = ["PENDING"];
//   const greenStatuses = ["ACTIVE"];
//   const outlineStatuses = ["VERIFIED"];
//   const destructive = ["BLOCKED", "NOT_VERIFIED"];
//   if (secondaryStatuses.includes(upperCaseStatus)) {
//     return "secondary";
//   } else if (greenStatuses.includes(upperCaseStatus)) {
//     return "default";
//   } else if (outlineStatuses.includes(upperCaseStatus)) {
//     return "green";
//   } else if (destructive.includes(upperCaseStatus)) {
//     return "destructive";
//   } else {
//     return "outline";
//   }
// }
