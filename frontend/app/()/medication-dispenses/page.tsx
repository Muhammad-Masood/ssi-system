import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Function to fetch all medication dispenses
async function getAllMedicationDispenses() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || ""
      }/fhir/resource/get_all_medication_dispenses`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch medication dispenses");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching medication dispenses:", error);
    return [];
  }
}

// Format date for display
function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return dateString;
  }
}

// Get status badge color
function getStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "in-progress":
      return <Badge className="bg-blue-500">In Progress</Badge>;
    case "on-hold":
      return <Badge className="bg-yellow-500">On Hold</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case "entered-in-error":
      return <Badge className="bg-gray-500">Error</Badge>;
    case "stopped":
      return <Badge className="bg-orange-500">Stopped</Badge>;
    case "declined":
      return <Badge className="bg-purple-500">Declined</Badge>;
    default:
      return <Badge>{status || "Unknown"}</Badge>;
  }
}

export default async function MedicationDispensesPage() {
  const dispenses = await getAllMedicationDispenses();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medication Dispenses</h1>
        <Link href="/medication-dispenses/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Medication Dispense
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Medication Dispenses</CardTitle>
          <CardDescription>
            Enter a medication dispense ID to view its details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex gap-4"
            action={`/medication-dispenses/`}
            method="GET"
          >
            <Input
              name="id"
              placeholder="Enter medication dispense ID"
              className="max-w-sm"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {dispenses.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Medication Dispenses</CardTitle>
            <CardDescription>
              Showing {dispenses.length} medication dispenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Dispensed Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispenses.map((dispense: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {dispense.identifier || "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(dispense.status)}</TableCell>
                      <TableCell>
                        {dispense.medication ? (
                          <span className="truncate max-w-[150px] inline-block">
                            {dispense.medication}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {dispense.subject ? (
                          <Link
                            href={`/patients/${dispense.subject.split("/")[1]}`}
                            className="text-primary hover:underline"
                          >
                            {dispense.subject}
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(
                            dispense.whenHandedOver ||
                              dispense.whenPrepared ||
                              dispense.recorded
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/medication-dispenses/${dispense.identifier}`}
                        >
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          <p>No medication dispenses found</p>
          <Link
            href="/medication-dispenses/create"
            className="mt-2 inline-block"
          >
            <Button variant="link">Create a new medication dispense</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
