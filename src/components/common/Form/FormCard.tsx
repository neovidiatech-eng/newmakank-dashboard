import React from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import type { CardConfig, FormInput, FormLangs } from "./CustomFormTypes.types";
import FormCardContainer from "./FormCardContainer";
import FormCardTitle from "./FormCardTitle.layout";
import FormInputContainer from "./FormInputContainer";

import { renderInputComponent } from "./inputs-render";

export default function FormCard<T extends FieldValues>({
  cardId,
  cardInputs,
  cardConfig,
  control,
  changeLang,
  defaultConfig
}: // errors,
{
  cardId: string | number;
  cardInputs: FormInput[];
  cardConfig?: CardConfig[];
  defaultConfig?: CardConfig;
  control: Control<T>;
  // errors: FieldErrors;
  changeLang?: FormLangs;
}): JSX.Element {
  let cardWidthObj = cardConfig?.find(cw => cw.id === cardId);
  if ((cardWidthObj?.id == "default" || cardWidthObj == undefined) && defaultConfig) {
    cardWidthObj = defaultConfig;
  }
  const colSpan = cardWidthObj ? cardWidthObj.width : 6;
  let cardTitle;
  if (cardConfig) {
    cardTitle = cardWidthObj;
  }

  return (
    <FormCardContainer width={cardWidthObj?.width ?? colSpan} index={cardId}>
      {cardTitle?.title && <FormCardTitle icon={cardTitle?.icon} title={cardTitle.title} />}
      {changeLang && <></>}
      {cardInputs.map((item: FormInput, index: number) => {
        const inputWidth = item.width ?? 3;
        const isMultiLang = item.multiLang && cardTitle?.multiLang;

        return (
          <React.Fragment key={item.name}>
            {!item.isHidden && (
              <FormInputContainer width={inputWidth} className={item.inputClassName} index={index}>
                {isMultiLang ? (
                  <>
                    {["Ar", "En"].map(lang => (
                      <div key={`${item.name}${lang}`} className="mb-4">
                        <Controller
                          name={`${item.name}${lang === "En" ? "En" : "Ar"}` as Path<T>}
                          control={control}
                          render={({ field, fieldState: { error } }) => {
                            return renderInputComponent({
                              errors: { [field.name]: error },
                              item: {
                                ...item,
                                label: `${item.label} (${lang})`,
                                name: `${item.name}${lang === "En" ? "En" : "Ar"}`
                              },
                              field
                            });
                          }}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <Controller
                    name={item.name as Path<T>}
                    control={control}
                    render={({ field, formState: { errors } }) =>
                      renderInputComponent({
                        errors: errors,
                        item,
                        field
                      })
                    }
                  />
                )}
              </FormInputContainer>
            )}
          </React.Fragment>
        );
      })}
    </FormCardContainer>
  );
}
