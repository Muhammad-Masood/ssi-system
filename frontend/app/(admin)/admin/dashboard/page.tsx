import { Activity, FileText, Users, Hospital } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../../../components/admin/data-table";
import { columns } from "../../../components/admin/columns";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "../../../components/admin/dashboard-header";
import { Header } from "@/app/components/Header";
import { getSession } from "@/auth";

const stats = [
  {
    title: "Total Issuers",
    value: "2,345",
    icon: Hospital,
    description: "Active healthcare providers",
  },
  {
    title: "Pending Requests",
    value: "43",
    icon: FileText,
    description: "VC issuance requests",
  },
  {
    title: "Active Users",
    value: "12.5k",
    icon: Users,
    description: "Registered users",
  },
  {
    title: "Recent Activity",
    value: "573",
    icon: Activity,
    description: "Actions in last 24h",
  },
];

const data = [
  {
    id: "728ed52f",
    name: "Metro General Hospital",
    status: "active",
    role: "Hospital",
    createdAt: "2024-01-10",
    email: "admin@metrogeneral.com",
  },
  {
    id: "489e1d42",
    name: "Dr. Sarah Johnson",
    status: "pending",
    role: "Doctor",
    createdAt: "2024-02-15",
    email: "sarah.j@healthcare.com",
  },
  {
    id: "9a8b7c6d",
    name: "Central Pharmacy",
    status: "active",
    role: "Pharmacy",
    createdAt: "2024-01-20",
    email: "central@pharmacy.com",
  },
];

export default async function DashboardPage() {
  const session = await getSession();
  return (
    <SidebarInset>
      <Header session={session} />
      {/* <DashboardHeader /> */}
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Issuers</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarInset>
  );
}
