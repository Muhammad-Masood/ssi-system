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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreateMedicationRequest() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // State for medication request data
  const [medicationRequest, setMedicationRequest] = useState({
    resourceType: "MedicationRequest",
    identifier: "",
    status: "active",
    intent: "order",
    priority: "routine",
    subject: "",
    requester: "",
    medication: {
      code: "",
      name: "",
      doseForm: "",
    },
    dosageInstruction: {
      text: "",
      doseQuantity: 1,
      frequency: "",
    },
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes(".")) {
      // Handle nested fields
      const [parent, child] = field.split(".");
      if (parent === "medication") {
        setMedicationRequest({
          ...medicationRequest,
          medication: {
            ...medicationRequest.medication,
            [child]: value,
          },
        });
      } else if (parent === "dosageInstruction") {
        setMedicationRequest({
          ...medicationRequest,
          dosageInstruction: {
            ...medicationRequest.dosageInstruction,
            [child]: value,
          },
        });
      }
    } else {
      // Handle top-level fields
      setMedicationRequest({
        ...medicationRequest,
        [field]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/fhir/resource/create_medication_request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicationRequest,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create medication request");
      }

      toast.success(`Medication request created with ID: ${data.docId}`);

      router.push(`/medication-requests/${data.docId}`);
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
          <CardTitle>Create Medication Request</CardTitle>
          <CardDescription>
            Enter medication request details for a patient
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid gap-2">
                <Label htmlFor="identifier">Identifier</Label>
                <Input
                  id="identifier"
                  value={medicationRequest.identifier}
                  onChange={(e) =>
                    handleInputChange("identifier", e.target.value)
                  }
                  placeholder="Medication request identifier"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={medicationRequest.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    required
                  >
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                    <option value="entered-in-error">Entered in Error</option>
                    <option value="stopped">Stopped</option>
                    <option value="draft">Draft</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="intent">Intent</Label>
                  <select
                    id="intent"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={medicationRequest.intent}
                    onChange={(e) =>
                      handleInputChange("intent", e.target.value)
                    }
                    required
                  >
                    <option value="proposal">Proposal</option>
                    <option value="plan">Plan</option>
                    <option value="order">Order</option>
                    <option value="original-order">Original Order</option>
                    <option value="reflex-order">Reflex Order</option>
                    <option value="filler-order">Filler Order</option>
                    <option value="instance-order">Instance Order</option>
                    <option value="option">Option</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={medicationRequest.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    required
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="asap">ASAP</option>
                    <option value="stat">Stat</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">References</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Patient Reference</Label>
                  <Input
                    id="subject"
                    value={medicationRequest.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    placeholder="Patient identifier"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="requester">Requester Reference</Label>
                  <Input
                    id="requester"
                    value={medicationRequest.requester}
                    onChange={(e) =>
                      handleInputChange("requester", e.target.value)
                    }
                    placeholder="Practitioner identifier"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Medication</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="medication.code">Medication Code</Label>
                  <Input
                    id="medication.code"
                    value={medicationRequest.medication.code}
                    onChange={(e) =>
                      handleInputChange("medication.code", e.target.value)
                    }
                    placeholder="Medication code"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="medication.name">Medication Name</Label>
                  <Input
                    id="medication.name"
                    value={medicationRequest.medication.name}
                    onChange={(e) =>
                      handleInputChange("medication.name", e.target.value)
                    }
                    placeholder="Medication name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="medication.doseForm">Dose Form</Label>
                  <Input
                    id="medication.doseForm"
                    value={medicationRequest.medication.doseForm}
                    onChange={(e) =>
                      handleInputChange("medication.doseForm", e.target.value)
                    }
                    placeholder="e.g., tablet, capsule, liquid"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Dosage Instructions</h3>
              <div className="grid gap-2">
                <Label htmlFor="dosageInstruction.text">Instructions</Label>
                <Textarea
                  id="dosageInstruction.text"
                  value={medicationRequest.dosageInstruction.text}
                  onChange={(e) =>
                    handleInputChange("dosageInstruction.text", e.target.value)
                  }
                  placeholder="Detailed dosage instructions"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dosageInstruction.doseQuantity">
                    Dose Quantity
                  </Label>
                  <Input
                    id="dosageInstruction.doseQuantity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={medicationRequest.dosageInstruction.doseQuantity}
                    onChange={(e) =>
                      handleInputChange(
                        "dosageInstruction.doseQuantity",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="Quantity per dose"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dosageInstruction.frequency">Frequency</Label>
                  <Input
                    id="dosageInstruction.frequency"
                    value={medicationRequest.dosageInstruction.frequency}
                    onChange={(e) =>
                      handleInputChange(
                        "dosageInstruction.frequency",
                        e.target.value
                      )
                    }
                    placeholder="e.g., once daily, twice daily"
                    required
                  />
                </div>
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
                "Create Medication Request"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
