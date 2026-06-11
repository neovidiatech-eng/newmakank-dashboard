import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@/lib/navigation";
import Image from "@/lib/Image";

export function VersionSwitcher(): JSX.Element {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {" "}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="xlg">
              <div className="flex justify-center items-center w-full rounded-lg text-foreground">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    width={90}
                    height={100}
                    alt="Logo"
                    priority
                    className="transition-transform hover:scale-105"
                  />
                </Link>
              </div>
              {/* <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-lg ">{t('Dashboard')}</span>
                <span className="">v{selectedVersion}</span>
              </div> */}
              {/* <ChevronsUpDown className="ml-auto" /> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}m
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent> */}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
