"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DIDDB, issueCredFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "@/providers/Providers";
import { toast } from "sonner";
import { createCredential, fetchUserDIDs } from "../server";
import axios from "axios";

const IssueCredForm = () => {
  const [issuerDIDs, setIssuerDIDs] = useState<DIDDB[]>([]);
  const [did, setDid] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [previewImage, setPreviewImage] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { wallet } = useContext(WalletContext);
  const { isConnected } = wallet;
  const issueCredForm = useForm<z.infer<typeof issueCredFormSchema>>({
    resolver: zodResolver(issueCredFormSchema),
  });

  useEffect(() => {
    async function fetchDIDs() {
      const issuer_dids = await fetchUserDIDs(wallet.signer!.address);
      setIssuerDIDs(issuer_dids || []);
    }
    if (isConnected) {
      fetchDIDs();
    }
  }, [wallet]);

  async function onSubmit(values: z.infer<typeof issueCredFormSchema>) {
    if (isConnected) {
      setIsLoading(true);
      const loadingId = toast.loading("Issuing Credential...");
      values.issuer_address = wallet.signer!.address;
      values.issuer_did = did;
      const { certificate_name, issuer_address, holder_did, issuer_did } =
        values;
      try {
        console.log(values);
        const pinataEndpoint =
          process.env.NEXT_PUBLIC_PINATA_GATEWAY + "/pinning/pinFileToIPFS";
        const form_data = new FormData();
        form_data.append("file", selectedFile);
        const { data } = await axios.post(pinataEndpoint, form_data, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("data -> ", data);
        await createCredential(
          certificate_name,
          issuer_address,
          issuer_did,
          holder_did,
          wallet.signer!.privateKey,
          data.IpfsHash
        );
        toast.dismiss(loadingId);
        toast.success(`Credential stored successfully`);
      } catch (error) {
        console.log(String(error));
        toast.error("Failed to store credential");
        // setIsLoading(false);
      } finally {
        setIsLoading(false);
        toast.dismiss(loadingId);
      }
    } else {
      toast("Connect Wallet");
    }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader?.result);
      };
      reader.readAsDataURL(file);
      toast.success("File uploaded successfully!");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Issue Credential
      </h1>
      <Form {...issueCredForm}>
        <form
          onSubmit={issueCredForm.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Issuer Address */}
          <FormField
            control={issueCredForm.control}
            name="issuer_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    value={
                      isConnected ? wallet.signer!.address : "Connect Wallet"
                    }
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Issuer DID */}
          <FormField
            control={issueCredForm.control}
            name="issuer_did"
            render={() =>
              issuerDIDs.length > 0 ? (
                <FormItem>
                  <FormLabel>Select Issuer DID</FormLabel>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        {did ? did : "Choose DID"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                      {issuerDIDs.map((issuerDid, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => setDid(issuerDid.did)}
                        >
                          <p className="break-all">{issuerDid.did}</p>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormItem>
              ) : (
                <p>No DID found</p>
              )
            }
          />

          {/* Holder DID */}
          <FormField
            control={issueCredForm.control}
            name="holder_did"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Holder DID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Holder DID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Credential Upload */}

          <FormField
            control={issueCredForm.control}
            name="certificate_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="i.e Certified Respiratory Therapist"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={issueCredForm.control}
            name="credential"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Credential Document</FormLabel>
                <FormControl>
                  <input
                    type="file"
                    accept=".pdf,.docx,.json"
                    onChange={handleUpload}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </FormControl>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    {selectedFile.name} uploaded
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" className="px-8 py-2" disabled={isLoading}>
              Issue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default IssueCredForm;
