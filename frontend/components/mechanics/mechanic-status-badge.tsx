import {
  CheckCircle2,
  Clock3,
  WifiOff,
} from "lucide-react";

import type { MechanicStatus } from "./mechanics-page";

const statusConfig = {
  Available: {
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  "On Service": {
    icon: Clock3,
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  Offline: {
    icon: WifiOff,
    className:
      "bg-muted text-muted-foreground",
  },
};

export function MechanicStatusBadge({
  status,
}: {
  status: MechanicStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}