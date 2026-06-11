import { CouponsInputs } from "./coupons.inputs";
import { CouponsSchema } from "./coupons.schema";

	export function testCouponsForm() {
    if (import.meta.env.MODE === "development") {
  const inputs = CouponsInputs();
  const schema = CouponsSchema((key: string) => key);
   const inputCount = inputs.reduce((count, input) => {
      if (input.multiLang) {
        return count + 2; // Assuming each multiLang input has two fields (e.g
        // nameAr and nameEn)
      }
      return count + 1; // Single input
    }, 0);
  if (inputCount !== Object.keys(schema.shape).length) {
    console.warn("Coupons inputs and schema do not match", {
      inputCount,
      schemaCount: Object.keys(schema.shape).length
    });
  }
  }
}

  
