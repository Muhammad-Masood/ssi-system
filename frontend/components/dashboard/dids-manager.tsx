"use client";

import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/providers/Providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios, { type AxiosError } from "axios";
import { fetchUserDIDs, deleteUserDid } from "@/app/server";
import type { DIDDB } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  CopyIcon,
  InfoIcon,
  Trash2Icon,
  Fingerprint,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function DidsManager() {
  const [dids, setDids] = useState<DIDDB[]>([]);
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;
  const [didName, setDidName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDids, setIsLoadingDids] = useState(true);
  const [copiedToken, setCopiedToken] = useState("");
  const router = useRouter();

  const generateDid = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!didName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }

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

      const { token, ipfsHash, did } = response.data;
      setDids((prev) => [...prev, { did, token, ipfsHash, isDeleting: false }]);
      setDidName("");
      toast.success("DID created successfully!");
      router.refresh();
    } catch (e: AxiosError | any) {
      const errorMessage =
        ((e as AxiosError).response?.data as any)?.details || e.message;
      toast.error(`Failed to create DID: ${errorMessage}`);
    } finally {
      setIsLoading(false);
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
    } catch (e: any) {
      toast.error(`Failed to delete DID: ${e.message}`);
    } finally {
      setDids((prev) =>
        prev.map((item) =>
          item.did === did ? { ...item, isDeleting: false } : item
        )
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(""), 3000);
  };

  useEffect(() => {
    async function fetchDIDs() {
      if (!isConnected || !signer) return;

      try {
        setIsLoadingDids(true);
        const dids = await fetchUserDIDs(signer.address);
        setDids(dids);
      } catch (error) {
        console.error("Error fetching DIDs:", error);
        toast.error("Failed to fetch DIDs");
      } finally {
        setIsLoadingDids(false);
      }
    }

    fetchDIDs();
  }, [isConnected, signer]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create New DID</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="i.e. oslow_hospital"
              value={didName}
              onChange={(e) => setDidName(e.target.value.replace(/\s+/g, "_"))}
            />
            <p className="text-xs text-muted-foreground">
              This will be part of your DID identifier. Use underscores instead
              of spaces.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="method">Method</Label>
            <Input id="method" value="did:ethr" disabled />
            <p className="text-xs text-muted-foreground">
              The DID method defines how the DID is resolved and verified.
            </p>
          </div>
          <Button
            onClick={generateDid}
            disabled={isLoading || !isConnected}
            className="w-full"
          >
            {isLoading ? "Generating..." : "Generate DID"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your DIDs</CardTitle>
          <div className="text-sm text-muted-foreground">
            {!isLoadingDids && `Total: ${dids.length}`}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingDids ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-3 border rounded-md"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : dids.length > 0 ? (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {dids.map((did, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
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
                              <p className="mt-2 break-all font-mono text-xs">
                                {did.token}
                              </p>
                            </PopoverContent>
                          </Popover>
                          <div className="truncate">
                            <p className="font-mono text-sm truncate">
                              {did.did}
                            </p>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 ml-2 flex-shrink-0"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Delete DID</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this DID? This
                                action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 p-4 bg-muted rounded-md">
                              <p className="font-mono text-sm break-all">
                                {did.did}
                              </p>
                            </div>
                            <DialogFooter className="mt-4">
                              <Button
                                disabled={did.isDeleting}
                                variant="destructive"
                                onClick={() =>
                                  deleteDID(did.did, did.token, did.ipfsHash)
                                }
                              >
                                {did.isDeleting ? "Deleting..." : "Delete DID"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Fingerprint className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No DIDs Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first decentralized identifier to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
