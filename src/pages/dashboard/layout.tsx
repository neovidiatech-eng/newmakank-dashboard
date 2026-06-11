import { AppSidebar } from "@/components/app-sidebar";
import LanguageSwitcher from "@/components/language-switcher";
import PageTransitionWrapper from "@/components/layouts/PageTransitionWrapper";
import LogoutConfirmButton from "@/components/layouts/header/components/LogoutConfirmButton";
import ThemeSwitcher from "@/components/theme-switcher";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function RoutesLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  // const data = await fetchHelper({
  //   endPoint: ["profile"]
  // });
  const { locale } = await params;
  return (
    <SidebarProvider>
      <AppSidebar side={locale == "ar" ? "right" : "left"} />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 w-full flex-row-reverse me-3">
            <LogoutConfirmButton />
            <LanguageSwitcher />

            <ThemeSwitcher />
          </div>
        </header>
        <div className=" p-5 md:p-10">
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
