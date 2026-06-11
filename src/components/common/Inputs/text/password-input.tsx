import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

export default function PasswordInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative group">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-12 py-2 h-12 border-input bg-background/50 focus:bg-background focus:border-primary transition-all duration-200 rounded-lg"
          {...props}
        />
        <Lock className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute end-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>{" "}
    </>
  );
}
