import { CustomersInputs } from "./customers.inputs";
import { CustomersSchema } from "./customers.schema";

	export function testCustomersForm() {
    if (import.meta.env.MODE === "development") {
  const inputs = CustomersInputs();
  const schema = CustomersSchema((key: string) => key);
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

  