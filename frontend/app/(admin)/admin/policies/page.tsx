import { DashboardHeader } from "@/app/components/admin/dashboard-header"
import { PolicyManager } from "@/app/components/admin/policies/policy-manager"
import { RoleManager } from "@/app/components/admin/policies/role-manager"
import { SidebarInset } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PoliciesPage() {
  return (
    <SidebarInset>
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Policies & Roles</h2>
          <p className="text-muted-foreground">Manage access control and issuance policies</p>
        </div>
        <Tabs defaultValue="roles">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>
          <TabsContent value="roles" className="space-y-4">
            <RoleManager />
          </TabsContent>
          <TabsContent value="policies" className="space-y-4">
            <PolicyManager />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

