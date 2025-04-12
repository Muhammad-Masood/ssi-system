import { getSession } from "@/auth";
import { DashboardHeader } from "@/components/dashboard/header";
import RequestsManager from "@/components/dashboard/requests-manager";
import { ReqVcData } from "@/lib/utils";
import axios from "axios";

export default async function RequestsPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex flex-col gap-8 p-6 md:p-8">
        <DashboardHeader
          title="VC Requests"
          description="Manage your verifiable credential requests"
        />
        {/* <RequestsManager vcRequests={[]}/> */}
      </div>
    );
  }
  console.log(session.user!.email);
  const userVcRequestsResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/get_user_vc_requests/${
      session.user!.email
    }`
  );  
  const userVcReq: ReqVcData[] = userVcRequestsResponse.data.user_vc_requests;
  console.log("userVcReq Data: ", userVcReq);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <DashboardHeader
        title="VC Requests"
        description="Manage your verifiable credential requests"
      />
      <RequestsManager vcRequests={userVcReq} />
    </div>
  );
}
