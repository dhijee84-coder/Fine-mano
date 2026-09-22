import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/lib/store";

export function HydrateGate({ children }: { children: ReactNode }) {
  useEffect(() => {
    const persist = useAppStore.persist;
    if (!persist) {
      useAppStore.getState().setHasHydrated(true);
      return;
    }
    let cancelled = false;
    const mark = () => {
      if (!cancelled) useAppStore.getState().setHasHydrated(true);
    };
    const unsub = persist.onFinishHydration(mark);
    void Promise.resolve(persist.rehydrate()).then(mark);
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);
  return children;
}
