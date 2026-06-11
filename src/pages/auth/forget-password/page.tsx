import { fetchHelper } from "@/api/fetch";
import ResetPasswordForm from "@/components/pages/(auth)/forget-password/forget-password-form";

async function page() {
  const data = await fetchHelper({
    endPoint: ['roles'],
    isLocalized: true,
    locale: "en",
    cache: "force-cache"
  });
  return (
    <div className="items-center justify-center mt-10 container">
      <ResetPasswordForm roles={data?.data} />
    </div>
  );
}

export default page;
