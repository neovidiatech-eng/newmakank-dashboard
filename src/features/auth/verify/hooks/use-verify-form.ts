import { getToken, setRefreshToken, setToken } from "@/api/actions";
import { fetchHelper } from "@/api/fetch";
import { useRouter } from "@/lib/navigation";
import { REDIRECT_AFTER_AUTH } from "@/utils/config";
import { useState } from "react";
import { toast } from "sonner";

export function useVerifyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);

    const res = await fetchHelper({
      endPoint: ["verifyAccount"],
      method: "POST",
      headers: {
        "X-Token": await getToken() as string
      },
      body: { otp }
    });

    if (!res.success) {
      setIsLoading(false);
      toast.error(res.result?.message || res.message);
      return;
    }

    toast.success(res?.message || "Account verified successfully");
    
    // If the verification returns new tokens, store them
    if (res?.data?.AccessToken) {
        await setToken(res?.data?.AccessToken);
    }
    if (res?.data?.RefreshToken) {
        await setRefreshToken(res?.data?.RefreshToken);
    }

    router.push(res?.data?.user?.roleId === "ADMIN" ? REDIRECT_AFTER_AUTH : "/dashboard");
  };

  return {
    otp,
    setOtp,
    isLoading,
    onSubmit
  };
}
