"use client";

import * as React from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  TrendingUp,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import {
  RevenueBookingsChart,
} from "@/components/analytics/revenue-bookings-chart";

import api from "@/lib/api";
import {
  connectSocket,
} from "@/lib/socket";

type Period =
  | "Today"
  | "This Week"
  | "This Month";

type ApiPeriod =
  | "today"
  | "week"
  | "month";

type BookingStatus =
  | "Pending"
  | "Assigned"
  | "Completed"
  | "Cancelled";

interface BookingStatusBreakdown {
  status: BookingStatus;
  count: number;
  percentage: number;
}

interface ServicePerformance {
  serviceId: string;
  name: string;
  bookings: number;
  completedBookings: number;
  revenue: number;
  averageValue: number;
}

interface MechanicPerformance {
  mechanicId: string;
  name: string;
  jobs: number;
  completedJobs: number;
  revenue: number;
  rating: number;
  rate: number;
}

interface DailyAnalytics {
  date: string;
  bookings: number;
  completedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

interface AnalyticsOverview {
  totalBookings: number;
  todayBookings: number;

  completedBookings: number;
  pendingBookings: number;
  assignedBookings: number;
  cancelledBookings: number;

  totalRevenue: number;
  averageBookingValue: number;

  completionRate: number;
  cancellationRate: number;

  totalCustomers: number;
  newCustomers: number;

  totalMechanics: number;
  activeMechanics: number;

  totalServices: number;
}

interface AnalyticsData {
  period: ApiPeriod;
  overview: AnalyticsOverview;
  bookingStatus: BookingStatusBreakdown[];
  servicePerformance: ServicePerformance[];
  mechanicPerformance: MechanicPerformance[];
  dailyTrend: DailyAnalytics[];
}

interface AnalyticsApiResponse {
  success: boolean;
  data: AnalyticsData;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getApiPeriod(
  period: Period
): ApiPeriod {
  if (period === "Today") {
    return "today";
  }

  if (period === "This Month") {
    return "month";
  }

  return "week";
}

function formatCurrency(
  value: number
): string {
  return `₹${value.toLocaleString(
    "en-IN"
  )}`;
}

function getPeriodLabel(
  period: Period
): string {
  if (period === "Today") {
    return "today";
  }

  if (period === "This Week") {
    return "this week";
  }

  return "this month";
}

function getPreviousPeriodLabel(
  period: Period
): string {
  if (period === "Today") {
    return "previous day";
  }

  if (period === "This Week") {
    return "previous week";
  }

  return "previous month";
}

/* -------------------------------------------------------------------------- */
/* Analytics Skeleton                                                         */
/* -------------------------------------------------------------------------- */

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}

      <div>
        <Skeleton className="h-4 w-48" />

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0">
            <Skeleton className="h-9 w-40" />

            <Skeleton className="mt-2 h-4 w-96 max-w-full" />
          </div>

          {/* Period Selector */}

          <div className="flex w-full gap-1 rounded-lg border bg-background p-1 sm:w-auto">
            <Skeleton className="h-8 flex-1 rounded-md sm:w-16 sm:flex-none" />

            <Skeleton className="h-8 flex-1 rounded-md sm:w-20 sm:flex-none" />

            <Skeleton className="h-8 flex-1 rounded-md sm:w-24 sm:flex-none" />
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-28" />

                  <Skeleton className="mt-3 h-8 w-24" />

                  <Skeleton className="mt-2 h-3 w-36" />
                </div>

                <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue + Booking Status */}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Revenue Chart Skeleton */}

        <Card className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-5 w-40" />

            <Skeleton className="mt-2 h-3 w-64" />
          </CardHeader>

          <CardContent>
            <div className="relative h-80 overflow-hidden rounded-lg">
              {/* Horizontal guide lines */}

              <div className="absolute inset-x-0 top-4 border-t border-dashed" />

              <div className="absolute inset-x-0 top-1/4 border-t border-dashed" />

              <div className="absolute inset-x-0 top-1/2 border-t border-dashed" />

              <div className="absolute inset-x-0 top-3/4 border-t border-dashed" />

              <div className="absolute inset-x-0 bottom-8 border-t border-dashed" />

              {/* Chart bars */}

              <div className="absolute inset-x-0 bottom-8 flex h-[85%] items-end justify-around gap-2 px-3">
                {Array.from({
                  length: 12,
                }).map((_, index) => {
                  const heights = [
                    "35%",
                    "52%",
                    "42%",
                    "68%",
                    "48%",
                    "76%",
                    "58%",
                    "82%",
                    "64%",
                    "72%",
                    "55%",
                    "88%",
                  ];

                  return (
                    <div
                      key={index}
                      className="flex h-full flex-1 items-end justify-center"
                    >
                      <Skeleton
                        className="w-full max-w-8 rounded-t-md rounded-b-none"
                        style={{
                          height:
                            heights[index],
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis */}

              <div className="absolute inset-x-0 bottom-0 flex justify-between px-3">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-3 w-8"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Skeleton */}

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />

            <Skeleton className="mt-2 h-3 w-56" />
          </CardHeader>

          <CardContent className="space-y-5">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />

                    <Skeleton className="h-4 w-20" />
                  </div>

                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-8" />

                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>

                <Skeleton className="mt-2 h-2 w-full rounded-full" />
              </div>
            ))}

            <div className="rounded-xl border bg-muted/30 p-4">
              <Skeleton className="h-3 w-24" />

              <Skeleton className="mt-2 h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services + Mechanic Performance */}

      <div className="grid items-stretch gap-6 xl:grid-cols-2 xl:auto-rows-155">
        {/* Popular Services Skeleton */}

        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0">
            <Skeleton className="h-5 w-36" />

            <Skeleton className="mt-2 h-3 w-72 max-w-full" />
          </CardHeader>

          <CardContent className="min-h-0 flex-1 space-y-5 overflow-hidden">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div key={index}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />

                    <div className="min-w-0">
                      <Skeleton className="h-4 w-32" />

                      <Skeleton className="mt-2 h-3 w-20" />
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <Skeleton className="ml-auto h-4 w-20" />

                    <Skeleton className="mt-2 ml-auto h-3 w-16" />
                  </div>
                </div>

                <Skeleton className="mt-2 h-1.5 w-full rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mechanic Performance Skeleton */}

        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0">
            <Skeleton className="h-5 w-44" />

            <Skeleton className="mt-2 h-3 w-64" />
          </CardHeader>

          <CardContent className="min-h-0 flex-1 overflow-hidden">
            <div className="flex h-full min-h-0 flex-col">
              {/* Table Header */}

              <div className="grid shrink-0 grid-cols-[1.6fr_0.7fr_0.8fr_0.6fr] gap-3 border-b pb-3">
                <Skeleton className="h-3 w-20" />

                <Skeleton className="ml-auto h-3 w-16" />

                <Skeleton className="ml-auto h-3 w-16" />

                <Skeleton className="ml-auto h-3 w-10" />
              </div>

              {/* Scrollable Rows */}

              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="divide-y">
                  {Array.from({
                    length: 9,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1.6fr_0.7fr_0.8fr_0.6fr] items-center gap-3 py-4"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

                        <div className="min-w-0">
                          <Skeleton className="h-4 w-24" />

                          <Skeleton className="mt-2 h-3 w-16" />
                        </div>
                      </div>

                      <Skeleton className="ml-auto h-4 w-8" />

                      <Skeleton className="ml-auto h-4 w-8" />

                      <Skeleton className="ml-auto h-4 w-10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />

          <Skeleton className="mt-2 h-3 w-72 max-w-full" />
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border bg-muted/20 p-4"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />

                  <Skeleton className="h-3 w-24" />
                </div>

                <Skeleton className="mt-3 h-6 w-28" />

                <Skeleton className="mt-2 h-3 w-32 max-w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export function AnalyticsPage() {
  const [period, setPeriod] =
    React.useState<Period>(
      "This Week"
    );

  const [analytics, setAnalytics] =
    React.useState<AnalyticsData | null>(
      null
    );

  const [loading, setLoading] =
    React.useState(true);

  const [error, setError] =
    React.useState<string | null>(
      null
    );

  const loadAnalytics =
    React.useCallback(
      async (
        selectedPeriod: Period
      ) => {
        try {
          setError(null);

          const apiPeriod =
            getApiPeriod(
              selectedPeriod
            );

          const response =
            await api.get<AnalyticsApiResponse>(
              `/analytics?period=${apiPeriod}`
            );

          if (
            !response.data.success
          ) {
            throw new Error(
              "Failed to load analytics."
            );
          }

          setAnalytics(
            response.data.data
          );
        } catch (error) {
          console.error(
            "Analytics loading error:",
            error
          );

          setError(
            "Unable to load analytics data. Please check that the backend is running."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  React.useEffect(() => {
    loadAnalytics(period);
  }, [
    loadAnalytics,
    period,
  ]);

  React.useEffect(() => {
    const socket =
      connectSocket();

    const handleDataChange =
      () => {
        loadAnalytics(period);
      };

    socket.on(
      "booking:created",
      handleDataChange
    );

    socket.on(
      "booking:updated",
      handleDataChange
    );

    socket.on(
      "booking:deleted",
      handleDataChange
    );

    socket.on(
      "mechanic:created",
      handleDataChange
    );

    socket.on(
      "mechanic:updated",
      handleDataChange
    );

    socket.on(
      "customer:created",
      handleDataChange
    );

    socket.on(
      "customer:updated",
      handleDataChange
    );

    return () => {
      socket.off(
        "booking:created",
        handleDataChange
      );

      socket.off(
        "booking:updated",
        handleDataChange
      );

      socket.off(
        "booking:deleted",
        handleDataChange
      );

      socket.off(
        "mechanic:created",
        handleDataChange
      );

      socket.off(
        "mechanic:updated",
        handleDataChange
      );

      socket.off(
        "customer:created",
        handleDataChange
      );

      socket.off(
        "customer:updated",
        handleDataChange
      );
    };
  }, [
    loadAnalytics,
    period,
  ]);

  const bookingStatus =
    React.useMemo(() => {
      if (!analytics) {
        return [];
      }

      const statusConfig: Record<
        BookingStatus,
        {
          label: string;
          icon: typeof CheckCircle2;
          className: string;
          barClassName: string;
        }
      > = {
        Completed: {
          label: "Completed",
          icon: CheckCircle2,
          className:
            "text-emerald-600 dark:text-emerald-400",
          barClassName:
            "bg-emerald-500",
        },
        Assigned: {
          label: "Assigned",
          icon: Wrench,
          className:
            "text-blue-600 dark:text-blue-400",
          barClassName:
            "bg-blue-500",
        },
        Pending: {
          label: "Pending",
          icon: Clock3,
          className:
            "text-amber-600 dark:text-amber-400",
          barClassName:
            "bg-amber-500",
        },
        Cancelled: {
          label: "Cancelled",
          icon: XCircle,
          className:
            "text-red-600 dark:text-red-400",
          barClassName:
            "bg-red-500",
        },
      };

      return analytics.bookingStatus.map(
        (item) => ({
          ...item,
          ...statusConfig[
            item.status
          ],
        })
      );
    }, [analytics]);

  /* ------------------------------------------------------------------------ */
  /* Loading State                                                            */
  /* ------------------------------------------------------------------------ */

  if (
    loading &&
    !analytics
  ) {
    return <AnalyticsSkeleton />;
  }

  /* ------------------------------------------------------------------------ */
  /* Error State                                                              */
  /* ------------------------------------------------------------------------ */

  if (
    error &&
    !analytics
  ) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <p className="text-sm text-muted-foreground">
            Operations / Analytics
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Analytics
          </h1>
        </div>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadAnalytics(period)
            }
            className="mt-4 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const topService =
    analytics.servicePerformance[0];

  const topMechanic =
    analytics.mechanicPerformance[0];

  const cancellationRate =
    analytics.overview.cancellationRate;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}

      <div>
        <p className="text-sm text-muted-foreground">
          Operations / Analytics
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Analytics
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Track booking performance, revenue, services,
              and operational trends.
            </p>
          </div>

          {/* Period Filter */}

          <div className="flex w-full rounded-lg border bg-background p-1 sm:w-auto">
            {(
              [
                "Today",
                "This Week",
                "This Month",
              ] as Period[]
            ).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setPeriod(item)
                }
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors sm:flex-none ${
                  period === item
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            analytics.overview
              .totalRevenue
          )}
          description={`From completed bookings ${getPeriodLabel(
            period
          )}`}
          icon={IndianRupee}
        />

        <StatCard
          title="Total Bookings"
          value={analytics.overview.totalBookings.toLocaleString(
            "en-IN"
          )}
          description={`All bookings ${getPeriodLabel(
            period
          )}`}
          icon={CalendarDays}
        />

        <StatCard
          title="Completion Rate"
          value={`${analytics.overview.completionRate}%`}
          description="Successfully completed bookings"
          icon={CheckCircle2}
        />

        <StatCard
          title="Avg. Booking Value"
          value={formatCurrency(
            analytics.overview
              .averageBookingValue
          )}
          description="Average value of completed bookings"
          icon={TrendingUp}
        />
      </div>

      {/* Revenue + Booking Status */}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <RevenueBookingsChart
          dailyTrend={
            analytics.dailyTrend
          }
          period={period}
        />

        {/* Booking Status */}

        <Card>
          <CardHeader>
            <CardTitle>
              Booking Status
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Booking distribution for{" "}
              {getPeriodLabel(
                period
              )}
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {bookingStatus.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <div
                    key={
                      item.status
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-4 w-4 ${item.className}`}
                        />

                        <span className="text-sm font-medium">
                          {
                            item.label
                          }
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold">
                          {item.count.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="ml-1 text-xs text-muted-foreground">
                          (
                          {
                            item.percentage
                          }
                          %)
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${item.barClassName}`}
                        style={{
                          width: `${Math.min(
                            item.percentage,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                Total Bookings
              </p>

              <p className="mt-1 text-2xl font-bold">
                {analytics.overview.totalBookings.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services + Performance */}

      <div className="grid items-stretch gap-6 xl:grid-cols-2 xl:auto-rows-155">
        {/* Popular Services */}

        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0">
            <CardTitle>
              Popular Services
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Services generating the most bookings{" "}
              {getPeriodLabel(
                period
              )}
            </p>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 space-y-5 overflow-y-auto">
            {analytics.servicePerformance.length ===
            0 ? (
              <EmptyState text="No service bookings for this period." />
            ) : (
              analytics.servicePerformance.map(
                (
                  service,
                  index
                ) => {
                  const maxBookings =
                    Math.max(
                      ...analytics.servicePerformance.map(
                        (
                          item
                        ) =>
                          item.bookings
                      ),
                      1
                    );

                  const percentage =
                    Math.round(
                      (service.bookings /
                        maxBookings) *
                        100
                    );

                  return (
                    <div
                      key={
                        service.serviceId
                      }
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                            {index +
                              1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {
                                service.name
                              }
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {service.bookings.toLocaleString(
                                "en-IN"
                              )}{" "}
                              bookings
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatCurrency(
                              service.revenue
                            )}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {service.completedBookings}{" "}
                            completed
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )
            )}
          </CardContent>
        </Card>

        {/* Mechanic Performance */}

        <Card className="flex min-h-0 flex-col">
          <CardHeader className="shrink-0">
            <CardTitle>
              Mechanic Performance
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Mechanic performance{" "}
              {getPeriodLabel(
                period
              )}
            </p>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 overflow-hidden">
            {analytics.mechanicPerformance.length ===
            0 ? (
              <EmptyState text="No assigned mechanic bookings for this period." />
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                {/* Sticky Table Header */}

                <div className="grid shrink-0 grid-cols-[1.6fr_0.7fr_0.8fr_0.6fr] gap-3 border-b bg-card pb-3 text-sm">
                  <div className="font-medium text-muted-foreground">
                    Mechanic
                  </div>

                  <div className="text-right font-medium text-muted-foreground">
                    Bookings
                  </div>

                  <div className="text-right font-medium text-muted-foreground">
                    Completed
                  </div>

                  <div className="text-right font-medium text-muted-foreground">
                    Rate
                  </div>
                </div>

                {/* Scrollable Mechanic Rows */}

                <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin">
                  <table className="w-full text-sm">
                    <tbody className="divide-y">
                      {analytics.mechanicPerformance.map(
                        (
                          mechanic
                        ) => (
                          <tr
                            key={
                              mechanic.mechanicId
                            }
                            className="border-b last:border-0"
                          >
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <Users className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate font-medium">
                                    {
                                      mechanic.name
                                    }
                                  </p>

                                  <p className="text-xs text-muted-foreground">
                                    {formatCurrency(
                                      mechanic.revenue
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 text-right">
                              {
                                mechanic.jobs
                              }
                            </td>

                            <td className="py-4 text-right">
                              {
                                mechanic.completedJobs
                              }
                            </td>

                            <td className="py-4 text-right">
                              <span className="font-semibold">
                                {
                                  mechanic.rate
                                }
                                %
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}

      <Card>
        <CardHeader>
          <CardTitle>
            Performance Insights
          </CardTitle>

          <p className="mt-1 text-xs text-muted-foreground">
            Key observations from your operations data
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Insight
              title="Top Service"
              value={
                topService?.name ??
                "No data"
              }
              description={
                topService
                  ? `${topService.bookings} bookings ${getPeriodLabel(
                      period
                    )}`
                  : "No bookings in this period"
              }
              icon={Wrench}
            />

            <Insight
              title="Top Mechanic"
              value={
                topMechanic?.name ??
                "No data"
              }
              description={
                topMechanic
                  ? `${topMechanic.rate}% completion rate`
                  : "No assigned bookings in this period"
              }
              icon={Users}
            />

            <Insight
              title="Period"
              value={period}
              description={`Compared with the ${getPreviousPeriodLabel(
                period
              )}`}
              icon={TrendingUp}
            />

            <Insight
              title="Cancellation Rate"
              value={`${cancellationRate}%`}
              description={`${analytics.overview.cancelledBookings} cancelled bookings`}
              icon={XCircle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <p className="mt-2 text-2xl font-bold tracking-tight">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Insight Card                                                               */
/* -------------------------------------------------------------------------- */

function Insight({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs font-medium">
          {title}
        </span>
      </div>

      <p className="mt-3 text-lg font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <p className="text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}