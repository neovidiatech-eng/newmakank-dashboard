/* eslint-disable no-async-promise-executor */
import { fetchHelper } from "@/api/fetch";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import { Option } from "../../Form/CustomFormTypes.types";
import SelectInput from "../../Inputs/select/SelectInputs";
import { endpointType } from "@/utils/endpoints";

export default function SelectStatus({
  apiUrl,
  name,
  value,
  options,
  extraBody
}: {
  apiUrl: endpointType;
  name?: string;
  value: string;
  extraBody?: Record<string, unknown>;
  options: Option[];
}) {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="w-full z-30 px-3 min-w-[140px]  text-center flex justify-center items-center">
      <SelectInput
        options={options}
        name={name ?? "select"}
        value={value}
        onChange={async e => {
          const promise = () =>
            new Promise<{
              message: string;
              result: {
                message: string;
              };
            }>(async (resolve, reject) => {
              try {
                const res = await fetchHelper({
                  endPoint: apiUrl,
                  method: "PATCH",
                  body: {
                    status: e,
                    ...(extraBody
                      ? {
                        ...extraBody
                      }
                      : {})
                  }
                });
                if (!res.success) {
                  reject(res);
                } else
                  resolve({
                    message: res.message,
                    result: {
                      message: res.message
                    }
                  });
              } catch (error) {
                reject(error);
              }
            });

          toast.promise(promise, {
            loading: t("Updating status"),
            success: data => {
              router.refresh();
              return `${data?.message}`;
            },
            error: data => {
              return `${data?.result?.message}`;
            }
          });
        }}
      />
    </div>
  );
}
