"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreatePatient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [holderAddress, setHolderAddress] = useState("");

  // Update the state structure to match the provided FHIR Patient resource
  const [patientData, setPatientData] = useState({
    resourceType: "Patient",
    identifier: "",
    active: true,
    name: "",
    gender: "",
    birthDate: "",
    address: "",
    telecom: "",
    maritalStatus: "",
    multipleBirthBoolean: false,
    photo: "",
    communication: {
      language: {
        coding: [
          {
            system: "urn:ietf:bcp:47",
            code: "en",
            display: "English",
          },
        ],
        text: "English",
      },
      preferred: true,
    },
    generalPractitioner: "",
    managingOrganization: "",
    link: {
      other: {
        reference: "",
      },
      type: "seealso",
    },
  });

  // Replace the handleInputChange function with this simpler version
  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "multipleBirthBoolean") {
      setPatientData({
        ...patientData,
        [field]: value as boolean,
      });
    } else if (field === "languageCode") {
      setPatientData({
        ...patientData,
        communication: {
          ...patientData.communication,
          language: {
            ...patientData.communication.language,
            coding: [
              {
                ...patientData.communication.language.coding[0],
                code: value as string,
              },
            ],
          },
        },
      });
    } else if (field === "languageDisplay") {
      setPatientData({
        ...patientData,
        communication: {
          ...patientData.communication,
          language: {
            ...patientData.communication.language,
            coding: [
              {
                ...patientData.communication.language.coding[0],
                display: value as string,
              },
            ],
            text: value as string,
          },
        },
      });
    } else if (field === "linkReference") {
      setPatientData({
        ...patientData,
        link: {
          ...patientData.link,
          other: {
            reference: value as string,
          },
        },
      });
    } else {
      setPatientData({
        ...patientData,
        [field]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!privateKey) {
      toast.error("Private key is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/fhir/resource/create_patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "private-key": privateKey,
        },
        body: JSON.stringify({
          patientData,
          holderAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create patient");
      }

      toast.success(`Patient created with ID: ${data.docId}`);

      router.push(`/patients/${data.docId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Patient</CardTitle>
          <CardDescription>
            Enter patient demographic information to create a new FHIR patient
            resource
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          {/* Replace the CardContent section with this updated form */}
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Authentication</h3>
              <div className="grid gap-2">
                <Label htmlFor="privateKey">Private Key</Label>
                <Input
                  id="privateKey"
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Enter your private key"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="holderAddress">Holder Address</Label>
                <Input
                  id="holderAddress"
                  value={holderAddress}
                  onChange={(e) => setHolderAddress(e.target.value)}
                  placeholder="Enter holder address"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid gap-2">
                <Label htmlFor="identifier">Identifier</Label>
                <Input
                  id="identifier"
                  value={patientData.identifier}
                  onChange={(e) =>
                    handleInputChange("identifier", e.target.value)
                  }
                  placeholder="Patient identifier"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={patientData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={patientData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={patientData.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid gap-2">
                <Label htmlFor="telecom">Phone Number</Label>
                <Input
                  id="telecom"
                  type="tel"
                  value={patientData.telecom}
                  onChange={(e) => handleInputChange("telecom", e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  value={patientData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Full address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={patientData.maritalStatus}
                    onChange={(e) =>
                      handleInputChange("maritalStatus", e.target.value)
                    }
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="multipleBirth">Multiple Birth</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="multipleBirth"
                      checked={patientData.multipleBirthBoolean}
                      onChange={(e) =>
                        handleInputChange(
                          "multipleBirthBoolean",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor="multipleBirth"
                      className="text-sm font-normal"
                    >
                      Is multiple birth
                    </Label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input
                  id="photo"
                  type="url"
                  value={patientData.photo}
                  onChange={(e) => handleInputChange("photo", e.target.value)}
                  placeholder="URL to patient photo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Language</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="languageCode">Language Code</Label>
                  <select
                    id="languageCode"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={patientData.communication.language.coding[0].code}
                    onChange={(e) =>
                      handleInputChange("languageCode", e.target.value)
                    }
                  >
                    <option value="en">English (en)</option>
                    <option value="es">Spanish (es)</option>
                    <option value="fr">French (fr)</option>
                    <option value="de">German (de)</option>
                    <option value="zh">Chinese (zh)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="languageDisplay">Language Display</Label>
                  <Input
                    id="languageDisplay"
                    value={patientData.communication.language.coding[0].display}
                    onChange={(e) =>
                      handleInputChange("languageDisplay", e.target.value)
                    }
                    placeholder="Language display name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">References</h3>
              <div className="grid gap-2">
                <Label htmlFor="generalPractitioner">
                  General Practitioner
                </Label>
                <Input
                  id="generalPractitioner"
                  value={patientData.generalPractitioner}
                  onChange={(e) =>
                    handleInputChange("generalPractitioner", e.target.value)
                  }
                  placeholder="General practitioner reference"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="managingOrganization">
                  Managing Organization
                </Label>
                <Input
                  id="managingOrganization"
                  value={patientData.managingOrganization}
                  onChange={(e) =>
                    handleInputChange("managingOrganization", e.target.value)
                  }
                  placeholder="Managing organization reference"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkReference">Link Reference</Label>
                <Input
                  id="linkReference"
                  value={patientData.link.other.reference}
                  onChange={(e) =>
                    handleInputChange("linkReference", e.target.value)
                  }
                  placeholder="Link to another patient (e.g., Patient/123456)"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Patient"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
