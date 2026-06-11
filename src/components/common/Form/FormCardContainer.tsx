import { Card } from "@/components/ui/card";

export default function FormCardContainer({
  width,
  children,
  index
}: {
  width: number;
  children: React.ReactNode;
  index: number | string;
}) {
  return (
    <Card
      key={index}
      className={`${index != "default" && "border border-border/60"} h-full rounded-2xl p-5 shadow-sm ${width == 1
          ? "lg:col-span-1 md:col-span-2 col-span-6"
          : width == 2
            ? "lg:col-span-2 md:col-span-3 col-span-6"
            : width == 3
              ? "lg:col-span-3 md:col-span-3 col-span-6"
              : width == 4
                ? "lg:col-span-4 md:col-span-3 col-span-6"
                : width == 5
                  ? "lg:col-span-5 md:col-span-6 col-span-6"
                  : "lg:col-span-6 md:col-span-6 col-span-6"
        }`}
    >
      <div className="grid grid-cols-6 relative gap-5">{children}</div>
    </Card>
  );
}
