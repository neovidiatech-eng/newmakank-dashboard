import { fetchHelper } from "@/api/fetch";
import { useTranslations } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Option } from "../common/Form/CustomFormTypes.types";
import { endpointType } from "@/utils/endpoints";

export default function MultiSelect({
  value,
  placeholder,
  onChange,
  name,
  // pageSize = 5,
  idKey = "id",
  labelKey = "name",
  apiUrl
}: // searchTermKey = "search",
  {
    value: string;
    placeholder?: string;
    onChange?: (value: { label: string; value: number }[]) => void;
    name: string;
    // pageSize?: number;
    idKey?: string;
    labelKey?: string;
    apiUrl: endpointType;
    // searchTermKey?: string;
  }) {
  const t = useTranslations();
  const [displayedOptions, setDisplayedOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const setOptionsFetcher = async () => {
    setIsLoading(true);

    const data = await fetchHelper({
      endPoint: apiUrl,
      method: "GET"
      // params: {
      // limit: Number(displayedOptions?.length ?? 0) + 15
      // [searchTermKey]:searchTerm
      // }
    });
    setDisplayedOptions(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?.data?.map((item: any) => ({
        label: item[labelKey],
        value: item[idKey]
      }))
    );
    setIsLoading(false);
  };
  useEffect(() => {
    setOptionsFetcher();
  }, [searchTerm]);
  return (
    <div className="flex w-full flex-col gap-3">
      <Select
        isMulti={true}
        onChange={e => {
          const selectedOptions = e as { label: string; value: number }[];
          if (selectedOptions) {
            onChange?.(selectedOptions);
          }
        }}
        options={displayedOptions}
        value={displayedOptions?.find(opt => opt.value == value)}
        placeholder={placeholder || t("select")}
        name={name}
        classNames={{
          control: () => "border-0 shadow-none"
        }}
        styles={{
          control: baseStyles => ({
            ...baseStyles,
            border: "none",
            boxShadow: "none",
            "&:hover": {
              border: "none"
            }
          })
        }}
        className="text-orange-600 w-full"
        onMenuScrollToBottom={() => {
          if (!isLoading) {
            setOptionsFetcher();
          }
        }}
        isLoading={isLoading}
        onInputChange={e => setSearchTerm(e)}
      />
    </div>
  );
}
