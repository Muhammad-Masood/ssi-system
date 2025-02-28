import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReqVcData } from "@/lib/utils";

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
];

export function RequestsList({ requests }: { requests: ReqVcData[] }) {
  return (
    <div className="grid gap-4">
      {requests.map((request, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={"/placeholder.svg"} alt={request.fullName} />
              <AvatarFallback>
                {request.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{request.fullName}</CardTitle>
              <CardDescription>{request.holderDid}</CardDescription>
            </div>
            {/* <Badge variant={request.status === "pending" ? "outline" : "default"}>{request.status}</Badge> */}
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="text-sm font-medium">Credential Type</div>
              <div className="text-sm text-muted-foreground">
                {request.type}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">JWS</div>
              <div className="text-sm text-muted-foreground">{request.jws}</div>
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
  );
}
