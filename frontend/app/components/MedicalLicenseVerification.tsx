"use client";

import type React from "react";

import { useState } from "react";
import {
  FileUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Shield,
  Calendar,
  User,
  Building,
  Award,
  Hash,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import pdfToText from "react-pdftotext";
import axios from "axios";

type CertificateData = {
  doctor_name: string;
  license_number: string;
  issuer: string;
  institution: string;
  issue_date: string; // format: YYYY-MM-DD
  expiration_date: string;
  accreditation_code: string;
};

type VerificationStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "extracted"
  | "verified"
  | "rejected";

export function MedicalLicenseVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [activeTab, setActiveTab] = useState("upload");
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      console.log("Selected File: ", selectedFile);
      setStatus("processing");
      try {
        const text = await pdfToText(selectedFile);
        console.log("extracted text: ", text);
        const cert = extractCertFieldsFromText(text);
        console.log("extracted cert: ", cert);
        setCertificateData(cert);
        // Send extracted text to FastAPI for model prediction
        // const response = await axios.post(
        //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/verify_certificate`,
        //   {}
        // );
        // const data = await response.data;
        // console.log("response_data: ", data);
        setStatus("extracted");
        setActiveTab("information");
      } catch (error) {
        console.error("Extraction failed", error);
        setStatus("rejected");
      }
      // simulateUpload();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      // simulateUpload();
    }
  };

  const extractCertFieldsFromText = (text: string) => {
    const doctorNameMatch = /Full Name:\s*(.*?)\s*Date of Birth:/.exec(text);
    const licenseNumberMatch = /HPR Number.*?:\s*(HPR\d+)/.exec(text);
    const issuerMatch = /Issuing Authority:\s*([^\n\/]*)/.exec(text);
    // const issuerMatch = /Issuing Authority:\s*(.*?)\s*Address:/.exec(text);
    const institutionMatch = /Verifier\/Institution:\s*(.*?)\s*Purpose:/.exec(
      text
    );
    const issueDateMatch = /Issuance Date:\s*(\d{4}-\d{2}-\d{2})/.exec(text);
    const expirationDateMatch = /Expiry Date.*?:\s*(\d{4}-\d{2}-\d{2})/.exec(
      text
    );
    const accreditationCodeMatch = /Accreditation Code:\s*([A-Z0-9\-]+)/.exec(
      text
    );

    const cert = {
      doctor_name: doctorNameMatch?.[1]?.trim() || "",
      license_number: licenseNumberMatch?.[1]?.trim() || "",
      issuer: issuerMatch?.[1]?.trim() || "",
      institution: institutionMatch?.[1]?.trim() || "",
      issue_date: issueDateMatch?.[1] || "",
      expiration_date: expirationDateMatch?.[1] || "",
      accreditation_code: accreditationCodeMatch?.[1] || "",
    };
    return cert;
  };

  const handleVerify = async () => {
    if (!certificateData) return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_API_BASE_URL}/verify_certificate_ai`,
        certificateData
      );
      const data = await response.data;
      console.log("response_data: ", data);
      setStatus(data.prediction == "Fraudulent" ? "rejected" : "verified");
      setActiveTab("verification");
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadProgress(0);
    setStatus("idle");
    setCertificateData(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full overflow-hidden bg-white shadow-md">
      <CardHeader className="bg-sky-50 pb-6">
        <CardTitle className="flex items-center justify-center gap-2 text-sky-700">
          <Shield className="h-6 w-6" />
          Intelligent Medical License Verification
        </CardTitle>
        <CardDescription className="text-center text-sky-600">
          Upload a medical license PDF to verify its authenticity
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger
              value="upload"
              // disabled={status === "idle" ? false : status !== "uploading"}
            >
              Certificate Upload
            </TabsTrigger>
            <TabsTrigger
              value="information"
              disabled={!["extracted", "verified", "rejected"].includes(status)}
            >
              Extracted Information
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              disabled={!["verified", "rejected"].includes(status)}
            >
              Verification Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-0">
            <div
              className={`mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                status === "idle" || status === "uploading"
                  ? "border-sky-200 bg-sky-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {status === "idle" ? (
                <>
                  <FileUp className="mb-4 h-12 w-12 text-sky-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-700">
                    Drag and drop your medical license PDF
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">
                    or click to browse files (PDF only)
                  </p>
                  <input
                    type="file"
                    id="license-upload"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("license-upload")?.click()
                    }
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    Select File
                  </Button>
                </>
              ) : status === "uploading" ? (
                <div className="w-full">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-sky-700">
                      {file?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 w-full" />
                  <p className="mt-2 text-center text-sm text-gray-600">
                    Uploading file...
                  </p>
                </div>
              ) : status === "processing" ? (
                <div className="flex flex-col items-center">
                  <Clock className="mb-4 h-12 w-12 animate-pulse text-sky-400" />
                  <p className="text-center text-gray-700">
                    Processing document and extracting information...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FileText className="mb-4 h-12 w-12 text-sky-400" />
                  <p className="text-center text-gray-700">
                    Document uploaded and processed successfully
                  </p>
                </div>
              )}
            </div>

            {(status === "extracted" || status === "processing") && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleVerify}
                  disabled={status === "processing"}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  {status === "processing" ? "Processing..." : "Verify License"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="information" className="mt-0">
            {certificateData && (
              <div className="rounded-lg border border-gray-200">
                <div className="bg-sky-50 p-4">
                  <h3 className="flex items-center gap-2 text-lg font-medium text-sky-700">
                    <FileText className="h-5 w-5" />
                    Extracted Certificate Information
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <User className="h-4 w-4" /> Doctor's Name
                      </p>
                      <p className="text-lg font-medium text-gray-800">
                        {certificateData.doctor_name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Building className="h-4 w-4" /> Issuing Authority
                      </p>
                      <p className="text-lg text-gray-800">
                        {certificateData.issuer}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Hash className="h-4 w-4" /> License Number
                      </p>
                      <p className="font-mono text-lg text-gray-800">
                        {certificateData.license_number}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Award className="h-4 w-4" /> Institution
                      </p>
                      <p className="text-lg text-gray-800">
                        {certificateData.institution}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Calendar className="h-4 w-4" /> Issue Date
                      </p>
                      <p className="text-lg text-gray-800">
                        {formatDate(certificateData.issue_date)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Calendar className="h-4 w-4" /> Expiry Date
                      </p>
                      <p className="text-lg text-gray-800">
                        {formatDate(certificateData.expiration_date)}
                      </p>
                    </div>
                  </div>

                  {certificateData.accreditation_code && (
                    <div className="p-4">
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <Shield className="h-4 w-4" /> Accreditation Code
                        </p>
                        <p className="font-mono text-lg text-gray-800">
                          {certificateData.accreditation_code}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {status === "extracted" && (
                  <div className="flex justify-center bg-gray-50 p-4">
                    <Button
                      onClick={handleVerify}
                      className="bg-sky-600 hover:bg-sky-700"
                    >
                      Verify License
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="verification" className="mt-0">
            <div
              className={`rounded-lg border p-6 ${
                status === "verified"
                  ? "border-green-100 bg-green-50"
                  : "border-red-100 bg-red-50"
              }`}
            >
              {status === "verified" ? (
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                  <h3 className="mb-2 text-xl font-bold text-green-700">
                    ✅ Verified: This certificate is legitimate
                  </h3>
                  <p className="mb-6 text-green-600">
                    This medical license has been verified and is currently
                    active.
                  </p>
                  <div className="rounded-lg bg-white p-4 text-left shadow-sm">
                    <h4 className="mb-2 font-medium text-gray-700">
                      Verification Details:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• License is active and in good standing</li>
                      <li>• Issuing authority confirmed authenticity</li>
                      <li>• No disciplinary actions on record</li>
                      <li>
                        • Verification completed on{" "}
                        {new Date().toLocaleDateString()}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
                  <h3 className="mb-2 text-xl font-bold text-red-700">
                    ❌ Warning: This certificate could not be verified
                  </h3>
                  <p className="mb-6 text-red-600">
                    We could not verify the authenticity of this medical
                    license.
                  </p>
                  <div className="rounded-lg bg-white p-4 text-left shadow-sm">
                    <h4 className="mb-2 font-medium text-gray-700">
                      Possible reasons:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        • License information may be incorrect or outdated
                      </li>
                      <li>• Document may contain errors or alterations</li>
                      <li>
                        • Issuing authority could not confirm authenticity
                      </li>
                      <li>• License may have been suspended or revoked</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {status !== "idle" && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={resetForm}
              className="text-sky-700"
            >
              Verify Another License
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
