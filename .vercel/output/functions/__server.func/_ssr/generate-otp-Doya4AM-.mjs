import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-otp-Doya4AM-.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateOtp_createServerFn_handler = createServerRpc({
	id: "5ddacd0ee13ee28c036dc38abd288c2a2431b983f56a9e369aa6f9829762aa34",
	name: "generateOtp",
	filename: "src/lib/generate-otp.ts"
}, (opts) => generateOtp.__executeServer(opts));
var generateOtp = createServerFn({ method: "POST" }).handler(generateOtp_createServerFn_handler, async () => {
	const python = await (async () => {
		try {
			const { execFile } = await import("node:child_process");
			const { promisify } = await import("node:util");
			const path = await import("node:path");
			const { stdout } = await promisify(execFile)("python3", [path.join(process.cwd(), "python", "otp.py"), "6"], { timeout: 4e3 });
			const otp = stdout.trim();
			return /^\d{6}$/.test(otp) ? otp : null;
		} catch {
			return null;
		}
	})();
	if (python) return {
		otp: python,
		via: "python"
	};
	const { randomInt } = await import("node:crypto");
	return {
		otp: String(randomInt(0, 1e6)).padStart(6, "0"),
		via: "node"
	};
});
//#endregion
export { generateOtp_createServerFn_handler };
