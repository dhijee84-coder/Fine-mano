import { useMemo } from "react";
import { useAppStore } from "./store";
import type { User } from "./types";
import type { ModuleKey } from "./permissions";

export function useSessionUser(): User | null {
  const sessionUserId = useAppStore((s) => s.sessionUserId);
  const users = useAppStore((s) => s.users);
  return users.find((u) => u.id === sessionUserId) ?? null;
}

export function useHas(code: string) {
  const user = useSessionUser();
  const overrides = useAppStore((s) => s.overrides);
  void overrides;
  if (!user) return false;
  return useAppStore.getState().effectivePermissions(user).has(code);
}

export function useModuleOn(key: ModuleKey) {
  return useAppStore((s) => s.modules[key] !== false);
}

export function useVisibleMembers() {
  const members = useAppStore((s) => s.members);
  const sessionUserId = useAppStore((s) => s.sessionUserId);
  const overrides = useAppStore((s) => s.overrides);
  const users = useAppStore((s) => s.users);
  return useMemo(
    () => useAppStore.getState().visibleMembers(),
    [members, sessionUserId, overrides, users],
  );
}
