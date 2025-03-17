"use client";
import { useContext, useEffect, useState } from "react";
import { ethers, toNumber } from "ethers";
import { WalletContext } from "@/providers/Providers";
import { Button } from "@/components/ui/button";
import { DecentralizeIdentity } from "cf-identity";
import { toast } from "sonner";
import { getSession } from "@/auth";
import { getSessionServer, getUserWallet } from "../server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
// import Wallet from ""
export function ConnectWallet() {
  const { wallet, setWallet } = useContext(WalletContext);
  const { isConnected } = wallet;
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string | undefined>("");

  const handleConnect = async () => {
    try {
      if (isConnected) {
        console.log("opening window");
        window.open(
          `https://testnet.bscscan.com/address/${wallet.signer!.address}`,
          "_blank"
        );
      } else {
        const session = await getSessionServer();
        if (session) {
          setIsConnecting(true);
          const userWalletDocRef = doc(db, "wallets", session.user!.email!);
          const walletDoc = await getDoc(userWalletDocRef);
          const walletData = walletDoc.data()! as any;
          const provider = new ethers.JsonRpcProvider(
            // process.env.NEXT_PUBLIC_RPC_URL as string
            "https://bsc-testnet.nodereal.io/v1/54ee4dc00e384bbc8c8a75d42287f585"
          );
          const wallet = new ethers.Wallet(walletData.privateKey, provider);
          console.log(walletData.tab);
          setWallet({
            provider: provider,
            signer: wallet,
            isConnected: true,
            tab: walletData.tab,
          });
          setIsConnecting(false);
          const walletBalance = await provider.getBalance(wallet.address);
          console.log(walletBalance);
          setWalletBalance(
            String(Number(ethers.formatEther(walletBalance)).toFixed(2))
          );
        } else {
          toast.error("Login to your account.");
        }
      }
    } catch (error) {
      toast.error(String(error));
    }
  };

  // useEffect(() => {
  //   handleConnect();
  // }, []);

  return (
    <div className="flex lg:flex-row items-center justify-center lg:space-x-6 space-y-4 lg:space-y-0">
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`px-6 py-2 rounded-md shadow-md ${
          isConnecting ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {isConnected
          ? `✅ Connected ${wallet.signer!.address.slice(0, 6)}...`
          : isConnecting
          ? "🔄 Connecting..."
          : "Connect Wallet"}
      </Button>

      {/* <div>
        {wallet.signer && (
          <div className="flex items-center lg:items-start bg-gray-50 p-4 rounded-lg shadow-lg">
            <div className="flex items-center mt-1">
              <Link
                href={`https://testnet.bscscan.com/address/${wallet.signer.address}`}
                target="_blank"
                className="text-sm font-medium truncate w-64 ml-2 cursor-pointer"
              >
                <p>{wallet.signer.address}</p>
              </Link>
            </div>

            <div className="flex items-center mt-1">
              <p className="text-sm font-medium ml-2">
                {walletBalance ? `${walletBalance} BNB` : "..."}
              </p>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}
