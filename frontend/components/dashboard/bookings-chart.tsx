"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyAnalytics } from "@/lib/analytics-types";

interface BookingsChartProps {
  dailyTrend: DailyAnalytics[];
}

type Period = 7 | 30;

function formatDateLabel(
  dateString: string,
  period: Period
): string {
  const date = new Date(
    `${dateString}T00:00:00`
  );

  if (period === 7) {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
    });
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function BookingsChart({
  dailyTrend,
}: BookingsChartProps) {
  const [period, setPeriod] =
    useState<Period>(7);

  const chartData = useMemo(() => {
    return dailyTrend
      .slice(-period)
      .map((item) => ({
        ...item,
        label: formatDateLabel(
          item.date,
          period
        ),
      }));
  }, [dailyTrend, period]);

  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-medium">
            Bookings Overview
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Booking activity over the last{" "}
            {period} days
          </p>
        </div>

        <select
          value={period}
          onChange={(event) =>
            setPeriod(
              Number(event.target.value) as Period
            )
          }
          className="h-9 shrink-0 rounded-lg border bg-background px-3 text-xs outline-none transition-colors focus:border-primary"
          aria-label="Booking chart period"
        >
          <option value={7}>
            Last 7 days
          </option>

          <option value={30}>
            Last 30 days
          </option>
        </select>
      </div>

      <div className="mt-5 h-58.75 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No booking data available.
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={chartData}
              margin={{
                top: 8,
                right: 8,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                }}
                className="fill-muted-foreground"
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                }}
                className="fill-muted-foreground"
              />

              <Tooltip
                cursor={{
                  stroke:
                    "hsl(var(--muted-foreground))",
                  strokeOpacity: 0.15,
                }}
                contentStyle={{
                  borderRadius: 8,
                  border:
                    "1px solid hsl(var(--border))",
                  background:
                    "hsl(var(--background))",
                  fontSize: 12,
                }}
                labelFormatter={(
                  _,
                  payload
                ) => {
                  const item =
                    payload?.[0]?.payload;

                  if (!item?.date) {
                    return "";
                  }

                  return new Date(
                    `${item.date}T00:00:00`
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  );
                }}
                formatter={(value) => [
                  Number(value).toLocaleString(
                    "en-IN"
                  ),
                  "Bookings",
                ]}
              />

              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#0d6efd"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}