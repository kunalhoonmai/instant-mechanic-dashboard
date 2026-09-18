"use client";

import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

import type { CustomerStatus } from "./customers-page";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

const statusConfig = {
  Active: {
    icon: CheckCircle2,
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  Inactive: {
    icon: XCircle,
    className:
      "bg-red-500/10 text-red-600 dark:text-red-400",
  },
};

export function CustomerStatusBadge({
  status,
}: CustomerStatusBadgeProps) {
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