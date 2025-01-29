import Credentials from "../components/Credentials";
import Dids from "../components/Dids";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl mt-[4rem]">
      <h1 className="text-4xl font-bold text-center mb-16">Your Profile</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Decentralized Identifiers</h2>
          <Dids />
        </div>
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Credentials</h2>
          <Credentials />
        </div>
      </div>
    </div>
  );
};

export default Profile;
