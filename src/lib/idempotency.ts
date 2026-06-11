type ResponseSnapshot = {
  body: string;
  status: number;
  headers: [string, string][];
};

type IdempotencyStore = {
  completed: Map<string, ResponseSnapshot>;
  inFlight: Map<string, Promise<ResponseSnapshot>>;
};

const getStore = (): IdempotencyStore => {
  const globalStore = globalThis as typeof globalThis & {
    __offlineQueueIdempotencyStore?: IdempotencyStore;
  };

  if (!globalStore.__offlineQueueIdempotencyStore) {
    globalStore.__offlineQueueIdempotencyStore = {
      completed: new Map(),
      inFlight: new Map()
    };
  }

  return globalStore.__offlineQueueIdempotencyStore;
};

const snapshotResponse = async (response: Response): Promise<ResponseSnapshot> => ({
  body: await response.text(),
  status: response.status,
  headers: Array.from(response.headers.entries())
});

const responseFromSnapshot = (snapshot: ResponseSnapshot, replayed: boolean) => {
  const headers = new Headers(snapshot.headers);
  if (replayed) {
    headers.set("X-Idempotency-Replayed", "true");
  }

  return new Response(snapshot.body, {
    status: snapshot.status,
    headers
  });
};

export const withIdempotency = async (
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> => {
  const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();
  if (!idempotencyKey) {
    return handler();
  }

  const store = getStore();
  const completedSnapshot = store.completed.get(idempotencyKey);
  if (completedSnapshot) {
    return responseFromSnapshot(completedSnapshot, true);
  }

  const inFlightSnapshotPromise = store.inFlight.get(idempotencyKey);
  if (inFlightSnapshotPromise) {
    const snapshot = await inFlightSnapshotPromise;
    return responseFromSnapshot(snapshot, true);
  }

  const inFlightPromise = (async () => {
    const response = await handler();
    const snapshot = await snapshotResponse(response.clone());

    if (response.ok) {
      store.completed.set(idempotencyKey, snapshot);
    }

    return snapshot;
  })();

  store.inFlight.set(idempotencyKey, inFlightPromise);

  try {
    const snapshot = await inFlightPromise;
    return responseFromSnapshot(snapshot, false);
  } finally {
    store.inFlight.delete(idempotencyKey);
  }
};
