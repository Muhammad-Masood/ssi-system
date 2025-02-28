"use client";

// pages/auth/login.tsx
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Adjust this import to your button component path
import google from "@/public/google.png";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Login() {
  const [selectedTab, setSelectedTab] = useState("holder");
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="bg-gray-100 px-[5rem] py-[2rem] rounded-lg shadow-md items-center flex flex-col">
          <div className="pb-3 mb-8">
            <h1 className="text-3xl text-gray-800 font-bold text-center pb-4">
              Sign In
            </h1>
            <p className="tracking-wide">Login as a User, Issuer or Verifier</p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <Tabs defaultValue="holder" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="holder">Holder</TabsTrigger>
                <TabsTrigger value="issuer">Issuer</TabsTrigger>
                <TabsTrigger value="verifier">Verifier</TabsTrigger>
              </TabsList>
            </Tabs>
            <button
              onClick={() => signIn("google", {callbackUrl: `/?tab=${selectedTab}`})}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-150 ease-in-out"
            >
              <Image src={google} alt="google" width={20} height={20} />
              <span className="font-medium">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
