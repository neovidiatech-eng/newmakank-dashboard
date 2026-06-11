import { VerifyForm } from "@/components/pages/(auth)/verify/verify-form";

export default async function Page(): Promise<JSX.Element> {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-muted/60">
      <VerifyForm />
    </div>
  );
}
