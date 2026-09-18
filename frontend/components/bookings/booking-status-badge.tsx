import {
  CheckCircle2,
  Clock3,
  Wrench,
  XCircle,
} from "lucide-react";

import type { BookingStatus } from "@/lib/operations-types";

const statusConfig: Record<
  BookingStatus,
  {
    className: string;
    icon: React.ElementType;
  }
> = {
  Completed: {
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2,
  },

  Pending: {
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: Clock3,
  },

  Assigned: {
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: Wrench,
  },

  Cancelled: {
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: XCircle,
  },
};

export function BookingStatusBadge({
  status,
}: {
  status: BookingStatus;
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