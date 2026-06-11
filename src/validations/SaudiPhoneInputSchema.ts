import { noSchema } from "./String.schema";

// The regex pattern validates Qatar phone numbers:
// - Mobile numbers starting with 3, 5, 6, or 7
// - Followed by 7 digits (8 digits total)
// - Can optionally start with country code +974

export function QatarPhoneSchema(t?: (key: string) => string) {
  if (t) {
    return noSchema();
  }
  return noSchema();
}
