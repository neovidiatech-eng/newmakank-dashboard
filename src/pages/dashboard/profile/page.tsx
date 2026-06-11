import { fetchHelper } from "@/api/fetch";
import ProfileFormPage from "@/components/pages/_profile/profileForm.page";

export default async function ProfilePage() {
  const { data } = await fetchHelper({
    endPoint: ["profile"]
  });
  console.log(data, "data");
  return (
    <div className="">
      <ProfileFormPage data={data.user} />
    </div>
  );
}
