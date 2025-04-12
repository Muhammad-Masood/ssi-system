"use client";

import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/providers/Providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import type { Wallet } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLinkIcon, FileText, Trash2Icon } from "lucide-react";
import Link from "next/link";
import {
  getRevokedCIDs,
  getUserIssuedCertificatesHashes,
  getUserOwnedCertificatesHashes,
} from "@/app/server";
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectWallet } from "@/app/components/ConnectWallet";

const revokeCredential = async (
  cid: string,
  signer: undefined | Wallet,
  endTime?: string
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/revoke_vc`,
      {
        cidHash: cid,
        endTime,
      },
      {
        headers: {
          "private-key": signer!.privateKey,
        },
      }
    );
    toast.success(`Credential ${cid} revoked successfully`);
    return true;
  } catch (error: any) {
    console.error(error);
    toast.error(`Failed to revoke credential: ${error.message}`);
    return false;
  }
};

interface CredentialListProps {
  credentials: string[];
  revokedCredentials: string[];
  title: "Issued Credentials" | "Owned Credentials";
  setCredentials: (creds: string[]) => void;
  isLoading: boolean;
}

function CredentialList({
  credentials,
  revokedCredentials,
  title,
  setCredentials,
  isLoading,
}: CredentialListProps) {
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const { wallet } = useContext(WalletContext);
  const [revocationType, setRevocationType] = useState<
    "permanent" | "temporary"
  >("permanent");
  const [revocationEndDate, setRevocationEndDate] = useState<string>("");

  const handleRevoke = async (cid: string) => {
    setIsRevoking(cid);
    const success = await revokeCredential(
      cid,
      wallet.signer,
      revocationType === "temporary" ? revocationEndDate : undefined
    );
    if (success) {
      // Optionally update the UI after successful revocation
    }
    setIsRevoking(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-20" />
                  {title === "Issued Credentials" && (
                    <Skeleton className="h-9 w-20" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-1">No {title.toLowerCase()} found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {title === "Issued Credentials"
            ? "You haven't issued any credentials yet."
            : "You don't have any credentials yet."}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {credentials.map((cid, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-grow mr-4">
                  <p className="break-all font-mono text-xs">{cid}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_PINATA_IPFS_GATEWAY}/${cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLinkIcon className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  {title === "Issued Credentials" &&
                    !revokedCredentials.includes(cid) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2Icon className="h-4 w-4 mr-2" />
                            Revoke
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Revoke Credential</DialogTitle>
                            <DialogDescription>
                              Choose how you want to revoke this credential.
                            </DialogDescription>
                          </DialogHeader>
                          <RadioGroup
                            value={revocationType}
                            onValueChange={(value) =>
                              setRevocationType(
                                value as "permanent" | "temporary"
                              )
                            }
                            className="mt-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="permanent"
                                id="permanent"
                              />
                              <Label htmlFor="permanent">Permanent</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="temporary"
                                id="temporary"
                              />
                              <Label htmlFor="temporary">Temporary</Label>
                            </div>
                          </RadioGroup>
                          {revocationType === "temporary" && (
                            <div className="flex flex-col space-y-2 mt-4">
                              <Label htmlFor="endDate">Revoke until:</Label>
                              <Input
                                type="date"
                                id="endDate"
                                value={revocationEndDate}
                                onChange={(e) =>
                                  setRevocationEndDate(e.target.value)
                                }
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                          )}
                          <DialogFooter className="mt-6">
                            <Button
                              variant="destructive"
                              onClick={() => handleRevoke(cid)}
                              disabled={
                                isRevoking === cid ||
                                (revocationType === "temporary" &&
                                  !revocationEndDate)
                              }
                            >
                              {isRevoking === cid ? "Revoking..." : "Revoke"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

export default function CredentialsManager() {
  const [issuedCredentialsCids, setIssuedCredentialsCids] = useState<string[]>(
    []
  );
  const [ownedCredentialsCids, setOwnedCredentialsCids] = useState<string[]>(
    []
  );
  const [revokedCredentials, setRevokedCredentials] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;

  useEffect(() => {
    async function fetchCredentials() {
      if (!isConnected || !signer) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const address: string = signer.address;

        const issuedCIDs = await getUserIssuedCertificatesHashes(address);
        setIssuedCredentialsCids(issuedCIDs);

        const ownedCIDs = await getUserOwnedCertificatesHashes(address);
        setOwnedCredentialsCids(ownedCIDs);

        const userRevokedCIDs = await getRevokedCIDs(address);
        setRevokedCredentials(userRevokedCIDs);
      } catch (error) {
        console.error("Error fetching credentials:", error);
        toast.error("Failed to fetch credentials");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCredentials();
  }, [isConnected, signer]);

  if (!isConnected) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect your wallet to view and manage your credentials.
          </p>
          <ConnectWallet />
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="issued">
      <TabsList className="mb-4">
        <TabsTrigger value="issued">Issued Credentials</TabsTrigger>
        <TabsTrigger value="owned">Owned Credentials</TabsTrigger>
      </TabsList>
      <TabsContent value="issued">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Issued Credentials</span>
              {!isLoading && (
                <span className="text-sm font-normal text-muted-foreground">
                  Total: {issuedCredentialsCids.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CredentialList
              credentials={issuedCredentialsCids}
              title="Issued Credentials"
              setCredentials={setIssuedCredentialsCids}
              revokedCredentials={revokedCredentials}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="owned">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Owned Credentials</span>
              {!isLoading && (
                <span className="text-sm font-normal text-muted-foreground">
                  Total: {ownedCredentialsCids.length}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CredentialList
              credentials={ownedCredentialsCids}
              title="Owned Credentials"
              setCredentials={setOwnedCredentialsCids}
              revokedCredentials={revokedCredentials}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
