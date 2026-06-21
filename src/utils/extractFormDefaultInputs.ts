import { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export function extractFormDefaultInputs(inputs: FormInput[], data?: unknown): object | undefined {
  if (!data) {
    return inputs
      ?.map(item => {
        if (!item) return {};
        if (item.multiLang) {
          return {
            [`${item.name}Ar`]: "",
            [`${item.name}En`]: ""
          };
        }
        return {
          [item.name]: ""
        };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
  return inputs
    ?.map(item => {
      if (item == undefined) {
        return;
      }
      if (item.multiLang) {
        console.log(
          {
            [`${item.name}Ar`]: data[`${item?.name}`]?.ar??'',
            [`${item.name}En`]: data[`${item?.name}`]?.en??''
          },
          "multiLang data",
          data
        );
        return {
          [`${item.name}Ar`]: data[`${item?.name}`]?.ar??'',
          [`${item.name}En`]: data[`${item?.name}`]?.en??''
        };
      }
      if (item?.name == "phone") {
        return {
          [item?.name]: data[item.name]
        };
      }
      return {
        [item.name]: data[item.name]
      };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});
}
