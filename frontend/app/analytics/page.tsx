import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AnalyticsPage } from "@/components/analytics/analytics-page";

export default function Bookings() {
  return (
    <DashboardLayout>
      <AnalyticsPage />
    </DashboardLayout>
  );
}