import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MechanicsPage } from "@/components/mechanics/mechanics-page";
import { OperationsProvider } from "@/lib/operations-store";

export default function Mechanics() {
  return (
    <DashboardLayout>
        <MechanicsPage />
    </DashboardLayout>
  );
}