import { DashboardHeader } from "@/components/dashboard/header"
import CredentialsManager from "@/components/dashboard/credentials-manager"

export default function CredentialsPage() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <DashboardHeader title="Credentials" description="Manage your issued and owned credentials" />
      <CredentialsManager />
    </div>
  )
}

