/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { removeToken } from "@/api/actions";
import { routes } from "@/utils/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { ChevronUp, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import Link from "@/lib/Link";
import { FaUserFriends } from "react-icons/fa";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
const API_IMG_URL = import.meta.env.VITE_API_IMG_URL as string;
// ...existing code...

export const SideBarFooter = ({
  user
}: {
  user: {
    name: string;
    email: string;
    image?: string;
    id: string;
  };
}): JSX.Element => {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors duration-150">
                <Image
                  className="rounded-full border border-gray-300 shadow-sm"
                  src={`${API_IMG_URL + user.image}`}
                  alt={user.name}
                  width={30}
                  height={30}
                  objectFit="cover"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  {/* Uncomment below if you wish to show user email */}
                  {/* <p className="text-xs text-gray-500">{user.email}</p> */}
                </div>
                <ChevronUp className="ml-auto text-gray-600" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56 bg-white rounded-md shadow-lg p-2 border border-gray-200"
            >
              <DropdownMenuItem className="rounded-md hover:bg-gray-100">
                <Link
                  href={`/${locale}${routes.editProfile}`}
                  className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700"
                >
                  <FaUserFriends className="mr-2 text-gray-600" />
                  {t("My Account")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md hover:bg-gray-100">
                <button
                  onClick={async () => {
                    await removeToken();
                  }}
                  className="flex w-full items-center px-3 py-2 text-sm font-semibold text-gray-700"
                >
                  <LogOut className="mr-2 h-4 w-4 text-gray-600" />
                  {t("Logout")}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
};
