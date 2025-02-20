"use client"

import { Check, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const permissions = [
  {
    id: "issue-credentials",
    name: "Issue Credentials",
    description: "Can issue new verifiable credentials",
  },
  {
    id: "revoke-credentials",
    name: "Revoke Credentials",
    description: "Can revoke existing credentials",
  },
  {
    id: "manage-issuers",
    name: "Manage Issuers",
    description: "Can add and remove issuers",
  },
  {
    id: "view-analytics",
    name: "View Analytics",
    description: "Can view system analytics and reports",
  },
]

const roles = [
  {
    id: "admin",
    name: "Admin",
    description: "Full system access",
    permissions: ["issue-credentials", "revoke-credentials", "manage-issuers", "view-analytics"],
  },
  {
    id: "issuer",
    name: "Issuer",
    description: "Can issue and manage credentials",
    permissions: ["issue-credentials", "view-analytics"],
  },
  {
    id: "auditor",
    name: "Auditor",
    description: "Can view and audit system activity",
    permissions: ["view-analytics"],
  },
]

export function RoleManager() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Roles</CardTitle>
              <CardDescription>Manage role-based access control</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                {permissions.map((permission) => (
                  <TableHead key={permission.id} className="text-center">
                    {permission.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  {permissions.map((permission) => (
                    <TableCell key={permission.id} className="text-center">
                      {role.permissions.includes(permission.id) ? <Check className="mx-auto h-4 w-4" /> : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

