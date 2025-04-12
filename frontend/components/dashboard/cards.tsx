"use client";

import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/providers/Providers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, FileCheck, InboxIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  fetchUserDIDs,
  getUserIssuedCertificatesHashes,
  getUserOwnedCertificatesHashes,
} from "@/app/server";
import { ConnectWallet } from "@/app/components/ConnectWallet";

export function DashboardCards() {
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;
  const [didCount, setDidCount] = useState(0);
  const [issuedCredentialsCount, setIssuedCredentialsCount] = useState(0);
  const [ownedCredentialsCount, setOwnedCredentialsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!isConnected || !signer) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const address = signer.address;

        // Fetch DIDs
        const dids = await fetchUserDIDs(address);
        setDidCount(dids.length);

        // Fetch credentials
        const issuedCIDs = await getUserIssuedCertificatesHashes(address);
        setIssuedCredentialsCount(issuedCIDs.length);

        const ownedCIDs = await getUserOwnedCertificatesHashes(address);
        setOwnedCredentialsCount(ownedCIDs.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [isConnected, signer]);

  const cards = [
    {
      title: "DIDs",
      description: "Manage your decentralized identifiers",
      icon: Fingerprint,
      value: didCount,
      href: "/dashboard/dids",
      color: "bg-blue-500",
    },
    {
      title: "Issued Credentials",
      description: "Credentials you've issued to others",
      icon: FileCheck,
      value: issuedCredentialsCount,
      href: "/dashboard/credentials",
      color: "bg-green-500",
    },
    {
      title: "Owned Credentials",
      description: "Credentials issued to you",
      icon: FileCheck,
      value: ownedCredentialsCount,
      href: "/dashboard/credentials",
      color: "bg-purple-500",
    },
    {
      title: "VC Requests",
      description: "Manage credential verification requests",
      icon: InboxIcon,
      value: 0,
      href: "/dashboard/requests",
      color: "bg-amber-500",
    },
  ];

  if (!isConnected) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to view your DIDs and credentials
          </CardDescription>
        </CardHeader>
        <CardFooter>
           <ConnectWallet />
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`rounded-full p-1 ${card.color} text-white`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href={card.href}>
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
