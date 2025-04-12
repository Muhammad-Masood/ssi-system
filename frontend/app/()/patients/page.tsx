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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Function to fetch all patients
async function getAllPatients() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/fhir/resource/get_all_patients`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch patients");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching patients:", error);
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

// Get initials from name
function getInitials(name: string) {
  if (!name) return "??";

  const parts = name.split(" ");
  if (parts.length === 1) return name.substring(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Get status badge color
function getStatusBadge(active: boolean) {
  return active ? (
    <Badge className="bg-green-500">Active</Badge>
  ) : (
    <Badge className="bg-gray-500">Inactive</Badge>
  );
}

export default async function PatientsPage() {
  const patients = await getAllPatients();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Link href="/patients/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Patient
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Patients</CardTitle>
          <CardDescription>
            Enter a patient ID to view their information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4" action={`/patients/`} method="GET">
            <Input
              name="id"
              placeholder="Enter patient ID"
              className="max-w-sm"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {patients.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Patients</CardTitle>
            <CardDescription>
              Showing {patients.length} patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Birth Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={patient.photo}
                              alt={patient.name}
                            />
                            <AvatarFallback>
                              {getInitials(patient.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {patient.name || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {patient.telecom || ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.identifier || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(patient.active)}</TableCell>
                      <TableCell className="capitalize">
                        {patient.gender || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(patient.birthDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/patients/${patient.identifier}`}>
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
          <p>No patients found</p>
          <Link href="/patients/create" className="mt-2 inline-block">
            <Button variant="link">Create a new patient</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
