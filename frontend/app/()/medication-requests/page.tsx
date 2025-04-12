import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Function to fetch all medication requests
async function getAllMedicationRequests() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/fhir/resource/get_all_medication_requests`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch medication requests")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching medication requests:", error)
    return []
  }
}

// Get status badge color
function getStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return <Badge className="bg-green-500">Active</Badge>
    case "on-hold":
      return <Badge className="bg-yellow-500">On Hold</Badge>
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>
    case "completed":
      return <Badge className="bg-blue-500">Completed</Badge>
    case "entered-in-error":
      return <Badge className="bg-gray-500">Error</Badge>
    case "stopped":
      return <Badge className="bg-orange-500">Stopped</Badge>
    case "draft":
      return <Badge className="bg-purple-500">Draft</Badge>
    default:
      return <Badge>{status || "Unknown"}</Badge>
  }
}

// Get priority badge
function getPriorityBadge(priority: string) {
  switch (priority?.toLowerCase()) {
    case "routine":
      return <Badge variant="outline">Routine</Badge>
    case "urgent":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          Urgent
        </Badge>
      )
    case "asap":
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-500">
          ASAP
        </Badge>
      )
    case "stat":
      return (
        <Badge variant="outline" className="border-red-500 text-red-500">
          STAT
        </Badge>
      )
    default:
      return <Badge variant="outline">{priority || "Unknown"}</Badge>
  }
}

export default async function MedicationRequestsPage() {
  const requests = await getAllMedicationRequests()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Medication Requests</h1>
        <Link href="/medication-requests/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Medication Request
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Medication Requests</CardTitle>
          <CardDescription>Enter a medication request ID to view its details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-4" action={`/medication-requests/`} method="GET">
            <Input name="id" placeholder="Enter medication request ID" className="max-w-sm" />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {requests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Medication Requests</CardTitle>
            <CardDescription>Showing {requests.length} medication requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{request.identifier || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>
                        {request.medication?.name ? (
                          <span className="truncate max-w-[150px] inline-block">{request.medication.name}</span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {request.subject ? (
                          <Link href={`/patients/${request.subject}`} className="text-primary hover:underline">
                            {request.subject}
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/medication-requests/${request.identifier}`}>
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
          <p>No medication requests found</p>
          <Link href="/medication-requests/create" className="mt-2 inline-block">
            <Button variant="link">Create a new medication request</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
