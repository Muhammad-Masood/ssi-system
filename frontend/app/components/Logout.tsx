"use client";

// pages/auth/logout.tsx
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Adjust this import to your button component path
import google from "@/public/google.png";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function Logout() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="bg-white px-[5rem] py-[2rem] rounded-lg shadow-md items-center flex flex-col">
          <div className="pb-1 mb-4">
            <h1 className="text-3xl text-gray-800 font-bold text-center pb-4">
              Sign Out
            </h1>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-150 ease-in-out"
            >
              {/* <Image src={google} alt="google" width={20} height={20} /> */}
              <LogOut size={20} />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
