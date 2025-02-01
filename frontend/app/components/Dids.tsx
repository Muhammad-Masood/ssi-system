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
import {
  CheckIcon,
  CopyIcon,
  DeleteIcon,
  Info,
  InfoIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
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
  const [copiedToken, setCopiedToken] = useState("");
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
        const { token, ipfsHash, did } = response.data;
        setDids((prev) => [
          ...prev,
          { did, token, ipfsHash, isDeleting: false },
        ]);
        toast.success("DID created successfully!", token);
        router.refresh();
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

  const deleteDID = async (did: string, token: string, hash: string) => {
    try {
      const address: string = wallet.signer!.address;
      const privateKey: string = wallet.signer!.privateKey;
      setDids((prev) =>
        prev.map((item) =>
          item.did === did ? { ...item, isDeleting: true } : item
        )
      );
      const response = await deleteUserDid(token, address, privateKey, hash);
      toast.success(response);
      setDids((prev) => prev.filter((item) => item.did !== did));
      router.refresh();
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(""), 3000);
  };

  useEffect(() => {
    async function fetchDIDs() {
      const dids = await fetchUserDIDs(signer!.address);
      console.log("user_dids: ", dids);
      setDids(dids);
    }
    if (isConnected) {
      fetchDIDs();
    }
  }, [wallet]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">
          Create Your Decentralized Identifier
        </h3>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="i.e. oslow_hospital"
            value={didName}
            onChange={(e) => setDidName(e.target.value.replace(/\s+/g, "_"))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method">Method</Label>
          <Input id="method" value="did:ethr" disabled />
        </div>
        <Button onClick={generateDid} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate DID"}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">Your DIDs</h3>
        {dids.length > 0 ? (
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {dids.map((did, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <InfoIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">DID Token</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(did.token)}
                            >
                              {copiedToken === did.token ? (
                                <CheckIcon className="h-4 w-4" />
                              ) : (
                                <CopyIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="mt-2 break-all font-mono text-sm">
                            {did.token}
                          </p>
                        </PopoverContent>
                      </Popover>
                      <p className="break-all font-mono text-sm pr-3">
                        {did.did}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
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
                            variant="destructive"
                            onClick={() =>
                              deleteDID(did.did, did.token, did.ipfsHash)
                            }
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-lg text-gray-500 italic">No DIDs found</p>
        )}
      </div>
    </div>
  );
};

export default Dids;
