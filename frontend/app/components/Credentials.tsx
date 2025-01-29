"use client";

import { WalletContext } from "@/providers/Providers";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getRevokedCIDs,
  getUserIssuedCertificatesHashes,
  getUserOwnedCertificatesHashes,
} from "../server";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import axios from "axios";
import { Wallet } from "ethers";

const revokeCredential = async (cid: string, signer: undefined | Wallet) => {
  // const { wallet } = useContext(WalletContext);
  try {
    // TODO: Implement the actual revocation logic here
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/revoke_vc`,
      {
        cidHash: cid,
      },
      {
        headers: {
          "private-key": signer!.privateKey,
        },
      }
    );
    console.log(response.data);
    console.log(`Revoking credential with CID: ${cid}`);
    toast.success(`Credential ${cid} revoked successfully`);
    return true;
  } catch (error: any) {
    console.error(error);
    toast.error(`Failed to revoke credential: ${error.message}`);
    return false;
  }
};

const CredentialList = ({
  credentials,
  revokedCredentials,
  title,
  setCredentials,
}: {
  credentials: string[];
  revokedCredentials: string[];
  title: "Issued Credentials" | "Owned Credentials";
  setCredentials: (creds: string[]) => void;
}) => {
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const { wallet } = useContext(WalletContext);

  const handleRevoke = async (cid: string) => {
    setIsRevoking(cid);
    const success = await revokeCredential(cid, wallet.signer);
    // if (success) {
    //   setCredentials(credentials.filter((c) => c !== cid));
    // }
    setIsRevoking(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">{title}</h3>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          {credentials.length > 0 ? (
            credentials.map((cid, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-grow mr-4">
                    <p className="break-all font-mono text-sm">{cid}</p>
                  </div>
                  <div className="flex items-center space-x-2">
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
                    {revokedCredentials.includes(cid) ? (
                      <Button variant="destructive" size="sm" disabled>
                        <Trash2Icon className="h-4 w-4 mr-2" />
                        Revoked
                      </Button>
                    ) : (
                      title === "Issued Credentials" && (
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
                                Are you sure you want to revoke this credential?
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() => handleRevoke(cid)}
                                disabled={isRevoking === cid}
                              >
                                {isRevoking === cid ? "Revoking..." : "Revoke"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-lg text-gray-500 italic">
              No {title.toLowerCase()} found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const Credentials = () => {
  const [issuedCredentialsCids, setIssuedCredentialsCids] = useState<string[]>(
    []
  );
  const [ownedCredentialsCids, setOwnedCredentialsCids] = useState<string[]>(
    []
  );
  const [revokedCredentials, setRevokedCredentials] = useState<string[]>([]);
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;
  useEffect(() => {
    async function fetchCredentials() {
      try {
        const address: string = signer!.address;
        console.log(address);
        const issuedCIDs = await getUserIssuedCertificatesHashes(address);
        setIssuedCredentialsCids(issuedCIDs);
        const ownedCIDs = await getUserOwnedCertificatesHashes(address);
        console.log("cids: ", issuedCIDs, ownedCIDs);
        setOwnedCredentialsCids(ownedCIDs);
        const userRevokedCIDs = await getRevokedCIDs(address);
        console.log("revoked cids: ", userRevokedCIDs);
        setRevokedCredentials(userRevokedCIDs);
      } catch (error) {
        console.log(error);
      }
    }
    if (isConnected) {
      console.log("Calling fetch credentials");
      fetchCredentials();
    }
  }, [wallet]);

  return (
    <div className="space-y-8">
      <CredentialList
        credentials={issuedCredentialsCids}
        title="Issued Credentials"
        setCredentials={setIssuedCredentialsCids}
        revokedCredentials={revokedCredentials}
      />
      <CredentialList
        credentials={ownedCredentialsCids}
        title="Owned Credentials"
        setCredentials={setOwnedCredentialsCids}
        revokedCredentials={revokedCredentials}
      />
    </div>
  );
};

export default Credentials;
