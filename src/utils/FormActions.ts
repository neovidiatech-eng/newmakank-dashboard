import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import { endLoading, startLoading } from "@/lib/global-loading";
import { usePathname, useRouter } from "@/lib/navigation";
import type { FieldValues, UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import { endpointType } from "./endpoints";

/** Drop-in replacement for FormAction — automatically refreshes the current page on success for edits, and redirects for creations. */
export function useFormAction() {
  const pathname = usePathname();
  const router = useRouter();

  return async function <T = any>(args: Parameters<typeof FormAction<T>>[0]): Promise<ApiResponse<T>> {
    const res = await FormAction<T>(args);
    if (res?.success) {
      // Determine the list/parent path (e.g. remove /create or /[id]/edit)
      let listPath = pathname;
      const segments = pathname.split("/");
      const last = segments[segments.length - 1];

      // if (last === "create") {
      //   listPath = segments.slice(0, -1).join("/");
      // } else 
      if (last === "edit") {
        listPath = segments.slice(0, -2).join("/");
      }

      try {
        await revalidatePathAction(listPath);
        if (listPath !== pathname) {
          await revalidatePathAction(pathname);
        }
      } catch (e) {
        console.error("Failed to revalidate path:", e);
      }

      window.location.reload()

      if (args?.data?.id) {
        window.location.reload();
      } else {
        router.push(listPath);
      }
    }
    return res;
  };
}


export async function FormAction<T = any>({
  data,
  formData,
  endpoint,
  customReset,
  noId = false,
  method,
  t,
  reset
}: {
  noId?: boolean;
  t: TFunction;
  reset?: UseFormReset<T extends FieldValues ? T : FieldValues>;
  data?: T & { id?: string | number };
  // data?: T & { id?: string | number; key?: string };
  method?: "POST" | "PATCH";
  // redirectLink?: allRoutes;
  endpoint: endpointType;
  formData: FieldValues;
  customReset?: (res?: unknown) => void;
}): Promise<ApiResponse<T>> {
  startLoading();
  // loadingEmitter.emit(true);
  let res: ApiResponse<T> = {
    message: "",
    success: false,
    total: 0,
    data: null as unknown as T,
    result: {
      message: ""
    }
  };
  if (data?.id) {
    const id = data?.id;
    res = await fetchHelper({
      endPoint: [...endpoint, ...(noId !== true ? [Number(id)] : [])],
      body: formData,
      method: method || "PATCH"
    });
  } else {
    res = await fetchHelper({
      endPoint: [...endpoint],
      body: formData,
      method: method || "POST"
    });
  }
  endLoading();
  MessageToast({
    res: res,
    customReset: () => {
      if (customReset) {
        customReset(res);
      }
      if (!data?.id && reset) {
        reset();
      }
    },
    t
  });

  // loadingEmitter.emit(false);
  return res;
}

export function MessageToast({
  res,
  customReset,
  t
}: {
  t: TFunction;
  res: ApiResponse<any>;

  customReset?: () => void;
}): void {
  if (res?.success) {
    if (customReset) customReset();
    toast.success(t("Success"), {
      id: "success-toast"
    });
  } else {
    toast.error(res?.result?.message, {
      id: "error-toast",
      description: res?.message || t("Something went wrong")
    });
  }
}
