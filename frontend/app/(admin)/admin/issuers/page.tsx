import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/app/components/admin/dashboard-header"
import { DataTableIssuers } from "@/app/components/admin/issuers/data-table-issuers"

export default function IssuersPage() {
  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manage Issuers</h2>
            <p className="text-muted-foreground">Manage and monitor all registered healthcare providers</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Issuer
          </Button>
        </div>
        <DataTableIssuers />
      </div>
    </SidebarInset>
  )
}

