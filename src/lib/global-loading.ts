import { useSyncExternalStore } from "react";

let loading = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(listener => listener());
}

export function startLoading() {
  loading = true;
  emit();
}

export function endLoading() {
  loading = false;
  emit();
}

export function useGlobalLoading() {
  return useSyncExternalStore(
    listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => loading,
    () => false
  );
}
