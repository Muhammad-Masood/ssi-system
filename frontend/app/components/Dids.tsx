"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WalletContext } from "@/providers/Providers";
import { Label } from "@radix-ui/react-label";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { contract } from "@/lib/contract";
import { ethers } from "ethers";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteUserDid, fetchUserDIDs } from "../server";
import { DeleteIcon, Info, InfoIcon, TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DIDDB } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Dids = () => {
  // const { identitySDK } = useContext(IdentityContext);
  const [dids, setDids] = useState<DIDDB[]>([]);
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;
  const [didName, setDidName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const router = useRouter();

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
      } catch (e: AxiosError | any) {
        const errorMessage = ((e as AxiosError).response!.data! as any).details;
        toast.error(`Failed to create DID ${errorMessage}`);
        console.log(errorMessage);
      } finally {
        setIsLoading(false);
        router.refresh();
      }
    } else {
      toast("Connect Wallet");
    }
  };

  const deleteDID = async (
    did: string,
    token: string,
    address: string,
    privateKey: string
  ) => {
    try {
      setDids((prev) =>
        prev.map((item) =>
          item.did === did ? { ...item, isDeleting: true } : item
        )
      );
      const response = await deleteUserDid(did, token, address, privateKey);
      toast.success(response);
    } catch (e: any) {
      toast.error(`Failed to delete DID: ${e.message}`);
    } finally {
      setDids((prev) =>
        prev.map((item) =>
          item.did === did ? { ...item, isDeleting: false } : item
        )
      );
      router.refresh();
    }
  };

  useEffect(() => {
    async function fetchDIDs() {
      const dids = await fetchUserDIDs(signer!.address);
      console.log("user_dids: ",dids);
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
              <Card
                key={index}
                className={`flex justify-center items-center ${
                  did.isDeleting ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <CardContent className="py-2 px-3 h-auto flex space-x-3 items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <InfoIcon size={20} />
                    </PopoverTrigger>
                    <PopoverContent
                      className="cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(did.token);
                        toast.success("DID token copied!");
                      }}
                    >
                      <p>{did.token.substring(0, 20) + "...."}</p>
                    </PopoverContent>
                  </Popover>
                  <p className="break-all font-mono">{did.did}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <TrashIcon size={20} className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Delete DID</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this DID?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          disabled={did.isDeleting}
                          type="button"
                          onClick={() =>
                            deleteDID(
                              did.did,
                              did.token,
                              signer!.address,
                              signer!.privateKey
                            )
                          }
                        >
                          {did.isDeleting ? "Deleting" : "Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
