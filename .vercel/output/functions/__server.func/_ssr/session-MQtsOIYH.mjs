import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { o as useAppStore } from "./router-5YFTNEBk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-MQtsOIYH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useSessionUser() {
	const sessionUserId = useAppStore((s) => s.sessionUserId);
	return useAppStore((s) => s.users).find((u) => u.id === sessionUserId) ?? null;
}
function useHas(code) {
	const user = useSessionUser();
	useAppStore((s) => s.overrides);
	if (!user) return false;
	return useAppStore.getState().effectivePermissions(user).has(code);
}
function useModuleOn(key) {
	return useAppStore((s) => s.modules[key] !== false);
}
function useVisibleMembers() {
	const members = useAppStore((s) => s.members);
	const sessionUserId = useAppStore((s) => s.sessionUserId);
	const overrides = useAppStore((s) => s.overrides);
	const users = useAppStore((s) => s.users);
	return (0, import_react.useMemo)(() => useAppStore.getState().visibleMembers(), [
		members,
		sessionUserId,
		overrides,
		users
	]);
}
//#endregion
export { useVisibleMembers as i, useModuleOn as n, useSessionUser as r, useHas as t };
