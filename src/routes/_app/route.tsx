import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireAuth } from "@/components/app-shell";

export const Route = createFileRoute("/_app")({
  component: () => (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  ),
});
