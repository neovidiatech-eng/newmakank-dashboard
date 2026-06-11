import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

const themes = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor }
];

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger asChild className="  text-primary">
        <Button variant="ghost" size="icon" className="relative group">
          {/* Sun Icon visible in light mode */}
          <Sun className="h-5 w-5 rotate-0 transition-transform dark:-rotate-90 dark:scale-0" />
          {/* Moon Icon visible in dark mode */}
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 rounded-md bg-white dark:bg-zinc-900 p-2 shadow-md border border-gray-200 dark:border-zinc-700">
        <div className="flex flex-col space-y-1">
          {themes.map(t => (
            <Button
              key={t.value}
              variant="ghost"
              className="w-full justify-start gap-2 rounded-sm hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-orange-700 dark:hover:text-teal-200"
              onClick={() => setTheme(t.value)}
            >
              <t.icon className="h-4 w-4" />
              <span className="text-sm">{t.label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
