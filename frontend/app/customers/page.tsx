import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CustomersPage } from "@/components/customers/customers-page";

export default function Customers() {
  return (
      <DashboardLayout>
        <CustomersPage />
      </DashboardLayout>
    );
}