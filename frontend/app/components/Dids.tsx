"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WalletContext } from "@/providers/Providers";
import { Label } from "@radix-ui/react-label";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { contract } from "@/lib/contract";
import { ethers } from "ethers";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchUserDIDs } from "../server";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dids = () => {
  // const { identitySDK } = useContext(IdentityContext);
  const [dids, setDids] = useState<{ did: string; token: string }[]>([]);
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;
  const [didName, setDidName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const generateDid = async () => {
    if (isConnected) {
      try {
        setIsLoading(true);
        const signer = wallet.signer!;
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dids/create_did_jwt`,
          {
            subject: didName,
            method: "did:ethr",
          },
          {
            headers: {
              "private-key": signer.privateKey,
            },
          }
        );
        console.log(response.data);
        const { token, ipfsHash } = response.data;
        // const signerContract = contract.connect(signer) as any;
        // const tx = await signerContract.setResolvableDIDHash(ipfsHash);
        // console.log("Transaction Processed: ", tx);
        toast.success("DID created successfully!", token);
      } catch (e) {
        toast.error("Failed to create DID");
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast("Connect Wallet");
    }
  };

  useEffect(() => {
    async function fetchDIDs() {
      const dids = await fetchUserDIDs(signer!.address);
      console.log(dids);
      setDids(dids);
    }
    if (isConnected) {
      fetchDIDs();
    }
  }, [wallet]);

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="pb-4 text-2xl font-medium">
          Create Your Decentralized Identifier
        </p>
        <Label className="pb-1">Subject</Label>
        <Input
          placeholder="i.e. oslow_hospital"
          value={didName}
          onChange={(e) => setDidName(e.target.value)}
          className=""
        />
        <div>
          <Label className="pb-1">Method</Label>
          <Input value={"did:ethr"} disabled />
        </div>
        <div className="pt-2">
          <Button onClick={generateDid} className="" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate DID"}
          </Button>
        </div>
      </div>
      <div className="gap-4">
        <p className="pb-4 text-2xl font-medium">Your DIDs</p>
        {dids.length > 0 ? (
          <ScrollArea className="h-[350px] rounded-md border p-4">
            {dids.map((did, index) => (
              <Card key={index} className="flex justify-center items-center">
                <CardContent className="py-2 px-3 h-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className="cursor-pointer">
                        <p className="break-all font-mono">{did.did}</p>
                      </TooltipTrigger>
                      <TooltipContent
                        className="cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(did.token);
                          toast.success("DID token copied!");
                        }}
                      >
                        <p>{did.token.substring(0, 20) + "...."}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {showToken && <p>{did.token}</p>}
                </CardContent>
                {/* <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                  style={{ cursor: "pointer" }}
                >
                  <Info />
                </div> */}
              </Card>
            ))}
          </ScrollArea>
        ) : (
          <p className="text-2xl font-medium opacity-45 self-center">
            No DID Found
          </p>
        )}
      </div>
    </div>
  );
};

export default Dids;
