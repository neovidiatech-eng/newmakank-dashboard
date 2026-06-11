/* eslint-disable no-console */
import { fetchHelper } from "@/api/fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { onMessageListener } from "@/utils/firebase/firebaseMessaging";
import * as Popover from "@radix-ui/react-popover";
import { Bell } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import Image from "@/lib/Image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Notification = {
  id: ID;
  title: string;
  body: string;
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  console.log(notifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const t = useTranslations();
  const { theme } = useTheme();
  // Load notifications from API
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse<Notification[]> = await fetchHelper({
        endPoint: ["notifications"],
        isLocalized: true
      });

      if (response?.success && response?.data) {
        // setNotifications([]);
        setNotifications(response?.data);
        // const unreadNotifications = response?.data?.filter((n: Notification) => !n.read).length;
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for Firebase messages
  useEffect(() => {
    const setupMessageListener = () => {
      onMessageListener({
        messagingPayload: payload => {
          // Toast notification
          toast.info(payload.notification?.title, {
            description: payload.notification?.body
          });
          // Add notification to list if it matches our structure
          if (payload.data && payload.notification) {
            try {
              const newNotification = {
                id: parseInt(payload.data?.id),
                title: payload.notification.title || "New Notification",
                body: payload.notification.body || ""
              };
              // Add the new notification to the list
              setNotifications(prev => [newNotification, ...prev]);
              setUnreadCount(count => count + 1);
            } catch (error) {
              console.error("Error processing notification payload:", error);
            }
          }
          // Refresh notifications from server (optional)
          fetchNotifications();
        }
      });
    };
    setupMessageListener();
  }, []);

  const markAllAsRead = async () => {
    setIsMarkingAllRead(true);
    try {
      const response: ApiResponse<unknown> = await fetchHelper({
        endPoint: ["readAllNotifications"],
        method: "PATCH"
      });

      if (response?.success) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
          <Bell
            className={cn("size-5", {
              "text-muted-foreground": !unreadCount,
              "text-primary": unreadCount > 0,
              "dark:text-primary": theme === "dark" && unreadCount > 0
            })}
          />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center bg-red-500 px-1.5"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className="bg-popover text-popover-foreground z-20 w-screen max-w-[380px] rounded-md border p-0 shadow-md outline-none"
          onInteractOutside={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between border-b p-4">
            <h4 className="font-medium">{t("Notifications")}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={isLoading || isMarkingAllRead || notifications.length === 0}
            >
              {isMarkingAllRead ? t("Marking...") : t("Mark all as read")}
            </Button>
          </div>
          <ScrollArea className="z-20 h-[60vh] max-h-[400px]">
            {isLoading ? (
              <div className="flex h-20 items-center justify-center">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="flex flex-col p-1">
                {notifications.map(notification => (
                  <button
                    key={notification.id}
                    className={`hover:bg-accent flex cursor-pointer flex-col rounded-md border-b p-4 text-start`}
                  // onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <h5 className="text-primary font-semibold">{notification.title}</h5>
                      {/* <span className="text-muted-foreground text-xs">
                        {formatDate(notification.createdAt)} 
                      </span> */}
                    </div>
                    <p className="mt-1 text-sm">{notification.body}</p>
                    {/* {!notification.read && (
                      <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-500" />
                    )} */}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center">
                <Image
                  width={32}
                  height={32}
                  src="/logo.png"
                  alt="No notifications"
                  className="text-muted-foreground mb-2 h-8 w-8"
                />
                <p className="text-muted-foreground text-center">{t("No notifications yet")}</p>
              </div>
            )}
          </ScrollArea>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
