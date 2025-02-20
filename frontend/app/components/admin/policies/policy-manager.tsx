"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const policies = [
  {
    id: "1",
    name: "Medical License Issuance",
    description: "Policy for issuing medical licenses",
    type: "Issuance",
    status: "Active",
    conditions: ["Issuer must be a registered hospital", "Recipient must have valid medical degree"],
  },
  {
    id: "2",
    name: "Pharmacy Credentials",
    description: "Policy for pharmacy credentials",
    type: "Verification",
    status: "Active",
    conditions: ["Must have state pharmacy license", "Must complete verification process"],
  },
]

export function PolicyManager() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Policies</CardTitle>
              <CardDescription>Define and manage credential policies</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="policy-type">Policy Type</Label>
              <Select>
                <SelectTrigger id="policy-type">
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issuance">Issuance</SelectItem>
                  <SelectItem value="verification">Verification</SelectItem>
                  <SelectItem value="revocation">Revocation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="policy-name">Policy Name</Label>
              <Input id="policy-name" placeholder="Enter policy name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="policy-description">Description</Label>
              <Textarea id="policy-description" placeholder="Enter policy description" />
            </div>
          </div>
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Active Policies</h3>
            <div className="grid gap-4">
              {policies.map((policy) => (
                <div key={policy.id} className="flex items-start justify-between rounded-lg border p-4">
                  <div className="grid gap-1">
                    <div className="font-medium">{policy.name}</div>
                    <div className="text-sm text-muted-foreground">{policy.description}</div>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline">{policy.type}</Badge>
                      <Badge>{policy.status}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

