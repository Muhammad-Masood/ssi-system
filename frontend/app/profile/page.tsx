import Credentials from "../components/Credentials";
import Dids from "../components/Dids";

const profile = () => {
  return (
    <div className="p-4 mt-32  max-w-7xl mx-auto">
      <p className="text-2xl font-semibold text-center pb-[4rem]">
        Your Profile
      </p>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 pb-[3rem] px-[2rem] pt-[1.5rem]">
        <Dids />
        <Credentials />
      </div>
    </div>
  );
};

export default profile;
