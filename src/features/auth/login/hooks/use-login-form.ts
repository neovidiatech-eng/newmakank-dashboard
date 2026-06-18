import { setRefreshToken, setToken } from "@/api/actions";
import { fetchHelper } from "@/api/fetch";
import { links } from "@/components/layouts/sidebar/sidebar-data";
import { useLocale } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { REDIRECT_AFTER_AUTH } from "@/utils/config";
import { useState } from "react";
import { toast } from "sonner";
import { useFcmToken } from "./use-fcm-token";

export function useLoginForm() {
  const locale = useLocale();
  const router = useRouter();
  const { getLoginFcmToken, notificationPermission, requestPermission } = useFcmToken();
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    if (!form) {
      console.error("Form element not found");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(form);
    const password = (formData.get("password") as string | null)?.trim();

    if (!password) {
      setIsLoading(false);
      return;
    }

    const fcm = await getLoginFcmToken();

    const requestBody: {
      password: string;
      fcm: string | null;
      email?: string;
      phone?: string;
      locale: string;
    } = {
      password,
      fcm,
      locale
    };

    if (loginType === "email") {
      const email = (formData.get("email") as string | null)?.trim();
      if (email) requestBody.email = email;
    } else {
      requestBody.phone = phoneNumber;
    }
    
    const res = await fetchHelper({
      endPoint: ["adminLogin"],
      method: "POST",
      body: requestBody,
      // Login never needs to try refreshing (no token exists yet)
      refreshToken: false,
      // Don't redirect on 401 — just show the error to the user
      redirectOnUnauthorized: false
    });

    if (res.code === 412) {
      await setToken(res?.data?.token);
      router.push("/verify");
      return;
    }

    if (!res.success) {
      setIsLoading(false);
      toast.error(res.result?.message);
      return;
    }

    toast.success(res?.message);
    await setToken(res?.data?.AccessToken);
    await setRefreshToken(res?.data?.RefreshToken);

    let destination = res?.data?.user?.roleId === "ADMIN" ? REDIRECT_AFTER_AUTH : "/dashboard";

    if (res?.data?.user?.roleId !== "ADMIN" && res?.data?.user?.Permissions) {
      // Parse permissions locally the same way api/permissions.ts does
      const parsedPermissions = res.data.user.Permissions.reduce((acc: any, curr: any) => {
        const allMethods = ["get", "post", "put", "patch", "delete", "manage"];
        const methodsObject = allMethods.reduce((methodsInit: any, method: string) => {
          methodsInit[method] = false;
          return methodsInit;
        }, {} as Record<string, boolean>);

        const methodsArray = curr.method || curr.methods || [];
        methodsArray.forEach((method: any) => {
          if (typeof method === "string") {
            methodsObject[method.toLowerCase()] = true;
          } else if (method && typeof method === "object" && method.method) {
            methodsObject[method.method.toLowerCase()] = true;
          }
        });

        const keys: string[] = [];
        if (curr.prefix) keys.push(curr.prefix);
        if (typeof curr.name === "string") keys.push(curr.name);
        else if (curr.name && typeof curr.name === "object") {
          if (curr.name.en) keys.push(curr.name.en);
          if (curr.name.ar) keys.push(curr.name.ar);
        }

        keys.forEach(key => {
          if (key) {
            acc[key] = methodsObject;
            acc[key.toLowerCase()] = methodsObject;
          }
        });
        return acc;
      }, {});

      const allowedLinks = links({ permissions: parsedPermissions });
      if (allowedLinks.length > 0) {
        const firstLink = allowedLinks[0];
        if (firstLink.items && firstLink.items.length > 0) {
          destination = (firstLink.items[0] as any).url as string;
        } else if (firstLink.url) {
          destination = firstLink.url as string;
        }
      }
    }

    // Hard redirect so the browser sends a fresh request with the new cookie
    window.location.href = `/${locale}${destination}`;
  };

  return {
    locale,
    loginType,
    setLoginType,
    phoneNumber,
    setPhoneNumber,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
    notificationPermission,
    requestPermission
  };
}
