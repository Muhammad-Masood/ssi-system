import { DashboardHeader } from "@/app/components/admin/dashboard-header";
import { RequestsFilter } from "@/app/components/admin/requests.tsx/requests-filter";
import { RequestsList } from "@/app/components/admin/requests.tsx/requests-list";
import { Header } from "@/app/components/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReqVcData } from "@/lib/utils";
import axios from "axios";
import { getSession } from "next-auth/react";

export default async function RequestsPage() {
  const vc_requests_data_response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/get_vc_requests`
  );
  const vc_requests_data: ReqVcData[] =
    vc_requests_data_response.data.vc_requests;
  console.log(vc_requests_data);
  // const session = await getSession();

  return (
    <SidebarInset>
      {/* <Header session={session} /> */}
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Requests</h2>
            <p className="text-muted-foreground">
              Manage verifiable credential requests from users
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          {/* <RequestsFilter /> */}
          <div className="flex-1">
            <RequestsList requests={vc_requests_data} />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
