import { APIChangeStatus } from "@/api/global/ApiChangeStatus";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { endpointType } from "@/utils/endpoints";
import { useTranslations } from "@/lib/i18n";
import { usePathname } from "@/lib/navigation";
import React from "react";
import { toast } from "sonner";

function ChangeStatusTableAction({
  status,
  id,
  options,
  endpoint,
  statusKey = "status",
  type
}: {
  status: string;
  id?: string;
  options: string[];
  endpoint: endpointType;
  statusKey?: string;
  type: "switch" | "select";
}) {
  const [selectedStatus, setSelectedStatus] = React.useState(status);
  const pathname = usePathname();
  const t = useTranslations();
  return type == "switch" ? (
    <Switch
      defaultChecked={
        selectedStatus?.toLocaleLowerCase() == "active" ||
        selectedStatus?.toLocaleLowerCase() == "true"
      }
      onClick={() => {
        const newStatus =
          options.findIndex(option => option == selectedStatus) == 0 ? options[1] : options[0];
        const oldStatus = selectedStatus;
        setSelectedStatus(newStatus);
        toast.promise(
          async () => {
            const res = await APIChangeStatus(endpoint, pathname, id, {
              [`${statusKey}`]: newStatus
            });
            if (!res.success) {
              throw new Error(res.message || res.result?.message || "Something went wrong");
            }
            return res;
          },
          {
            loading: t("Updating"),
            success: t("Updated Successfully"),
            error: (err: any) => {
              setSelectedStatus(oldStatus);
              return t(err.message) || t("Something went wrong");
            }
          }
        );
      }}
    />
  ) : (
    <Select
      value={selectedStatus}
      defaultValue={selectedStatus}
      onValueChange={value => {
        const oldStatus = selectedStatus;
        setSelectedStatus(value);
        toast.promise(
          async () => {
            const res = await APIChangeStatus(endpoint, pathname, id, {
              [`${statusKey}`]: value == "true" ? true : value == "false" ? false : value
            });
            if (!res.success) {
              throw new Error(res.message || res.result?.message || "Something went wrong");
            }
            return res;
          },
          {
            loading: t("Updating"),
            success: t("Updated Successfully"),
            error: (err: any) => {
              setSelectedStatus(oldStatus);
              return t(err.message) || t("Something went wrong");
            }
          }
        );
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t("Change Status")}</SelectLabel>
          {options?.map(option => (
            <SelectItem key={option} value={option}>
              {t(option)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ChangeStatusTableAction;
