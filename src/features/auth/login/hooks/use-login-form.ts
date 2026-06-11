import { setRefreshToken, setToken } from "@/api/actions";
import { fetchHelper } from "@/api/fetch";
import { useRouter } from "@/lib/navigation";
import { REDIRECT_AFTER_AUTH } from "@/utils/config";
import { useLocale } from "@/lib/i18n";
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

    // Hard redirect so the browser sends a fresh request with the new cookie
    // This avoids Next.js router cache racing ahead before the cookie is set
    const destination = res?.data?.user?.roleId === "ADMIN" ? REDIRECT_AFTER_AUTH : "/dashboard";
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
