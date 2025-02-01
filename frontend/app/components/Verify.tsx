"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletContext } from "@/providers/Providers";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { getSessionServer, getUserWallet } from "../server";

const Verify = () => {
  const { wallet } = useContext(WalletContext);
  const [isDIDLoading, setIsDIDLoading] = useState(false);
  const [isCertLoading, setIsCertLoading] = useState(false);
  const [didVerificationStatus, setDidVerificationStatus] = useState<
    "success" | "error" | undefined
  >(undefined);
  const [vcVerificationStatus, setVcVerificationStatus] = useState<
    "success" | "error" | undefined
  >(undefined);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const verifyDID = async () => {
    if (!wallet.isConnected) {
      toast("Please connect your wallet first.");
      return;
    }

    setIsDIDLoading(true);
    setDidVerificationStatus(undefined);

    try {
      const didToken = searchParams.get("did_token");
      console.log(didToken);
      if (!didToken) {
        toast.error("DID Token is missing.");
        setIsDIDLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dids/verify_did_jwt`,
        {
          headers: {
            token: didToken,
          },
        }
      );

      const { offChainVerificationStatus, onChainVerificationStatus } =
        response.data;

      if (offChainVerificationStatus && onChainVerificationStatus) {
        setDidVerificationStatus("success");
        toast.success("DID Verified Successfully");
      } else {
        setDidVerificationStatus("error");
        toast.error("DID Verification Failed");
      }

      setIsDIDLoading(false);
    } catch (error) {
      setIsDIDLoading(false);
      setDidVerificationStatus("error");
      console.error(error);
      toast.error("Failed to verify DID.");
    }
  };

  const verifyVC = async (vcJwt: string) => {
    setVcVerificationStatus(undefined);
    // const wallet = await getUserWallet();
    // const session = await getSessionServer();
    // console.log(session);
    // const wallet = session?.user?.wallet;
    if (wallet) {
      setIsCertLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/verify_vc?issuerAddress=${
            wallet.signer!.address
          }`,
          {
            headers: {
              "vc-jwt": vcJwt,
              // "private-key": wallet.privateKey,
            },
          }
        );

        const { verificationResponse, onChainVerificationResponse } =
          response.data;

        if (verificationResponse.verified && onChainVerificationResponse) {
          setVcVerificationStatus("success");
          toast.success("Certificate Verified Successfully");
        } else {
          setVcVerificationStatus("error");
          toast.error("Certificate Verification Failed");
        }

        setIsCertLoading(false);
      } catch (error) {
        setIsCertLoading(false);
        setVcVerificationStatus("error");
        console.error(error);
        toast.error("Failed to verify certificate.");
      }
    } else {
      toast.error("Please connect your wallet first.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-10 bg-gray-100 p-6 md:p-10">
      {/* DID Verification Section */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-5">
        <Label className="text-xl font-semibold text-gray-800">
          Verify DID
        </Label>
        <div className="flex space-x-4">
          <Input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            onChange={(e) =>
              router.push(
                pathName + "?" + createQueryString("did_token", e.target.value)
              )
            }
            placeholder="Enter DID Token"
          />
          <Button
            className="w-36 flex justify-center items-center px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            onClick={verifyDID}
            disabled={isDIDLoading}
          >
            {isDIDLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
        {didVerificationStatus === "success" && (
          <div className="flex items-center space-x-2 text-green-600 mt-4">
            <CheckCircle className="w-5 h-5" />
            <span>DID Verification Successful</span>
          </div>
        )}
        {didVerificationStatus === "error" && (
          <div className="flex items-center space-x-2 text-red-600 mt-4">
            <XCircle className="w-5 h-5" />
            <span>DID Verification Failed</span>
          </div>
        )}
      </div>

      {/* Certificate (VC) Verification Section */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-5">
        <Label className="text-xl font-semibold text-gray-800">
          Verify Certificate (VC)
        </Label>
        <div className="space-y-4">
          <Input
            id="vcJwt"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter Certificate JWT"
          />
          {/* <Input
            id="privateKey"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter Private Key"
            type="password"
          /> */}
          <Button
            className="w-full flex justify-center items-center px-4 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            onClick={() =>
              verifyVC(
                (document.getElementById("vcJwt") as HTMLInputElement).value
              )
            }
            disabled={isCertLoading}
          >
            {isCertLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
        {vcVerificationStatus === "success" && (
          <div className="flex items-center space-x-2 text-green-600 mt-4">
            <CheckCircle className="w-5 h-5" />
            <span>Certificate Verification Successful</span>
          </div>
        )}
        {vcVerificationStatus === "error" && (
          <div className="flex items-center space-x-2 text-red-600 mt-4">
            <XCircle className="w-5 h-5" />
            <span>Certificate Verification Failed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
