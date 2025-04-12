"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileCheck, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RequestStatus } from "./request-status";
import axios from "axios";
import { WalletContext } from "@/providers/Providers";
import { ReqVcData } from "@/lib/utils";
import { getSessionServer, issueBankIdVc } from "../server";
import { toast } from "sonner";

const credentialTypes = [
  { value: "bank-id", label: "Bank ID" },
  { value: "medical-license", label: "Medical License" },
  // { value: "work-permit", label: "Work Permit" },
  // { value: "education", label: "Educational Credential" },
];

export function RequestForm({ userId }: { userId: string | undefined | null }) {
  const router = useRouter();
  const [step, setStep] = React.useState(2);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [documents, setDocuments] = React.useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { wallet } = React.useContext(WalletContext);
  // const session = await getSessionServer();
  // const [selectedCredentialType, setSelectedCredentialType] =
  //   React.useState<string>("");
  const [data, setData] = React.useState<ReqVcData>({
    id: "",
    userId: "",
    status: "pending",
    holderDID: "",
    fullName: "",
    birthDate: "",
    nationalID: "",
    type: "",
    jws: "",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("🚨 Form submitted automatically!");
    const files = event.target.files;
    if (files?.length) {
      setDocuments(Array.from(files));
    }
  };

  const handlePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeFile = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (userId) {
      console.log("VcReq Data: ", data);
      if (!wallet.isConnected) {
        toast.error("Connect your wallet!");
        setIsSubmitting(false);
        return;
      }
      try {
        console.log("log vc req data before req: ",data);
        data.userId = userId;
        const signer = wallet.signer!;
        console.log(signer.privateKey);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/submit_bank_id_vc_request`,
          data,
          {
            headers: {
              "private-key": signer.privateKey,
            },
          }
        );
        console.log(response.data);
        toast.success(`Bank Id VC request submitted successfully`);
      } catch (error) {
        console.log(error);
        toast.error("Failed to process request", {
          description: String(error),
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("User not found! Please login.");
    }
    setStep(4);
    router.refresh();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCredentialChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle>Credential Request Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="did">Decentralized Identifier (DID)</Label>
                <Input
                  id="holderDID"
                  placeholder="did:example:123..."
                  required
                  value={data.holderDID}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  required
                  value={data.fullName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="credential-type">Credential Type</Label>
                <Select onValueChange={handleCredentialChange} required>
                  <SelectTrigger id="credential-type">
                    <SelectValue placeholder="Select credential type" />
                  </SelectTrigger>
                  <SelectContent>
                    {credentialTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={data.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalID">National ID</Label>
                <Input
                  id="nationalID"
                  placeholder="Enter your national ID"
                  value={data.nationalID}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  placeholder="Briefly describe why you need this credential"
                  required
                />
              </div>
            </div>
          )}

          {/* {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documents">Supporting Documents</Label>
                <div className="grid gap-4">
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Input
                      id="documents"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      multiple
                      accept="image/*,.pdf"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mx-auto"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Documents
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Supported formats: PDF, JPG, PNG
                    </p>
                  </div>
                  {documents.length > 0 && (
                    <div className="grid gap-2">
                      {documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {file.name}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handlePreview(file)}
                                >
                                  <span className="sr-only">Preview file</span>
                                  <FileCheck className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Document Preview</DialogTitle>
                                  <DialogDescription>
                                    {file.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {previewUrl && (
                                  <div className="aspect-video overflow-hidden rounded-lg">
                                    {file.type.startsWith("image/") ? (
                                      <img
                                        src={previewUrl || "/placeholder.svg"}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                      />
                                    ) : (
                                      <iframe
                                        src={previewUrl}
                                        className="h-full w-full"
                                      />
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => removeFile(index)}
                            >
                              <span className="sr-only">Remove file</span>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )} */}

          {step === 4 && <RequestStatus />}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step < 4 && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(Math.min(3, step + 1))}
                >
                  Next
                </Button>
              ) : (
                // <></>
                <Button
                  disabled={isSubmitting}
                  type="button"
                  onClick={handleSubmit}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Request
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
