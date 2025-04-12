import { Label } from "@radix-ui/react-label";
import Login from "../../components/Login";
import { getSession } from "@/auth";
import Logout from "../../components/Logout";
// import Authorization from "../components/Auth";

const page = async () => {
  const session = await getSession();
  return session ? (
    <div className="justify-center flex items-center">
      <p className="mt-[4rem]">You are already Signed In</p>
    </div>
  ) : (
    <Login />
  );
};

export default page;
