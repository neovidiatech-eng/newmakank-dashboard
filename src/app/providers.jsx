import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { queryClient } from "@/lib/queryClient";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          {children}
          <Toaster duration={8000} richColors />
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
