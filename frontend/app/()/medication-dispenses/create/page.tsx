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

export default function CreateMedicationDispense() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // State for medication dispense data
  const [medicationDispense, setMedicationDispense] = useState({
    resourceType: "MedicationDispense",
    identifier: "",
    basedOn: [{ reference: "" }],
    partOf: [{ reference: "" }],
    status: "completed",
    statusChanged: new Date().toISOString(),
    category: [
      {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/medicationdispense-category",
            code: "outpatient",
            display: "Outpatient",
          },
        ],
        text: "Outpatient",
      },
    ],
    medication: "",
    subject: "",
    performer: "",
    location: "",
    authorizingPrescription: "",
    type: "trial",
    quantity: {
      value: 0,
      unit: "",
      system: "http://unitsofmeasure.org",
      code: "",
    },
    daysSupply: {
      value: 0,
      unit: "days",
      system: "http://unitsofmeasure.org",
      code: "d",
    },
    recorded: new Date().toISOString(),
    whenPrepared: new Date().toISOString(),
    whenHandedOver: "",
    destination: "",
    receiver: "",
    note: [
      {
        authorString: "",
        time: new Date().toISOString(),
        text: "",
      },
    ],
    renderedDosageInstruction: "",
    substitution: {
      wasSubstituted: false,
      type: {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/v3-ActSubstanceAdminSubstitutionCode",
            code: "E",
            display: "equivalent",
          },
        ],
        text: "Equivalent drug substitution",
      },
      reason: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/substance-admin-substitution-reason",
              code: "formulary",
              display: "Formulary policy",
            },
          ],
          text: "Formulary restriction",
        },
      ],
      responsibleParty: "",
    },
    eventHistory: [{ reference: "" }],
  });

  // Handle input changes for nested fields
  const handleInputChange = (
    path: string,
    value: string | number | boolean
  ) => {
    const updateNestedState = (obj: any, path: string[], value: any): any => {
      const [current, ...rest] = path;

      // Handle array indices
      if (current.includes("[")) {
        const fieldName = current.split("[")[0];
        const index = Number.parseInt(current.split("[")[1].split("]")[0]);

        if (rest.length === 0) {
          // Update the value at the specified array index
          const newArray = [...obj[fieldName]];
          newArray[index] = value;
          return { ...obj, [fieldName]: newArray };
        } else {
          // Continue traversing the nested structure
          const newArray = [...obj[fieldName]];
          newArray[index] = updateNestedState(newArray[index], rest, value);
          return { ...obj, [fieldName]: newArray };
        }
      }

      // Handle regular fields
      if (rest.length === 0) {
        return { ...obj, [current]: value };
      }

      return {
        ...obj,
        [current]: updateNestedState(obj[current], rest, value),
      };
    };

    const pathArray = path.split(".");
    setMedicationDispense((prev) => updateNestedState(prev, pathArray, value));
  };

  // Format date for datetime-local input
  const formatDateForInput = (isoString: string) => {
    if (!isoString) return "";
    return isoString.substring(0, 16); // Format as YYYY-MM-DDThh:mm
  };

  // Parse datetime-local input to ISO string
  const parseInputToISOString = (inputValue: string) => {
    if (!inputValue) return "";
    const date = new Date(inputValue);
    return date.toISOString();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/fhir/resource/create_medication_dispense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicationDispense,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create medication dispense");
      }

      toast.success(`Medication dispense created with ID: ${data.docId}`);

      router.push(`/medication-dispenses/${data.docId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create Medication Dispense</CardTitle>
          <CardDescription>
            Record a medication dispense for a patient
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid gap-2">
                <Label htmlFor="identifier">Identifier</Label>
                <Input
                  id="identifier"
                  value={medicationDispense.identifier}
                  onChange={(e) =>
                    handleInputChange("identifier", e.target.value)
                  }
                  placeholder="Medication dispense identifier"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={medicationDispense.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    required
                  >
                    <option value="preparation">Preparation</option>
                    <option value="in-progress">In Progress</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="entered-in-error">Entered in Error</option>
                    <option value="stopped">Stopped</option>
                    <option value="declined">Declined</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="statusChanged">Status Changed Date</Label>
                  <Input
                    id="statusChanged"
                    type="datetime-local"
                    value={formatDateForInput(medicationDispense.statusChanged)}
                    onChange={(e) =>
                      handleInputChange(
                        "statusChanged",
                        parseInputToISOString(e.target.value)
                      )
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category.code">Category</Label>
                  <select
                    id="category.code"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={medicationDispense.category[0].coding[0].code}
                    onChange={(e) => {
                      const code = e.target.value;
                      const display =
                        e.target.options[e.target.selectedIndex].text;
                      handleInputChange("category[0].coding[0].code", code);
                      handleInputChange(
                        "category[0].coding[0].display",
                        display
                      );
                      handleInputChange("category[0].text", display);
                    }}
                    required
                  >
                    <option value="inpatient">Inpatient</option>
                    <option value="outpatient">Outpatient</option>
                    <option value="community">Community</option>
                    <option value="discharge">Discharge</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={medicationDispense.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                  >
                    <option value="trial">Trial</option>
                    <option value="prescription">Prescription</option>
                    <option value="refill">Refill</option>
                    <option value="partial">Partial</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">References</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Patient</Label>
                  <Input
                    id="subject"
                    value={medicationDispense.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    placeholder="Patient reference (e.g., Patient/123)"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="medication">Medication</Label>
                  <Input
                    id="medication"
                    value={medicationDispense.medication}
                    onChange={(e) =>
                      handleInputChange("medication", e.target.value)
                    }
                    placeholder="Medication reference (e.g., Medication/123)"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="performer">Performer</Label>
                  <Input
                    id="performer"
                    value={medicationDispense.performer}
                    onChange={(e) =>
                      handleInputChange("performer", e.target.value)
                    }
                    placeholder="Practitioner reference (e.g., Practitioner/123)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={medicationDispense.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Location reference (e.g., Location/123)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="authorizingPrescription">
                    Authorizing Prescription
                  </Label>
                  <Input
                    id="authorizingPrescription"
                    value={medicationDispense.authorizingPrescription}
                    onChange={(e) =>
                      handleInputChange(
                        "authorizingPrescription",
                        e.target.value
                      )
                    }
                    placeholder="MedicationRequest reference (e.g., MedicationRequest/123)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="basedOn[0].reference">Based On</Label>
                  <Input
                    id="basedOn[0].reference"
                    value={medicationDispense.basedOn[0].reference}
                    onChange={(e) =>
                      handleInputChange("basedOn[0].reference", e.target.value)
                    }
                    placeholder="CarePlan reference (e.g., CarePlan/123)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={medicationDispense.destination}
                    onChange={(e) =>
                      handleInputChange("destination", e.target.value)
                    }
                    placeholder="Location reference (e.g., Location/123)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="receiver">Receiver</Label>
                  <Input
                    id="receiver"
                    value={medicationDispense.receiver}
                    onChange={(e) =>
                      handleInputChange("receiver", e.target.value)
                    }
                    placeholder="Patient reference (e.g., Patient/123)"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Quantity and Supply</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity.value">Quantity Value</Label>
                  <Input
                    id="quantity.value"
                    type="number"
                    min="0"
                    step="0.1"
                    value={medicationDispense.quantity.value}
                    onChange={(e) =>
                      handleInputChange(
                        "quantity.value",
                        Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity.unit">Quantity Unit</Label>
                  <Input
                    id="quantity.unit"
                    value={medicationDispense.quantity.unit}
                    onChange={(e) =>
                      handleInputChange("quantity.unit", e.target.value)
                    }
                    placeholder="e.g., tablet, capsule, ml"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity.code">Quantity Code</Label>
                  <Input
                    id="quantity.code"
                    value={medicationDispense.quantity.code}
                    onChange={(e) =>
                      handleInputChange("quantity.code", e.target.value)
                    }
                    placeholder="e.g., tbl, cap, mL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="daysSupply.value">Days Supply</Label>
                  <Input
                    id="daysSupply.value"
                    type="number"
                    min="0"
                    value={medicationDispense.daysSupply.value}
                    onChange={(e) =>
                      handleInputChange(
                        "daysSupply.value",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Timing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="recorded">Recorded Date</Label>
                  <Input
                    id="recorded"
                    type="datetime-local"
                    value={formatDateForInput(medicationDispense.recorded)}
                    onChange={(e) =>
                      handleInputChange(
                        "recorded",
                        parseInputToISOString(e.target.value)
                      )
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whenPrepared">When Prepared</Label>
                  <Input
                    id="whenPrepared"
                    type="datetime-local"
                    value={formatDateForInput(medicationDispense.whenPrepared)}
                    onChange={(e) =>
                      handleInputChange(
                        "whenPrepared",
                        parseInputToISOString(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whenHandedOver">When Handed Over</Label>
                  <Input
                    id="whenHandedOver"
                    type="datetime-local"
                    value={formatDateForInput(
                      medicationDispense.whenHandedOver
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        "whenHandedOver",
                        parseInputToISOString(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Instructions and Notes</h3>
              <div className="grid gap-2">
                <Label htmlFor="renderedDosageInstruction">
                  Dosage Instructions
                </Label>
                <Textarea
                  id="renderedDosageInstruction"
                  value={medicationDispense.renderedDosageInstruction}
                  onChange={(e) =>
                    handleInputChange(
                      "renderedDosageInstruction",
                      e.target.value
                    )
                  }
                  placeholder="Detailed dosage instructions"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note[0].text">Note</Label>
                <Textarea
                  id="note[0].text"
                  value={medicationDispense.note[0].text}
                  onChange={(e) =>
                    handleInputChange("note[0].text", e.target.value)
                  }
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note[0].authorString">Note Author</Label>
                <Input
                  id="note[0].authorString"
                  value={medicationDispense.note[0].authorString}
                  onChange={(e) =>
                    handleInputChange("note[0].authorString", e.target.value)
                  }
                  placeholder="Author of the note"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Substitution</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="substitution.wasSubstituted"
                  checked={medicationDispense.substitution.wasSubstituted}
                  onChange={(e) =>
                    handleInputChange(
                      "substitution.wasSubstituted",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label
                  htmlFor="substitution.wasSubstituted"
                  className="text-sm font-normal"
                >
                  Medication was substituted
                </Label>
              </div>
              {medicationDispense.substitution.wasSubstituted && (
                <>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="substitution.type.text">
                      Substitution Type
                    </Label>
                    <Input
                      id="substitution.type.text"
                      value={medicationDispense.substitution.type.text}
                      onChange={(e) =>
                        handleInputChange(
                          "substitution.type.text",
                          e.target.value
                        )
                      }
                      placeholder="Type of substitution"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="substitution.reason[0].text">
                      Substitution Reason
                    </Label>
                    <Input
                      id="substitution.reason[0].text"
                      value={medicationDispense.substitution.reason[0].text}
                      onChange={(e) =>
                        handleInputChange(
                          "substitution.reason[0].text",
                          e.target.value
                        )
                      }
                      placeholder="Reason for substitution"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="substitution.responsibleParty">
                      Responsible Party
                    </Label>
                    <Input
                      id="substitution.responsibleParty"
                      value={medicationDispense.substitution.responsibleParty}
                      onChange={(e) =>
                        handleInputChange(
                          "substitution.responsibleParty",
                          e.target.value
                        )
                      }
                      placeholder="Practitioner reference (e.g., Practitioner/123)"
                    />
                  </div>
                </>
              )}
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
                "Create Medication Dispense"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
