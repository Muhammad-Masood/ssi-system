import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardCards } from "@/components/dashboard/cards";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <DashboardHeader
        title="Dashboard"
        description="Manage your decentralized identity and credentials"
      />
      <DashboardCards />
    </div>
  );
}
