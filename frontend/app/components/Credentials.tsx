"use client";

import { WalletContext } from "@/providers/Providers";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getUserIssuedCertificatesHashes,
  getUserOwnedCertificatesHashes,
} from "../server";
import Link from "next/link";

const Credentials = () => {
  const [issuedCredentialsCids, setIssuedCredentialsCids] = useState<string[]>(
    []
  );
  const [ownedCredentialsCids, setOwnedCredentialsCids] = useState<string[]>(
    []
  );
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;
  useEffect(() => {
    async function fetchCredentials() {
      try {
        const address: string = signer!.address;
        console.log(address)
        const issuedCIDs = await getUserIssuedCertificatesHashes(address);
        const ownedCIDs = await getUserOwnedCertificatesHashes(address);
        console.log("cids: ", issuedCIDs, ownedCIDs);
        setIssuedCredentialsCids(issuedCIDs);
        setOwnedCredentialsCids(ownedCIDs);
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
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="text-2xl font-medium">Issued Credentials</p>
        <ScrollArea className="h-[350px] rounded-md border p-4">
          {issuedCredentialsCids.length > 0 ? (
            issuedCredentialsCids.map((ic_cid: string, i: number) => (
              <Card className="cursor-pointer">
                <CardContent className="py-3 h-auto">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_PINATA_IPFS_GATEWAY}/${ic_cid}`}
                    target="_blank"
                  >
                    <p className="break-all font-mono">{ic_cid}</p>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-2xl font-medium text-gray-700 opacity-50 pt-2">
              No Issued Credentials
            </p>
          )}
        </ScrollArea>
      </div>
      <div className="space-y-3">
        <p className="text-2xl font-medium">Owned Credentials</p>
        <div className="pt-2">
          <ScrollArea className="h-[350px] rounded-md border p-4">
            {ownedCredentialsCids.length > 0 ? (
              ownedCredentialsCids.map((oc_cid: string, i: number) => (
                <Card className="cursor-pointer">
                  <CardContent className="py-3 h-auto">
                    <Link
                      href={`${process.env.NEXT_PUBLIC_PINATA_IPFS_GATEWAY}/${oc_cid}`}
                      target="_blank"
                    >
                      <p className="break-all font-mono">{oc_cid}</p>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-2xl font-medium text-gray-700 opacity-50 pt-2">
                No Holded Credentials
              </p>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
