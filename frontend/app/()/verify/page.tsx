import React, { Suspense, useContext } from "react";
import Verify from "../../components/Verify";

const page = () => {
  return (
    <div className="p-4 lg:p-8 mt-[6rem]">
      <p className="text-2xl font-semibold text-center pb-6">
        Verification
      </p>
      <div className="">
        <Suspense fallback={<div></div>}>
          <Verify />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
