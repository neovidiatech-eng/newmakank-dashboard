import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Settings, User } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import Link from "@/lib/Link";
import LogoutButton from "./LogoutButton";
import { ImageCell } from "./common/table/columns/img-cell";
import { UpdatePasswordForm } from "./pages/(auth)/update-password/update-password-form";

const UserDropdown = ({
  user,
  roleId,
  compact = false
}: {
  roleId?: RoleKey;
  user: {
    name: string;
    image: string;
    email: string;
  };
  compact?: boolean;
}) => {
  const currentLocale = useLocale();
  const t = useTranslations();

  const showDetails = !compact;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-haspopup="true"
          aria-expanded="false"
          className={cn(
            "flex items-center rounded-xl bg-white dark:bg-background shadow-sm hover:shadow-lg hover:bg-primary/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 active:scale-95 border border-transparent hover:border-primary/30",
            compact
              ? "gap-1 px-0 border-0 y-1 w-auto justify-center"
              : "gap-3 px-2 py-1.5 w-full"
          )}
        >
          {user?.image ? (
            <span className="relative inline-block">
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-primary/30 to-primary/10 blur-sm"></span>
              <ImageCell
                cell={user.image}
                openImgWhenClickType="none"
                className={cn(
                  "rounded-full object-cover border-2 border-primary/40 shadow-md relative z-10",
                  compact ? "w-8 h-8" : "w-10 h-10"
                )}
              />
            </span>
          ) : (
            <div
              className={cn("rounded-full bg-primary flex items-center justify-center border-2 border-primary/20 shadow-md",
                compact ? "w-8 h-8" : "w-10 h-10"
              )}
            >
              <User className={cn(compact ? "w-4 h-4" : "w-5 h-5", "text-primary")} />
            </div>
          )}
          {showDetails ? (
            <>
              <div className="text-left space-y-0.5 max-w-[120px]">
                <p className="text-base font-semibold text-foreground leading-tight truncate">
                  {user?.name}
                </p>
                <p
                  className="text-xs font-medium text-muted-foreground truncate opacity-80"
                  style={{ maxWidth: "120px" }}
                >
                  {user?.email}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 ml-1 text-muted-foreground group-hover:text-primary transition-colors" />
            </>
          ) : (
            <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        className="w-64 bg-background border border-border rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-1 p-0 overflow-hidden"
      >
        <div className="flex flex-col gap-1 px-2 py-3">
          <Link
            href={`/${currentLocale}/profile`}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground rounded-lg hover:bg-primary/10 hover:text-primary transition-colors group"
          >
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            {t("profile")}
          </Link>
          {roleId == "Student" ? (
            <div className="px-1">
            </div>
          ) : null}
          <div className="border-t border-border my-2" />
          <div className="px-1">
            <UpdatePasswordForm />
          </div>
          <div className="px-1">
            <LogoutButton />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserDropdown;
