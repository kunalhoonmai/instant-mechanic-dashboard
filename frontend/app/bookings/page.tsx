import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BookingsPage } from "@/components/bookings/bookings-page";

export default function Bookings() {
  return (
    <DashboardLayout>
      <BookingsPage />
    </DashboardLayout>
  );
}