"use client";

import { useContext, useState } from "react";
import { WalletContext } from "@/providers/Providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  ClockIcon,
  FileCheck,
  InboxIcon,
  XIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ConnectWallet } from "@/app/components/ConnectWallet";
import axios from "axios";
import { ReqVcData } from "@/lib/utils";

export default function RequestsManager({
  vcRequests,
}: {
  vcRequests: ReqVcData[];
}) {
  const { wallet } = useContext(WalletContext);
  const { isConnected, signer } = wallet;


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (!isConnected) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect your wallet to view and manage your credential requests.
          </p>
          <ConnectWallet />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Credential Requests</span>
              <span className="text-sm font-normal text-muted-foreground">
                Total: {vcRequests.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vcRequests.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {vcRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <InboxIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {request.type}
                              </span>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              From: {request.holderDID}
                            </span>
                            {/* <span className="text-muted-foreground flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {formatDate(request.date)}
                            </span> */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <InboxIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No incoming requests</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any incoming credential requests.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
