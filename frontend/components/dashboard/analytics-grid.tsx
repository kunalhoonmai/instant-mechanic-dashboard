import type {
  BookingStatusBreakdown,
  DailyAnalytics,
  ServicePerformance,
} from "@/lib/analytics-types";

import { BookingStatusChart } from "./booking-status-chart";
import { BookingsChart } from "./bookings-chart";
import { RevenueChart } from "./revenue-chart";
import { ServiceBreakdown } from "./service-breakdown";

interface AnalyticsGridProps {
  bookingStatus: BookingStatusBreakdown[];
  servicePerformance: ServicePerformance[];
  dailyTrend: DailyAnalytics[];
}

export function AnalyticsGrid({
  bookingStatus,
  servicePerformance,
  dailyTrend,
}: AnalyticsGridProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <BookingsChart
          dailyTrend={dailyTrend}
        />
      </div>

      <div>
        <BookingStatusChart
          bookingStatus={bookingStatus}
        />
      </div>

      <div className="xl:col-span-2">
        <RevenueChart
          dailyTrend={dailyTrend}
        />
      </div>

      <div>
        <ServiceBreakdown
          servicePerformance={
            servicePerformance
          }
        />
      </div>
    </div>
  );
}