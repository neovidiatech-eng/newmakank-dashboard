import { X } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { FormInput } from "./CustomFormTypes.types";
import FormCard from "./FormCard";
import { Control, FieldValues } from "react-hook-form";

type CustomGeneratedInputsProps<TFieldValues extends FieldValues> = {
    minRequired?: number;
    generatedInputs: FormInput[];
    fields: Array<{ id: string }>;
    append: () => void;
    remove: (index: number) => void;
    control: Control<TFieldValues>;
    appendKey?: string;
    name: string;
};

export default function CustomGeneratedInputs<TFieldValues extends FieldValues>({
    fields,
    append,
    name,
    remove,
    minRequired = 0,
    control,
    generatedInputs,
    appendKey,
}: CustomGeneratedInputsProps<TFieldValues>): JSX.Element {
    const t = useTranslations();
    return (
        <>
            {fields.map((item, index) => {
                const cardInputs = generatedInputs.map(input => {
                    return {
                        ...input,
                        name: `${name}.${index}.${input.name}`,
                        label: input?.label || t(`${input?.name}`),
                        id: `${name}.${index}.${input.name}`,
                        defaultValue: input?.defaultValue || t(`${input?.name}`),
                        placeholder: input?.placeholder || t(`${input?.name}`)
                    };
                });

                return (
                    <div className="mb-2" key={item.id}>
                        <div>
                            <FormCard
                                cardConfig={[
                                    {
                                        id: item.id,
                                        title: (
                                            <div className="flex items-center justify-between w-full gap-4">
                                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    #{index + 1}
                                                </span>
                                                {minRequired < index + 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200 border border-transparent focus:outline-none"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ),
                                        width: 6,
                                        multiLang: false
                                    }
                                ]}
                                cardInputs={cardInputs}
                                cardId={item.id}
                                control={control}
                            />
                        </div>
                    </div>
                );
            })}
            <div className="flex items-center px-1 my-3">
                <button
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-Secondary active:scale-95 border border-primary/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
                    type="button"
                    onClick={append}
                >
                    {appendKey ? t(`${appendKey}`) : t("append")}
                </button>
            </div>
        </>
    );
}
