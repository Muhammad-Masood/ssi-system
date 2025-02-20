import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const requests = [
  {
    id: "1",
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg",
    },
    type: "Medical License",
    status: "pending",
    date: "2024-02-20",
    documents: ["Medical Degree", "State Board Certification"],
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg",
    },
    type: "Hospital Credentials",
    status: "pending",
    date: "2024-02-19",
    documents: ["Employment Contract", "Medical License"],
  },
]

export function RequestsList() {
  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.user.avatar} alt={request.user.name} />
              <AvatarFallback>
                {request.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{request.user.name}</CardTitle>
              <CardDescription>{request.user.email}</CardDescription>
            </div>
            <Badge variant={request.status === "pending" ? "outline" : "default"}>{request.status}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="text-sm font-medium">Credential Type</div>
              <div className="text-sm text-muted-foreground">{request.type}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Required Documents</div>
              <div className="text-sm text-muted-foreground">{request.documents.join(", ")}</div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button variant="destructive" size="sm">
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button size="sm">
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

