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
  const shape = (schema as any).shape || (schema as any)._def?.schema?.shape || {};
  if (inputCount !== Object.keys(shape).length) {
    throw new Error("Inputs and schema do not match");
  }
  }
}

  