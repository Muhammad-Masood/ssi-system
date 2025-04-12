import { DashboardHeader } from "@/components/dashboard/header";
import DidsManager from "@/components/dashboard/dids-manager";

export default function DidsPage() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <DashboardHeader
        title="Decentralized Identifiers"
        description="Create and manage your DIDs"
      />
      <DidsManager />
    </div>
  );
}
