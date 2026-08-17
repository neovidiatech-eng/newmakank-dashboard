import { fetchHelper } from "@/api/fetch";
import { Switch } from "@/components/ui/switch";
import { endpointType } from "@/utils/endpoints";
import { useTranslations } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export default function ToggleStatus({
  isActive,
  endpoint,
  id,
  body,
  method
}: {
  isActive: boolean;
  endpoint: endpointType;
  id: string | number;
  body?: unknown;
  method?: "PUT" | "PATCH";
}): JSX.Element {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [localIsActive, setLocalIsActive] = useState(isActive);

  useEffect(() => {
    setLocalIsActive(isActive);
  }, [isActive]);

  const handleToggle = async () => {
    setIsLoading(true);
    const targetState = !localIsActive;

    let finalBody = body;
    if (body && typeof body === "object") {
      finalBody = { ...body };
      Object.keys(finalBody).forEach(key => {
        if (typeof (finalBody as any)[key] === "boolean") {
          (finalBody as any)[key] = targetState;
        }
      });
    }

    const isDelivery = endpoint.includes("delivery");
    const primaryMethod = method || (isDelivery ? "PUT" : "PATCH");
    const secondaryMethod = primaryMethod === "PUT" ? "PATCH" : "PUT";

    let res = await fetchHelper({
      endPoint: [...endpoint, Number(id)],
      method: primaryMethod,
      body: finalBody
    });

    if (!res.success && (res.code === 404 || res.code === 405)) {
      res = await fetchHelper({
        endPoint: [...endpoint, Number(id)],
        method: secondaryMethod,
        body: finalBody
      });
    }

    if (res.success) {
      toast.success(t("done"), {
        description: t("Status Changed")
      });
      setLocalIsActive(targetState);
      queryClient.invalidateQueries({ queryKey: endpoint.map(String) });
    } else {
      setLocalIsActive(isActive);
      toast.error(t("error"), {
        description: res?.message || t("Failed to change status")
      });
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="relative inline-flex items-center" aria-busy={isLoading}>
      <Switch
        checked={localIsActive}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        className={`transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
          <svg
            className="animate-spin h-5 w-5 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
