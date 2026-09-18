import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

import type { DashboardOverview } from "@/lib/analytics-types";

import { StatsCard } from "./stats-card";

interface StatsGridProps {
  overview: DashboardOverview;
}

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function StatsGrid({
  overview,
}: StatsGridProps) {
  const stats = [
    {
      title: "Total Bookings",
      value: overview.totalBookings.toLocaleString(
        "en-IN"
      ),
      change: "Live",
      trend: "neutral" as const,
      description: "from all bookings",
      icon: CalendarCheck,
    },
    {
      title: "Today's Bookings",
      value: overview.todayBookings.toLocaleString(
        "en-IN"
      ),
      change: "Today",
      trend: "neutral" as const,
      description: "scheduled for today",
      icon: CalendarDays,
    },
    {
      title: "Completed",
      value:
        overview.completedBookings.toLocaleString(
          "en-IN"
        ),
      change: "Live",
      trend: "neutral" as const,
      description: "completed bookings",
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: overview.pendingBookings.toLocaleString(
        "en-IN"
      ),
      change: "Live",
      trend: "neutral" as const,
      description: "awaiting service",
      icon: Clock3,
    },
    {
      title: "Cancelled",
      value:
        overview.cancelledBookings.toLocaleString(
          "en-IN"
        ),
      change: "Live",
      trend: "neutral" as const,
      description: "cancelled bookings",
      icon: XCircle,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(
        overview.totalRevenue
      ),
      change: "Live",
      trend: "neutral" as const,
      description: "from completed bookings",
      icon: DollarSign,
    },
    {
      title: "Active Mechanics",
      value:
        overview.activeMechanics.toLocaleString(
          "en-IN"
        ),
      change: "Live",
      trend: "neutral" as const,
      description: "currently available",
      icon: Users,
    },
    {
      title: "New Customers",
      value:
        overview.newCustomersThisMonth.toLocaleString(
          "en-IN"
        ),
      change: "This month",
      trend: "neutral" as const,
      description: "customers added this month",
      icon: UserPlus,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          {...stat}
        />
      ))}
    </div>
  );
}