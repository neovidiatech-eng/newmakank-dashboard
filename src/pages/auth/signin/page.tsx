import { LoginForm } from "@/components/pages/(auth)/login/login-form";

export default function Page(): JSX.Element {

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-muted/60">
      <LoginForm />
    </div>
  );
}
