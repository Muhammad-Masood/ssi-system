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
// import Wallet from ""
export function ConnectWallet() {
  const { wallet, setWallet } = useContext(WalletContext);
  const { isConnected } = wallet;
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      // const dbwallet = await getUserWallet();
      const session = await getSessionServer();
      // if (dbwallet) {
      if (session) {
        setIsConnecting(true);
        const userWalletDocRef = doc(db, "wallets", session.user!.email!);
        const walletDoc = await getDoc(userWalletDocRef);
        const walletData = walletDoc.data()! as any;
        const provider = new ethers.JsonRpcProvider(
          process.env.RPC_URL as string
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
      } else {
        toast.error("Login to your account.");
      }
    } catch (error) {
      toast.error(String(error));
    }
  };

  // useEffect(() => {
  //   handleConnect();
  // }, []);

  return (
    <div className="flex lg:flex-row md:flex-row flex-col space-y-3 lg:space-y-0 md:space-y-0 items-center justify-center">
      <Button onClick={handleConnect} disabled={isConnecting}>
        {isConnected
          ? "Connected"
          : isConnecting
          ? "Connecting..."
          : "Connect Wallet"}
      </Button>
      {wallet.signer ? (
        <Badge className="ml-2 py-2">{wallet.signer.address}</Badge>
      ) : null}
    </div>
  );
}
