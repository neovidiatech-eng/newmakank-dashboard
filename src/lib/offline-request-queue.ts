export type QueueStatus = "pending" | "retrying" | "dead-letter";

export type QueuedRequest = {
  id: string;
  idempotencyKey: string;
  url: string;
  method: string;
  headers: [string, string][];
  body?: string;
  createdAt: number;
  status: QueueStatus;
  attemptCount: number;
  lastAttemptAt?: number;
  lastError?: string;
  nextAttemptAt?: number;
  deadLetteredAt?: number;
};

export type OfflineQueueState = {
  pendingCount: number;
  failedCount: number;
  deadLetterCount: number;
  isSyncing: boolean;
  requests: QueuedRequest[];
};

type QueueStateListener = (state: OfflineQueueState) => void;
export const OFFLINE_QUEUE_AUTH_REQUIRED_EVENT = "offline-queue:auth-required";
export const OFFLINE_QUEUE_AUTH_RESOLVED_EVENT = "offline-queue:auth-resolved";

const DB_NAME = "offline-request-queue-db";
const STORE_NAME = "requests";
const DB_VERSION = 2;
const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const MAX_REPLAY_ATTEMPTS = 5;
const INITIAL_BACKOFF_MS = 2_000;
const MAX_BACKOFF_MS = 60_000;

const queueStateListeners = new Set<QueueStateListener>();
let queueState: OfflineQueueState = {
  pendingCount: 0,
  failedCount: 0,
  deadLetterCount: 0,
  isSyncing: false,
  requests: []
};

const isBrowser = () => typeof window !== "undefined";

const isQueueableRequest = (input: RequestInfo | URL, init?: RequestInit) => {
  const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  if (!MUTATION_METHODS.has(method)) return false;

  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const parsedUrl = new URL(url, window.location.origin);

  return parsedUrl.origin === window.location.origin && parsedUrl.pathname.startsWith("/api");
};

const normalizeQueuedRequest = (
  row: Partial<QueuedRequest> & {
    id: string;
    createdAt: number;
    method: string;
    url: string;
    headers: [string, string][];
  }
): QueuedRequest => {
  const legacyAttemptCount = (row as { failedAttempts?: number }).failedAttempts ?? 0;
  const attemptCount = row.attemptCount ?? legacyAttemptCount;
  const isDeadLetter = row.status === "dead-letter";

  return {
    id: row.id,
    idempotencyKey: row.idempotencyKey ?? row.id,
    createdAt: row.createdAt,
    method: row.method,
    url: row.url,
    headers: row.headers,
    body: row.body,
    status: row.status ?? "pending",
    attemptCount,
    lastAttemptAt: row.lastAttemptAt,
    lastError: row.lastError,
    nextAttemptAt: isDeadLetter ? undefined : row.nextAttemptAt,
    deadLetteredAt: isDeadLetter ? (row.deadLetteredAt ?? Date.now()) : undefined
  };
};

const openQueueDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
  });
};

const getQueuedRequests = async (): Promise<QueuedRequest[]> => {
  if (!isBrowser()) return [];
  const db = await openQueueDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const rows = ((request.result as QueuedRequest[]) ?? []).map(row =>
        normalizeQueuedRequest(row)
      );
      resolve(rows.sort((a, b) => a.createdAt - b.createdAt));
    };
    request.onerror = () => reject(request.error ?? new Error("Failed to read queued requests"));
    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
    tx.onabort = () => db.close();
  });
};

const putQueuedRequest = async (requestToQueue: QueuedRequest) => {
  if (!isBrowser()) return;
  const db = await openQueueDatabase();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(requestToQueue);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("Failed to write queued request"));
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error ?? new Error("Queue transaction aborted"));
    };
  });
};

const removeQueuedRequest = async (requestId: string) => {
  if (!isBrowser()) return;
  const db = await openQueueDatabase();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(requestId);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("Failed to remove queued request"));
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error ?? new Error("Delete transaction aborted"));
    };
  });
};

const notifyQueueStateListeners = () => {
  for (const listener of queueStateListeners) {
    listener(queueState);
  }
};

const setQueueState = (nextState: Partial<OfflineQueueState>) => {
  queueState = {
    ...queueState,
    ...nextState
  };
  notifyQueueStateListeners();
};

const hydrateQueueState = async () => {
  const requests = await getQueuedRequests();
  const failedCount = requests.filter(request => request.status === "retrying").length;
  const deadLetterCount = requests.filter(request => request.status === "dead-letter").length;

  setQueueState({
    requests,
    failedCount,
    deadLetterCount,
    pendingCount: requests.length - failedCount - deadLetterCount
  });

  return requests;
};

const buildQueuedRequest = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<QueuedRequest> => {
  const request = input instanceof Request ? input : new Request(input, init);
  const method = request.method.toUpperCase();
  const headers = Array.from(request.headers.entries());
  const body = method === "GET" || method === "HEAD" ? undefined : await request.clone().text();

  const idempotencyKey =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const normalizedHeaders = new Headers(headers);
  normalizedHeaders.set("Idempotency-Key", idempotencyKey);

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    idempotencyKey,
    url: request.url,
    method,
    headers: Array.from(normalizedHeaders.entries()),
    body,
    createdAt: Date.now(),
    status: "pending",
    attemptCount: 0
  };
};

const replayQueuedRequest = async (queuedRequest: QueuedRequest) => {
  const headers = new Headers(queuedRequest.headers);
  headers.set("Idempotency-Key", queuedRequest.idempotencyKey);

  return fetch(queuedRequest.url, {
    method: queuedRequest.method,
    headers,
    body: queuedRequest.body
  });
};

const getBackoffMs = (attemptCount: number) => {
  const exponentialDelay = INITIAL_BACKOFF_MS * 2 ** Math.max(0, attemptCount - 1);
  return Math.min(MAX_BACKOFF_MS, exponentialDelay);
};

const markReplayFailure = async (request: QueuedRequest, errorMessage: string) => {
  const now = Date.now();
  const nextAttemptCount = request.attemptCount + 1;

  if (nextAttemptCount >= MAX_REPLAY_ATTEMPTS) {
    await putQueuedRequest({
      ...request,
      status: "dead-letter",
      attemptCount: nextAttemptCount,
      lastAttemptAt: now,
      lastError: errorMessage,
      deadLetteredAt: now,
      nextAttemptAt: undefined
    });
    return;
  }

  const backoffMs = getBackoffMs(nextAttemptCount);

  await putQueuedRequest({
    ...request,
    status: "retrying",
    attemptCount: nextAttemptCount,
    lastAttemptAt: now,
    lastError: errorMessage,
    nextAttemptAt: now + backoffMs,
    deadLetteredAt: undefined
  });
};

export const installOfflineRequestQueue = () => {
  if (!isBrowser()) return () => {};

  const nativeFetch = window.fetch.bind(window);
  let isReplayPausedForAuth = false;
  let isSyncInProgress = false;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (!isQueueableRequest(input, init)) {
      return nativeFetch(input, init);
    }

    if (!navigator.onLine) {
      const queuedRequest = await buildQueuedRequest(input, init);
      await putQueuedRequest(queuedRequest);
      await hydrateQueueState();

      return new Response(
        JSON.stringify({
          success: true,
          queued: true,
          message: "Request queued offline and will sync when internet is available."
        }),
        {
          status: 202,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return nativeFetch(input, init);
  };

  const syncQueue = async () => {
    if (!navigator.onLine || isReplayPausedForAuth || isSyncInProgress) return;

    isSyncInProgress = true;
    setQueueState({ isSyncing: true });

    try {
      const queue = await getQueuedRequests();
      if (queue.length === 0) {
        await hydrateQueueState();
        return;
      }

      const now = Date.now();

      for (const queuedRequest of queue) {
        if (queuedRequest.status === "dead-letter") continue;
        if (queuedRequest.nextAttemptAt && queuedRequest.nextAttemptAt > now) continue;

        try {
          const replayResponse = await replayQueuedRequest(queuedRequest);

          if (replayResponse.status === 401 || replayResponse.status === 403) {
            isReplayPausedForAuth = true;
            window.dispatchEvent(
              new CustomEvent(OFFLINE_QUEUE_AUTH_REQUIRED_EVENT, {
                detail: {
                  status: replayResponse.status,
                  queuedRequestId: queuedRequest.id
                }
              })
            );
            break;
          }

          if (!replayResponse.ok) {
            throw new Error(`Replay failed with status ${replayResponse.status}`);
          }

          await removeQueuedRequest(queuedRequest.id);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed while replaying request";
          await markReplayFailure(queuedRequest, message);
        }
      }

      await hydrateQueueState();
    } finally {
      isSyncInProgress = false;
      setQueueState({ isSyncing: false });
    }
  };

  const onOnline = () => {
    void syncQueue();
  };

  const onAuthResolved = () => {
    isReplayPausedForAuth = false;
    void syncQueue();
  };

  window.addEventListener("online", onOnline);
  window.addEventListener(OFFLINE_QUEUE_AUTH_RESOLVED_EVENT, onAuthResolved);
  void hydrateQueueState();
  void syncQueue();

  return () => {
    window.fetch = nativeFetch;
    window.removeEventListener("online", onOnline);
    window.removeEventListener(OFFLINE_QUEUE_AUTH_RESOLVED_EVENT, onAuthResolved);
  };
};

export const subscribeToOfflineQueueState = (listener: QueueStateListener) => {
  queueStateListeners.add(listener);
  listener(queueState);

  return () => {
    queueStateListeners.delete(listener);
  };
};

export const refreshOfflineQueueState = async () => {
  await hydrateQueueState();
};

export const retryOfflineQueueRequest = async (requestId: string) => {
  const queue = await getQueuedRequests();
  const request = queue.find(queuedRequest => queuedRequest.id === requestId);
  if (!request) return;

  setQueueState({ isSyncing: true });

  try {
    if (!navigator.onLine) {
      throw new Error("Cannot retry while offline");
    }

    const replayResponse = await replayQueuedRequest(request);

    if (!replayResponse.ok) {
      throw new Error(`Replay failed with status ${replayResponse.status}`);
    }

    await removeQueuedRequest(request.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Retry failed";

    if (request.status === "dead-letter") {
      await putQueuedRequest({
        ...request,
        lastAttemptAt: Date.now(),
        lastError: message
      });
    } else {
      await markReplayFailure(request, message);
    }
  } finally {
    await hydrateQueueState();
    setQueueState({ isSyncing: false });
  }
};

export const removeOfflineQueueRequest = async (requestId: string) => {
  await removeQueuedRequest(requestId);
  await hydrateQueueState();
};
