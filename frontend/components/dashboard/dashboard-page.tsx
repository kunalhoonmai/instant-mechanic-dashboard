"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import api from "@/lib/api";
import { connectSocket } from "@/lib/socket";
import { Skeleton } from "@/components/ui/skeleton";

import type {
  DashboardOverview,
  BookingStatusBreakdown,
  DailyAnalytics,
  ServicePerformance,
} from "@/lib/analytics-types";

import { AnalyticsGrid } from "./analytics-grid";
import { StatsGrid } from "./stats-grid";

interface DashboardResponse {
  overview: DashboardOverview;
  bookingStatus: BookingStatusBreakdown[];
  servicePerformance: ServicePerformance[];
  dailyTrend: DailyAnalytics[];
}

interface DashboardApiResponse {
  success: boolean;
  data: DashboardResponse;
}

function getCurrentDateLabel(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

/* -------------------------------------------------------------------------- */
/* Dashboard Skeleton                                                        */
/* -------------------------------------------------------------------------- */

function DashboardSkeleton() {
  return (
    <div
      className="space-y-6 pb-8"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-8">
        <Skeleton className="h-4 w-48" />

        <Skeleton className="mt-3 h-9 w-72 max-w-full rounded-lg" />

        <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Statistics                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-28" />

                <Skeleton className="mt-3 h-8 w-24 rounded-lg" />

                <Skeleton className="mt-3 h-3 w-36" />
              </div>

              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Analytics Grid                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ---------------------------------------------------------------- */}
        {/* Main revenue / trend chart                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="overflow-hidden rounded-xl border bg-card xl:col-span-2">
          <div className="border-b p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-40" />

                <Skeleton className="mt-2 h-3 w-64" />
              </div>

              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>

          <div className="p-5">
            <div className="relative h-72">
              {/* Horizontal chart guides */}
              <div className="absolute inset-x-0 top-4 border-t border-dashed border-muted" />
              <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-muted" />
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted" />
              <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-muted" />
              <div className="absolute inset-x-0 bottom-8 border-t border-dashed border-muted" />

              {/* Y-axis labels */}
              <div className="absolute inset-y-0 left-0 flex flex-col justify-between pb-8">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>

              {/* Chart bars */}
              <div className="absolute inset-x-12 bottom-8 top-4 flex items-end justify-between gap-2">
                <Skeleton className="h-[22%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[34%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[28%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[46%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[40%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[62%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[51%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[70%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[58%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[76%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[66%] w-5 rounded-t sm:w-7" />
                <Skeleton className="h-[84%] w-5 rounded-t sm:w-7" />
              </div>
            </div>

            {/* X-axis labels */}
            <div className="ml-12 flex justify-between gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-3 w-8 sm:w-10"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Booking status                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b p-5">
            <Skeleton className="h-5 w-36" />

            <Skeleton className="mt-2 h-3 w-52" />
          </div>

          <div className="space-y-6 p-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />

                    <Skeleton className="h-4 w-20" />
                  </div>

                  <Skeleton className="h-4 w-10" />
                </div>

                <Skeleton className="mt-3 h-2 w-full rounded-full" />
              </div>
            ))}

            <div className="rounded-xl bg-muted/40 p-4">
              <Skeleton className="h-3 w-24" />

              <Skeleton className="mt-2 h-7 w-16 rounded-lg" />

              <Skeleton className="mt-2 h-3 w-28" />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Service performance                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="overflow-hidden rounded-xl border bg-card xl:col-span-2">
          <div className="border-b p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Skeleton className="h-5 w-40" />

                <Skeleton className="mt-2 h-3 w-64" />
              </div>

              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>

          <div className="space-y-6 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-4 w-32 max-w-[30vw]" />

                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  <div className="shrink-0 space-y-2 text-right">
                    <Skeleton className="ml-auto h-4 w-20" />

                    <Skeleton className="ml-auto h-3 w-16" />
                  </div>
                </div>

                <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Secondary analytics card                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="border-b p-5">
            <Skeleton className="h-5 w-36" />

            <Skeleton className="mt-2 h-3 w-52" />
          </div>

          <div className="flex min-h-80 items-center justify-center p-5">
            <div className="relative">
              <Skeleton className="h-48 w-48 rounded-full" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-card" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error State                                                               */
/* -------------------------------------------------------------------------- */

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-1 text-sm text-muted-foreground">
          {getCurrentDateLabel()}
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {getGreeting()} 👋
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your
          operations today.
        </p>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard Page                                                            */
/* -------------------------------------------------------------------------- */

export function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);

      const response =
        await api.get<DashboardApiResponse>(
          "/dashboard"
        );

      if (!response.data.success) {
        throw new Error(
          "Unable to load dashboard data."
        );
      }

      setDashboard(response.data.data);
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      setError(
        "Unable to load dashboard data. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();

    const socket = connectSocket();

    const handleDashboardRefresh = () => {
      /*
       * Do not set loading=true here.
       *
       * Existing dashboard data stays visible while the
       * refreshed API response is being fetched. This
       * prevents a visible skeleton flash after CRUD
       * operations or Socket.IO updates.
       */
      void loadDashboard();
    };

    socket.on(
      "booking:created",
      handleDashboardRefresh
    );

    socket.on(
      "booking:updated",
      handleDashboardRefresh
    );

    socket.on(
      "booking:deleted",
      handleDashboardRefresh
    );

    socket.on(
      "mechanic:created",
      handleDashboardRefresh
    );

    socket.on(
      "mechanic:updated",
      handleDashboardRefresh
    );

    socket.on(
      "customer:created",
      handleDashboardRefresh
    );

    socket.on(
      "customer:updated",
      handleDashboardRefresh
    );

    return () => {
      socket.off(
        "booking:created",
        handleDashboardRefresh
      );

      socket.off(
        "booking:updated",
        handleDashboardRefresh
      );

      socket.off(
        "booking:deleted",
        handleDashboardRefresh
      );

      socket.off(
        "mechanic:created",
        handleDashboardRefresh
      );

      socket.off(
        "mechanic:updated",
        handleDashboardRefresh
      );

      socket.off(
        "customer:created",
        handleDashboardRefresh
      );

      socket.off(
        "customer:updated",
        handleDashboardRefresh
      );
    };
  }, [loadDashboard]);

  /*
   * Initial API request:
   * show the complete skeleton until the first successful
   * dashboard response arrives.
   */
  if (loading && !dashboard) {
    return <DashboardSkeleton />;
  }

  /*
   * If the first API request fails and there is no previous
   * dashboard data to display, show the error state.
   */
  if (error && !dashboard) {
    return (
      <DashboardError
        message={error}
        onRetry={() => {
          setLoading(true);
          void loadDashboard();
        }}
      />
    );
  }

  /*
   * This should only happen if the request finished without
   * data and without a usable error message.
   */
  if (!dashboard) {
    return (
      <DashboardError
        message="Unable to load dashboard data."
        onRetry={() => {
          setLoading(true);
          void loadDashboard();
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="mb-1 text-sm text-muted-foreground">
          {getCurrentDateLabel()}
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {getGreeting()} 👋
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your
          operations today.
        </p>
      </div>

      <div className="space-y-6 pb-8">
        <StatsGrid
          overview={dashboard.overview}
        />

        <AnalyticsGrid
          bookingStatus={
            dashboard.bookingStatus
          }
          servicePerformance={
            dashboard.servicePerformance
          }
          dailyTrend={
            dashboard.dailyTrend
          }
        />
      </div>
    </div>
  );
}