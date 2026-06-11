import { fetchHelper } from "@/api/fetch";
import ResetPasswordForm from "@/components/pages/(auth)/forget-password/forget-password-form";

const page = async (): Promise<JSX.Element> => {
  const data = await fetchHelper({
    endPoint: ['roles'],
    isLocalized: true,
    cache: "force-cache"
  });
  return (
    <div className="items-center justify-center mt-72">
      <ResetPasswordForm roles={data?.data} />
    </div>
  );
};

export default page;
