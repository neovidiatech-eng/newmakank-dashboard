import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
export function extractFormNameInputs({
  inputs,
  data,
  dirtyFields
}: {
  inputs: FormInput[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  dirtyFields?: Record<string, boolean | boolean[]> | undefined;
}): FormData | Record<string, unknown> {
  const formdata = new FormData();
  const isFormData = inputs.some(
    input =>
      input.type == "file" ||
      input.type == "img" ||
      input.type == "filesUpload" ||
      input.type == "video"
  );
  if (isFormData) {
    Object.keys(data).map((item: string) => {
      if (dirtyFields && !dirtyFields[item]) return;
      else if (data[item] == undefined) return;
      if (item.includes("phone") || item.includes("Phone")) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        data[item] && formdata.append(item, `${data[item]}`);
      } else if (inputs.find(input => input.name === item.slice(0, -2))?.multiLang) {
        if (formdata.has(`${item.slice(0, -2)}`)) return;
        formdata.append(
          `${item.slice(0, -2)}`,
          JSON.stringify({
            ar: data[`${item.slice(0, -2)}Ar`],
            en: data[`${item.slice(0, -2)}En`]
          })
        );
      } else if (
        data[item] &&
        (data[item][0] instanceof File ||
          data[item][0] instanceof Blob ||
          (typeof data[item][0] == "string" && data[item][0]?.includes("uploads/")))
      ) {
        data[item].forEach((file: File | Blob | string) => {
          if (file instanceof File || file instanceof Blob) {
            formdata.append(item, file);
          } else if (typeof file === "string" && file.includes("uploads/")) {
            // formdata.append(item, file);
          }
        });
      } else formdata.append(item, data[item]);
    });
    return formdata;
  } else {
    const formdata: Record<
      string,
      | {
          ar: string;
          en: string;
        }
      | string
      | boolean
    > = {};
    Object.keys(data).map((item: string) => {
      if (dirtyFields && !dirtyFields[item]) return;
      if (item.includes("phone") || item.includes("Phone")) {
        formdata[item] = `${data[item]}`;
      } else if (
        inputs.find(input => input.name === item.slice(0, -2))?.multiLang &&
        data[item] != undefined
      ) {
        formdata[`${item.slice(0, -2)}`] = {
          ar: data[`${item.slice(0, -2)}Ar`],
          en: data[`${item.slice(0, -2)}En`]
        };
      } else if (typeof data[item] === "boolean") {
        formdata[item] = Boolean(data[item]);
      } else formdata[item as keyof typeof formdata] = data[item];
      // isNaN(Number(data[item]))
      //  ? data[item]
      //  : Number(data[item]);
    });
    return formdata;
  }
}
