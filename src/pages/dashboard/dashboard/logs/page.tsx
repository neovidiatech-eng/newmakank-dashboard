import { fetchHelper } from "@/api/fetch";
import { TablePagination } from "@/components/common/table/tableHelperComponents/TablePagination";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link } from "@/lib/navigation";
import { AlertCircle, Clock, LogIn, LogOut, PencilLine, UserRound } from "lucide-react";
import { getLocale, getTranslations } from "@/lib/i18n";

type LogsPageSearchParams = {
  page?: string;
  limit?: string;
  action?: string;
};

type ActivityLogRecord = {
  id?: string | number;
  action?: string | null;
  details?: string | null;
  description?: string | null;
  message?: string | null;
  createdAt?: string | null;
  time?: string | null;
  user?: {
    personName?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  admin?: {
    personName?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  actor?: {
    personName?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  User?: {
    personName?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  Admin?: {
    personName?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  Actor?: {
    personName?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  personName?: string | null;
  role?: string | null;
  email?: string | null;
};

type LogsPagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

function normalizeAction(action?: string | null) {
  if (!action) return "UNKNOWN";
  return action.toUpperCase();
}

function getActionPresentation(action?: string | null) {
  const normalizedAction = normalizeAction(action);

  if (normalizedAction.includes("LOGIN")) {
    return {
      icon: LogIn,
      variant: "success" as const
    };
  }

  if (normalizedAction.includes("LOGOUT")) {
    return {
      icon: LogOut,
      variant: "muted" as const
    };
  }

  if (normalizedAction.includes("BREAK") || normalizedAction.includes("AFK")) {
    return {
      icon: AlertCircle,
      variant: "warning" as const
    };
  }

  return {
    icon: PencilLine,
    variant: "info" as const
  };
}

function formatActionLabel(action?: string | null) {
  const normalizedAction = normalizeAction(action);
  return normalizedAction.replace(/_/g, " ");
}

function getActor(log: ActivityLogRecord) {
  const actor =
    log.actor ??
    log.Actor ??
    log.admin ??
    log.Admin ??
    log.user ??
    log.User;

  return {
    name: actor?.personName ?? log.personName ?? (log as any).name ?? "—",
    role: actor?.role ?? log.role ?? "—",
    email: actor?.email ?? log.email ?? ""
  };
}

function getDetails(log: ActivityLogRecord) {
  return log.details ?? log.description ?? log.message ?? formatActionLabel(log.action);
}

function getTimeLabel(log: ActivityLogRecord, locale: string) {
  const value = log.createdAt ?? log.time;
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
}

function getActionFilterUrl(action: string | null, limit?: string) {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", limit || "10");

  if (action) {
    params.set("action", action);
  }

  return `?${params.toString()}`;
}

export default async function ActivityLogsPage({
  searchParams
}: {
  searchParams: Promise<LogsPageSearchParams>;
}): Promise<JSX.Element> {
  const t = await getTranslations();
  const locale = await getLocale();
  const resolvedSearchParams = await searchParams;
  const response = await fetchHelper<ActivityLogRecord[]>({
    endPoint: ["logs"],
    method: "GET",
    params: resolvedSearchParams,
    redirectOnUnauthorized: false
  });

  const logs = response?.data ?? [];
  const pagination = (response as ApiResponse<ActivityLogRecord[]> & {
    pagination?: LogsPagination;
  })?.pagination;
  const total = pagination?.total ?? response?.total ?? logs.length;
  const activeAction = normalizeAction(resolvedSearchParams?.action);
  const actionFilters = [
    { label: t("All"), value: null },
    { label: "LOGIN", value: "LOGIN" },
    { label: "LOGOUT", value: "LOGOUT" }
  ];

  return (
    <>
      <CustomHeader />
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("activityLogs")}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("activityLogsDescription")}
          </p>
        </div>

        <Card className="overflow-hidden border-gray-200/80 bg-white dark:border-gray-800 dark:bg-slate-950">
          <CardHeader className="gap-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </span>
                  {t("activityLogTable")}
                </CardTitle>
                <CardDescription className="mt-2">
                  {t("activityLogTableDescription")}
                </CardDescription>
              </div>
              <Badge variant="info" className="rounded-full">
                {t("total")}: {total}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {actionFilters.map(filter => {
                const isActive = filter.value ? activeAction === filter.value : !resolvedSearchParams?.action;

                return (
                  <Button
                    key={filter.value ?? "all"}
                    asChild
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                  >
                    <Link href={getActionFilterUrl(filter.value, resolvedSearchParams?.limit)}>
                      {filter.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="text-center">{t("personName")}</TableHead>
                  <TableHead className="text-center">{t("role")}</TableHead>
                  <TableHead className="text-center">{t("activityAction")}</TableHead>
                  <TableHead className="text-center">{t("activityDetails")}</TableHead>
                  <TableHead className="text-center">{t("activityTime")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      {t("No Data")}
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => {
                    const actor = getActor(log);
                    const actionPresentation = getActionPresentation(log.action);
                    const ActionIcon = actionPresentation.icon;

                    return (
                      <TableRow
                        key={String(log.id ?? `${log.action ?? "log"}-${log.createdAt ?? log.time ?? index}`)}
                        className="hover:bg-gray-50 dark:hover:bg-slate-900/50"
                      >
                        <TableCell className="text-center">
                          <div className="inline-flex flex-col items-center gap-1">
                            <div className="inline-flex items-center gap-2 font-medium">
                              <UserRound className="h-4 w-4 text-gray-400" />
                              {actor.name}
                            </div>
                            {actor.email ? (
                              <span className="text-xs text-muted-foreground">{actor.email}</span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{actor.role}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={actionPresentation.variant}>
                            <ActionIcon className="h-3.5 text-black  w-3.5" />
                            <span className="text-black ">{`${formatActionLabel(log.action)}`}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-gray-600 dark:text-gray-300">
                          {getDetails(log)}
                        </TableCell>
                        <TableCell className="text-center text-gray-500 dark:text-gray-400">
                          {getTimeLabel(log, locale)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>

          {total > 0 ? (
            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-950 p-6">
              <TablePagination pagination={{ total }} />
            </div>
          ) : null}
        </Card>
      </div>
    </>
  );
}
