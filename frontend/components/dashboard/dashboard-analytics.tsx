"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { RefreshCw } from "lucide-react";

import api from "@/lib/api";
import {
  connectSocket,
} from "@/lib/socket";

import type {
  BookingStatusBreakdown,
  DashboardOverview,
  DailyAnalytics,
  ServicePerformance,
} from "@/lib/analytics-types";

import { StatsGrid } from "./stats-grid";
import { AnalyticsGrid } from "./analytics-grid";

interface DashboardData {
  overview: DashboardOverview;
  bookingStatus: BookingStatusBreakdown[];
  servicePerformance: ServicePerformance[];
  dailyTrend: DailyAnalytics[];
}

interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
}

export function DashboardAnalytics() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard = useCallback(
    async () => {
      try {
        setError(null);

        const response =
          await api.get<DashboardApiResponse>(
            "/dashboard"
          );

        if (!response.data.success) {
          throw new Error(
            "Failed to load dashboard data."
          );
        }

        setDashboard(response.data.data);
      } catch (err) {
        console.error(
          "Failed to load dashboard analytics:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();

    const socket = connectSocket();

    const handleDataChange = () => {
      loadDashboard();
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
  }, [loadDashboard]);

  if (loading && !dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28.5 animate-pulse rounded-xl border bg-muted/30"
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-80.5 animate-pulse rounded-xl border bg-muted/30 xl:col-span-2" />

          <div className="h-80.5 animate-pulse rounded-xl border bg-muted/30" />

          <div className="h-80.5 animate-pulse rounded-xl border bg-muted/30 xl:col-span-2" />

          <div className="h-80.5 animate-pulse rounded-xl border bg-muted/30" />
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="rounded-xl border bg-background p-8 text-center">
        <p className="text-sm font-medium">
          Unable to load dashboard analytics
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {error}
        </p>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-6">
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
  );
}