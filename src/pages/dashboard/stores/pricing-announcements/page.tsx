import CustomHeader from "@/components/layouts/header/CustomHeader";
import StorePricingAnnouncementsManager from "@/components/pages/_stores/pricing-announcements/StorePricingAnnouncementsManager";

export default async function page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <StorePricingAnnouncementsManager />
    </>
  );
}
