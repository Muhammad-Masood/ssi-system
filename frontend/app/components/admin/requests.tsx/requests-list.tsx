"use client";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReqVcData } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WalletContext } from "@/providers/Providers";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export function RequestsList({ requests }: { requests: ReqVcData[] }) {
  const { wallet } = useContext(WalletContext);
  const [expiry, setExpiry] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async (request: ReqVcData) => {
    if (!wallet.signer) {
      toast.error("Please connect your wallet.");
      return;
    }
    try {
      if (!expiry) {
        toast.error("Please set an expiry date.");
        return;
      }
      setIsLoading(true);

      const bankIdVcData = { ...request, expiryDate: expiry };
      const signer = wallet.signer;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/issue_bank_id_vc`,
        {
          bankIdVcData: bankIdVcData,
        },
        {
          headers: {
            "private-key": signer.privateKey,
          },
        }
      );

      console.log(response.data);
      const { message, documentCid } = response.data;
      toast.success(`BankId VC Issued successfully! CID: ${documentCid}`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to issue BankId VC: ${String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (request: ReqVcData) => {};

  return (
    <div className="grid gap-4">
      {requests.map((request, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={"/placeholder.svg"} alt={request.fullName} />
              <AvatarFallback>
                {request.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{request.fullName}</CardTitle>
              <CardDescription>{request.holderDID}</CardDescription>
            </div>
            <Badge
              variant={request.status === "pending" ? "outline" : "default"}
            >
              {request.status}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Credential Type</div>
                  <div className="text-sm text-muted-foreground">
                    {request.type}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Date of Birth</div>
                  <div className="text-sm text-muted-foreground">
                    {request.birthDate}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">National ID</div>
                  <div className="text-sm text-muted-foreground">
                    {request.nationalID}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Expiry Date</label>
                  <input
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            {/* <Button variant="outline" size="sm">
              View Details
            </Button> */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={request.status !== "pending" || isLoading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will reject the request
                    of the user.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => handleReject(request)}>Reject</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  disabled={isLoading || request.status !== "pending"}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will issue the credential
                    to the user with a signed transaction.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    onClick={() => handleApprove(request)}
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
