import { BannersInputs } from "./banners.inputs";
import { BannersSchema } from "./banners.schema";

	export function testBannersForm() {
    if (import.meta.env.MODE === "development") {
  const inputs = BannersInputs();
  const schema = BannersSchema((key: string) => key);
   const inputCount = inputs.reduce((count, input) => {
      if (input.multiLang) {
        return count + 2; // Assuming each multiLang input has two fields (e.g
        // nameAr and nameEn)
      }
      return count + 1; // Single input
    }, 0);
  if (inputCount !== Object.keys(schema.shape).length) {
    throw new Error("Inputs and schema do not match");
  }
  }
}

  