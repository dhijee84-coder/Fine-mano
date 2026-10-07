import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { PageHeader, EmptyState, StatusBadge } from "@/components/desk";
import { Button, Card } from "@/components/kit";
import { useSessionUser } from "@/lib/session";
import { useAppStore } from "@/lib/store";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_app/notifications")({ component: AlertsPage });

function AlertsPage() {
  const user = useSessionUser();
  const raw = useAppStore((s) => s.alerts);
  const mark = useAppStore((s) => s.markAlertRead);
  const markAll = useAppStore((s) => s.markAllAlertsRead);
  const alerts = useMemo(
    () => (raw ?? []).filter((a) => a.userId === user?.id),
    [raw, user?.id],
  );
  const unread = alerts.filter((a) => !a.read).length;

  async function enableWeb() {
    if (typeof Notification === "undefined") {
      toast.error("This browser does not support web alerts.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") toast.success("Web alerts on for this browser.");
    else toast.error("Permission denied — in-app alerts still work.");
  }

  return (
    <div className="enter">
      <PageHeader
        kicker="Alerts"
        title="Your notifications"
        description="In-app and optional web alerts for this account. No SMS cost — each desk sees only its own feed."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={enableWeb}>
              Enable web alerts
            </Button>
            {unread > 0 ? (
              <Button variant="outline" onClick={() => markAll()}>
                Mark all read
              </Button>
            ) : null}
          </div>
        }
      />
      {alerts.length === 0 ? (
        <EmptyState title="No alerts yet" description="Payments, dues, and password resets will land here." />
      ) : (
        <ul className="flex flex-col gap-2">
          {alerts.map((a) => (
            <li key={a.id}>
              <Card className={a.read ? "opacity-70" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="mt-1 text-sm text-muted">{a.body}</p>
                    <p className="mt-2 text-xs text-faint">{formatDateTime(a.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={a.kind} />
                    {!a.read ? (
                      <button type="button" className="text-sm text-primary" onClick={() => mark(a.id)}>
                        Read
                      </button>
                    ) : null}
                    <a href={a.href} className="text-sm text-primary">
                      Open
                    </a>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
