import LanguageDropdown from "@/components/language-switcher";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useLocale } from "@/lib/i18n";
import Link from "@/lib/Link";

export function HeaderActions({ hasChatPermission }: { hasChatPermission: boolean }) {
  const locale = useLocale();
  return (
    <div className="flex items-center ml-auto space-x-4">
      {hasChatPermission && (
        <Link
          href={`/${locale}/chat`}
          className="inline-flex items-center justify-center rounded-md w-8 h-8 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ChatBubbleIcon className="w-4 h-4" />
        </Link>
      )}
      <LanguageDropdown />
      {/* <UserDropdown /> */}
      {/* <SettingsPopover /> */}
    </div>
  );
}
