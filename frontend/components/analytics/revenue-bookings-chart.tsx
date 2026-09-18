"use client";

import * as React from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface DailyAnalytics {
  date: string;
  bookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

type Metric =
  | "revenue"
  | "bookings";

type Period =
  | "Today"
  | "This Week"
  | "This Month";

interface RevenueBookingsChartProps {
  dailyTrend: DailyAnalytics[];
  period: Period;
}

function formatCurrency(
  value: number
): string {
  return `₹${value.toLocaleString(
    "en-IN"
  )}`;
}

function formatCompactCurrency(
  value: number
): string {
  if (value >= 100000) {
    return `₹${(
      value / 100000
    ).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(
      value / 1000
    ).toFixed(0)}K`;
  }

  return `₹${value}`;
}

function formatDate(
  dateString: string,
  period: Period
): string {
  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  if (period === "Today") {
    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    dataKey?: string;
  }>;
  label?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }

  const revenue =
    payload.find(
      (item) =>
        item.dataKey ===
        "revenue"
    )?.value;

  const bookings =
    payload.find(
      (item) =>
        item.dataKey ===
        "bookings"
    )?.value;

  const completedBookings =
    payload.find(
      (item) =>
        item.dataKey ===
        "completedBookings"
    )?.value;

  const cancelledBookings =
    payload.find(
      (item) =>
        item.dataKey ===
        "cancelledBookings"
    )?.value;

  return (
    <div className="min-w-48 rounded-xl border bg-background p-3 shadow-lg">
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        {label}
      </p>

      {revenue !== undefined && (
        <div className="flex items-center justify-between gap-6">
          <span className="text-sm text-muted-foreground">
            Revenue
          </span>

          <span className="text-sm font-semibold">
            {formatCurrency(
              Number(revenue)
            )}
          </span>
        </div>
      )}

      {bookings !== undefined && (
        <div className="mt-2 flex items-center justify-between gap-6">
          <span className="text-sm text-muted-foreground">
            Bookings
          </span>

          <span className="text-sm font-semibold">
            {bookings}
          </span>
        </div>
      )}

      {completedBookings !==
        undefined && (
        <div className="mt-2 flex items-center justify-between gap-6">
          <span className="text-sm text-muted-foreground">
            Completed
          </span>

          <span className="text-sm font-semibold">
            {completedBookings}
          </span>
        </div>
      )}

      {cancelledBookings !==
        undefined && (
        <div className="mt-2 flex items-center justify-between gap-6">
          <span className="text-sm text-muted-foreground">
            Cancelled
          </span>

          <span className="text-sm font-semibold">
            {cancelledBookings}
          </span>
        </div>
      )}
    </div>
  );
}

export function RevenueBookingsChart({
  dailyTrend,
  period,
}: RevenueBookingsChartProps) {
  const [metric, setMetric] =
    React.useState<Metric>(
      "revenue"
    );

  const chartData =
    React.useMemo(
      () =>
        dailyTrend.map(
          (item) => ({
            ...item,
            displayDate:
              formatDate(
                item.date,
                period
              ),
          })
        ),
      [
        dailyTrend,
        period,
      ]
    );

  const displayedRevenue =
    React.useMemo(
      () =>
        chartData.reduce(
          (sum, item) =>
            sum + item.revenue,
          0
        ),
      [chartData]
    );

  const displayedBookings =
    React.useMemo(
      () =>
        chartData.reduce(
          (sum, item) =>
            sum + item.bookings,
          0
        ),
      [chartData]
    );

  const currentPoint =
    chartData[
      chartData.length - 1
    ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold">
            Revenue & Bookings
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Track service revenue and booking activity
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Metric Toggle */}
          <div className="flex rounded-lg border bg-muted/40 p-1">
            <Button
              type="button"
              variant={
                metric ===
                "revenue"
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
              onClick={() =>
                setMetric(
                  "revenue"
                )
              }
              className="h-8 px-3 text-xs"
            >
              Revenue
            </Button>

            <Button
              type="button"
              variant={
                metric ===
                "bookings"
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
              onClick={() =>
                setMetric(
                  "bookings"
                )
              }
              className="h-8 px-3 text-xs"
            >
              Bookings
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-6 sm:p-6">
        {/* Summary */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {metric ===
              "revenue"
                ? "Displayed Revenue"
                : "Displayed Bookings"}
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight">
              {metric ===
              "revenue"
                ? formatCurrency(
                    displayedRevenue
                  )
                : displayedBookings.toLocaleString(
                    "en-IN"
                  )}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Latest
            </p>

            <p className="mt-1 text-sm font-semibold">
              {currentPoint
                ? metric ===
                  "revenue"
                  ? formatCurrency(
                      currentPoint.revenue
                    )
                  : currentPoint.bookings
                : "—"}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-75 w-full">
          {chartData.length ===
          0 ? (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed">
              <p className="text-sm text-muted-foreground">
                No booking data for this period.
              </p>
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 8,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="analyticsRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={
                        0.25
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>

                  <linearGradient
                    id="analyticsBookingsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity={
                        0.25
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                  className="stroke-border"
                />

                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  minTickGap={24}
                  className="text-[11px] fill-muted-foreground"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={55}
                  tickFormatter={(value) =>
                    metric ===
                    "revenue"
                      ? formatCompactCurrency(
                          Number(
                            value
                          )
                        )
                      : value
                  }
                  className="text-[11px] fill-muted-foreground"
                />

                <Tooltip
                  cursor={{
                    stroke:
                      "hsl(var(--border))",
                    strokeDasharray:
                      "4 4",
                  }}
                  content={
                    <CustomTooltip />
                  }
                />

                {metric ===
                "revenue" ? (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="currentColor"
                    fill="url(#analyticsRevenueGradient)"
                    strokeWidth={
                      2.5
                    }
                    className="text-primary"
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                    }}
                    animationDuration={
                      500
                    }
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="currentColor"
                    fill="url(#analyticsBookingsGradient)"
                    strokeWidth={
                      2.5
                    }
                    className="text-primary"
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                    }}
                    animationDuration={
                      500
                    }
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}