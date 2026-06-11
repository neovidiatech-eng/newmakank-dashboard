import { useTranslations } from "@/lib/i18n";
import type { Control, FieldValues } from "react-hook-form";

import { PageType } from "@/lib/utils";
import SubmitSection from "../Buttons/SubmitSection";
import type { CardConfig, FormInput, FormLangs } from "./CustomFormTypes.types";
import FormCard from "./FormCard";

export default function CustomForm<T extends FieldValues>({
  inputs,
  control,
  handleSubmit,
  cardConfig,
  defaultConfig,
  children,
  btnName,
  changeLang
}: {
  defaultConfig?: CardConfig;
  control: Control<T>;
  children?: React.ReactNode;
  btnName?: string;
  inputs: FormInput[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: any;
  cardConfig?: CardConfig[];
  changeLang?: FormLangs;
}) {
  const t = useTranslations();
  const { id } = PageType();
  if (defaultConfig && defaultConfig.id === undefined && (cardConfig && cardConfig.length > 1)) {
    defaultConfig.id = "default";
  }
  const groupedInputs = inputs?.reduce(
    (acc, input) => {
      if (input == undefined) {
        return acc;
      }
      const cardId = input?.cardId || "default";

      if (!acc[cardId]) {
        acc[cardId] = [];
      }
      // Get a string placeholder value
      let placeholderValue: string | undefined;
      if (input?.placeholder) {
        placeholderValue = input.placeholder;
      } else if (typeof input?.label === "string") {
        placeholderValue = input.label;
      } else {
        // Ensure we get a string from the translation
        const translatedName = t(`${input?.name.replace("Id", "")}`);
        placeholderValue = typeof translatedName === "string" ? translatedName : undefined;
      }
      acc[cardId].push({
        ...input,
        label:
          input?.label && typeof input.label == "string"
            ? t(input?.label)
            : t(`${input?.name.replace("Id", "")}`),
        id: input?.name,
        defaultValue: input?.defaultValue || t(`${input?.name.replace("Id", "")}`),
        placeholder: placeholderValue
      });
      return acc;
    },
    {} as Record<string | number, FormInput[]>
  );
  if (!groupedInputs || Object.keys(groupedInputs).length === 0) {
    return <div>{t("No inputs available")}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={"dark:!bg-dark-backGround rounded-md"}>
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-2 ">

          <div className="grid grid-cols-6 gap-4">
            {Object.entries(groupedInputs).map(([cardId, cardInputs]) => {
              return (
                <FormCard<T>
                  key={cardId}
                  cardId={cardId}
                  cardInputs={cardInputs}
                  changeLang={changeLang}
                  cardConfig={cardConfig}
                  defaultConfig={defaultConfig}
                  control={control}
                />
              );
            })}
          </div>
          <div className="w-full">{children}</div>
          <SubmitSection btnName={btnName} id={id} />
        </div>
      </div>
    </form>
  );
}
