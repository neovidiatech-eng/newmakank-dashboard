import CustomHeader from "@/components/layouts/header/CustomHeader";
import SendNotificationForm from "@/components/pages/_notifications/SendNotificationForm";

export default function NotificationsPage() {
  return (
    <>
      <CustomHeader />
      <div className="container mx-auto p-6">
        <SendNotificationForm />
      </div>
    </>
  );
}
