import {
  refreshOfflineQueueState,
  removeOfflineQueueRequest,
  retryOfflineQueueRequest,
  subscribeToOfflineQueueState,
  type OfflineQueueState,
  type QueuedRequest
} from "@/lib/offline-request-queue";
import { Loader2, RefreshCcw, Trash2, WifiOff } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialQueueState: OfflineQueueState = {
  pendingCount: 0,
  failedCount: 0,
  deadLetterCount: 0,
  isSyncing: false,
  requests: []
};

type QueueRequestRowProps = {
  request: QueuedRequest;
  isSyncing: boolean;
  isOnline: boolean;
};

function QueueRequestRow({ request, isSyncing, isOnline }: QueueRequestRowProps) {
  const {
    id,
    method,
    url,
    createdAt,
    attemptCount,
    status,
    lastAttemptAt,
    lastError,
    nextAttemptAt,
    deadLetteredAt
  } = request;

  const metaText =
    status === "dead-letter"
      ? `Dead-lettered after ${attemptCount} attempt(s)${deadLetteredAt ? ` on ${new Date(deadLetteredAt).toLocaleString()}` : ""}`
      : status === "retrying"
        ? `Attempted ${attemptCount} time(s)${nextAttemptAt ? ` • Next retry ${new Date(nextAttemptAt).toLocaleTimeString()}` : ""}`
        : `Queued ${new Date(createdAt).toLocaleString()}`;

  return (
    <div className="rounded border border-border p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className="truncate font-medium">
            {method} {url}
          </p>
          <p className="text-muted-foreground">{metaText}</p>
          {lastAttemptAt && (
            <p className="text-muted-foreground">
              Last attempt: {new Date(lastAttemptAt).toLocaleString()}
            </p>
          )}
          {lastError && <p className="text-xs text-red-600">Last error: {lastError}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-medium hover:bg-accent disabled:opacity-50"
            disabled={isSyncing || !isOnline}
            onClick={() => void retryOfflineQueueRequest(id)}
          >
            <RefreshCcw className="size-3" />
            {status === "dead-letter" ? "Retry manually" : "Retry now"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
            onClick={() => void removeOfflineQueueRequest(id)}
          >
            <Trash2 className="size-3" />
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueState, setQueueState] = useState<OfflineQueueState>(initialQueueState);
  const t = useTranslations();

  useEffect(() => {
    const syncConnectionStatus = () => {
      setIsOnline(navigator.onLine);
    };

    syncConnectionStatus();

    window.addEventListener("online", syncConnectionStatus);
    window.addEventListener("offline", syncConnectionStatus);
    window.addEventListener("focus", syncConnectionStatus);
    window.addEventListener("pageshow", syncConnectionStatus);
    document.addEventListener("visibilitychange", syncConnectionStatus);

    const unsubscribe = subscribeToOfflineQueueState(setQueueState);
    void refreshOfflineQueueState();

    return () => {
      unsubscribe();
      window.removeEventListener("online", syncConnectionStatus);
      window.removeEventListener("offline", syncConnectionStatus);
      window.removeEventListener("focus", syncConnectionStatus);
      window.removeEventListener("pageshow", syncConnectionStatus);
      document.removeEventListener("visibilitychange", syncConnectionStatus);
    };
  }, []);

  const { pendingRequests, retryingRequests, deadLetterRequests } = useMemo(() => {
    const pending = queueState.requests.filter(request => request.status === "pending");
    const retrying = queueState.requests.filter(request => request.status === "retrying");
    const deadLetter = queueState.requests.filter(request => request.status === "dead-letter");

    return {
      pendingRequests: pending,
      retryingRequests: retrying,
      deadLetterRequests: deadLetter
    };
  }, [queueState.requests]);

  const hasQueueItems = queueState.requests.length > 0;

  if (isOnline && !hasQueueItems) return null;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 py-2">
        <div className="w-full max-w-3xl rounded-md border border-border bg-background/95 p-3 text-xs shadow-md backdrop-blur-sm">
          {!isOnline && (
            <p className="mb-2 rounded bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white">
              No internet connection. Your changes will sync when the connection is back.
            </p>
          )}

          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded bg-slate-100 px-2 py-1 font-medium text-slate-800">
              Pending: {queueState.pendingCount}
            </span>
            <span className="rounded bg-amber-100 px-2 py-1 font-medium text-amber-800">
              Retrying: {queueState.failedCount}
            </span>
            <span className="rounded bg-rose-100 px-2 py-1 font-medium text-rose-800">
              Dead-letter: {queueState.deadLetterCount}
            </span>
            <span className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-800">
              Syncing: {queueState.isSyncing ? "Yes" : "No"}
            </span>
            {queueState.isSyncing && <Loader2 className="size-4 animate-spin text-blue-700" />}
          </div>

          {hasQueueItems && (
            <details>
              <summary className="cursor-pointer font-semibold">
                Queue details ({queueState.requests.length})
              </summary>

              <div className="mt-2 space-y-3">
                {pendingRequests.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-700">
                      Pending actions ({pendingRequests.length})
                    </p>
                    {pendingRequests.map(request => (
                      <QueueRequestRow
                        key={request.id}
                        isOnline={isOnline}
                        isSyncing={queueState.isSyncing}
                        request={request}
                      />
                    ))}
                  </div>
                )}

                {retryingRequests.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold text-amber-700">
                      Retrying actions ({retryingRequests.length})
                    </p>
                    {retryingRequests.map(request => (
                      <QueueRequestRow
                        key={request.id}
                        isOnline={isOnline}
                        isSyncing={queueState.isSyncing}
                        request={request}
                      />
                    ))}
                  </div>
                )}

                {deadLetterRequests.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold text-rose-700">
                      Dead-letter actions (manual retry or discard) ({deadLetterRequests.length})
                    </p>
                    {deadLetterRequests.map(request => (
                      <QueueRequestRow
                        key={request.id}
                        isOnline={isOnline}
                        isSyncing={queueState.isSyncing}
                        request={request}
                      />
                    ))}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>

      {!isOnline && (
        <div className="pointer-events-none fixed end-5 bottom-4 z-[100] px-4">
          <Alert
            variant="destructive"
            className="pointer-events-auto mx-auto flex max-w-xl items-end gap-3 rounded-xl border bg-background/95 p-4 shadow-lg"
          >
            <WifiOff className="h-4 w-4" />
            <div>
              <AlertTitle>{t("No internet connection")}</AlertTitle>
              <AlertDescription>
                {t("Your changes will be synced automatically when the connection is back")}.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </>
  );
}
