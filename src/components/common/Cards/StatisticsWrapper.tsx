import { cn } from "@/lib/utils";

export default function StatisticsWrapper({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `grid mb-4 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-4 px-2 `,
        className
      )}
    >
      {children}
    </div>
  );
}
