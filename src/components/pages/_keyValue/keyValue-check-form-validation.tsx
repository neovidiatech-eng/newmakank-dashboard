import { KeyValueInputs } from "./keyValue.inputs";
import { KeyValueSchema, type KeyValueFormType } from "./keyValue.schema";

export function testKeyValueForm(type: KeyValueFormType = "text") {
  if (import.meta.env.MODE === "development") {
    const inputs = KeyValueInputs({ type });
    const schema = KeyValueSchema((key: string) => key, type);
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

  
