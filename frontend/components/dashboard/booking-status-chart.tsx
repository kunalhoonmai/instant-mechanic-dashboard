"use client";

import type {
  BookingStatusBreakdown,
  BookingStatus,
} from "@/lib/analytics-types";

interface BookingStatusChartProps {
  bookingStatus: BookingStatusBreakdown[];
}

const statusConfig: Record<
  BookingStatus,
  {
    label: string;
    className: string;
    color: string;
  }
> = {
  Completed: {
    label: "Completed",
    className: "bg-blue-600",
    color: "#0d6efd",
  },
  Pending: {
    label: "Pending",
    className: "bg-slate-500",
    color: "#64748b",
  },
  Assigned: {
    label: "Assigned",
    className: "bg-slate-900",
    color: "#111827",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-red-500",
    color: "#ef4444",
  },
};

export function BookingStatusChart({
  bookingStatus,
}: BookingStatusChartProps) {
  const total = bookingStatus.reduce(
    (sum, item) => sum + item.count,
    0
  );

  let currentAngle = 0;

  const gradientParts = bookingStatus
    .filter((item) => item.count > 0)
    .map((item) => {
      const start = currentAngle;

      const percentage =
        total > 0
          ? (item.count / total) * 100
          : 0;

      currentAngle += percentage;

      const end = currentAngle;

      return `${statusConfig[item.status].color} ${start}% ${end}%`;
    });

  const background =
    gradientParts.length > 0
      ? `conic-gradient(${gradientParts.join(
          ", "
        )})`
      : "conic-gradient(#e5e7eb 0% 100%)";

  return (
    <div className="rounded-xl border bg-background p-5">
      <div>
        <h3 className="text-base font-medium">
          Booking Status
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Current booking distribution
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <div
          className="relative flex h-38.75 w-38.75 items-center justify-center rounded-full"
          style={{
            background,
          }}
        >
          <div className="flex h-26.25 w-26.25 flex-col items-center justify-center rounded-full bg-background">
            <span className="text-xl font-semibold tracking-tight">
              {total.toLocaleString("en-IN")}
            </span>

            <span className="mt-1 text-[11px] text-muted-foreground">
              Total
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
        {bookingStatus.map((item) => {
          const config =
            statusConfig[item.status];

          return (
            <div
              key={item.status}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${config.className}`}
                />

                <span className="truncate text-muted-foreground">
                  {config.label}
                </span>
              </div>

              <span className="font-medium">
                {item.count.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}