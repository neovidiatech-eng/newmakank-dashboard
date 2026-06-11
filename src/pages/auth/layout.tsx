import LanguageSwitcher from "@/components/language-switcher";
import PageTransitionWrapper from "@/components/layouts/PageTransitionWrapper";
import ThemeSwitcher from "@/components/theme-switcher";

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <header className=" top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <PageTransitionWrapper>
        <div>{children}</div>
      </PageTransitionWrapper>
    </div>
  );
}
