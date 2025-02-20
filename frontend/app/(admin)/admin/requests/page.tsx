import { DashboardHeader } from "@/app/components/admin/dashboard-header"
import { RequestsFilter } from "@/app/components/admin/requests.tsx/requests-filter"
import { RequestsList } from "@/app/components/admin/requests.tsx/requests-list"
import { SidebarInset } from "@/components/ui/sidebar"

export default function RequestsPage() {
  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Requests</h2>
            <p className="text-muted-foreground">Manage verifiable credential requests from users</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <RequestsFilter />
          <div className="flex-1">
            <RequestsList />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

