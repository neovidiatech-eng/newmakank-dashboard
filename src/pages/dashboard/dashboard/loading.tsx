import { Card, CardContent, CardHeader } from "@/components/ui/card";

const pulse = "animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-800";

const metricCards = Array.from({ length: 6 });
const tableRows = Array.from({ length: 7 });

export default function DashboardLoading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className={`${pulse} h-4 w-28`} />
          <div className={`${pulse} h-8 w-64 max-w-full`} />
        </div>
        <div className="flex gap-2">
          <div className={`${pulse} h-10 w-24`} />
          <div className={`${pulse} h-10 w-10`} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((_, index) => (
          <Card key={index} className="overflow-hidden border-gray-200/80 bg-white dark:border-gray-800 dark:bg-slate-950">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className={`${pulse} h-3 w-24`} />
                  <div className={`${pulse} h-7 w-16`} />
                  <div className={`${pulse} h-2 w-32`} />
                </div>
                <div className={`${pulse} h-11 w-11 rounded-full`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-gray-200/80 bg-white dark:border-gray-800 dark:bg-slate-950">
        <CardHeader className="border-b border-gray-200/80 dark:border-gray-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className={`${pulse} h-5 w-44`} />
              <div className={`${pulse} h-3 w-72 max-w-full`} />
            </div>
            <div className={`${pulse} h-9 w-28`} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-4 border-b border-gray-200/80 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-slate-900">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={`${pulse} h-3 w-full`} />
            ))}
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableRows.map((_, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 px-6 py-4">
                {Array.from({ length: 5 }).map((__, cellIndex) => (
                  <div key={cellIndex} className={`${pulse} h-4 w-full`} />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
