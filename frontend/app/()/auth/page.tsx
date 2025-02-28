import { Label } from "@radix-ui/react-label";
import Login from "../../components/Login";
import { getSession } from "@/auth";
import Logout from "../../components/Logout";
// import Authorization from "../components/Auth";

const page = async () => {
  const session = await getSession();
  return (
    <div className="">{session ? "You are already Signed In" : <Login />}</div>
  );
};

export default page;
