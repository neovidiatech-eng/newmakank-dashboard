import { fetchHelper } from "@/api/fetch";
import { endpointType } from "@/utils/endpoints";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../ui/button";

export default function BtnAction({
  endpoint,
  body,
  children,
  className,
  action,
  method, variant
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  action?: (res) => void;
  className?: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: endpointType;
  children: React.ReactNode;
  body?: unknown;
}): JSX.Element {
  const router = useRouter();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    const res = await fetchHelper({
      endPoint: endpoint,
      method: method ?? "PATCH",
      body: body
    });
    if (res.success) {
      toast.success(t("done"), {
        description: t("Status Changed")
      });
      if (action) action(res);
      router.refresh();
    } else {
      toast.error(t("error"), {
        description: res?.result?.message ?? ""
      });
      throw new Error("Failed to update status");
    }

    setIsLoading(false);
  };

  return (
    <div className="relative inline-flex items-center" aria-busy={isLoading}>
      <Button
        className={className}
        variant={variant}
        onClick={() => {
          onClick();
        }}
      >
        {children}
      </Button>
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
