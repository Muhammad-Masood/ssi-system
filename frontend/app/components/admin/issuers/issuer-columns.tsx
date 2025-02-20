"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type Issuer = {
  id: string
  name: string
  type: string
  email: string
  status: "active" | "pending" | "suspended"
  createdAt: string
  verifiedAt: string | null
  location: string
}

export const issuerColumns: ColumnDef<Issuer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0 text-left font-medium">
              {row.getValue("name")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{row.getValue("name")}</DialogTitle>
              <DialogDescription>
                Issuer details and verification information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Email</span>
                <span className="col-span-3">{row.getValue("email")}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Type</span>
                <span className="col-span-3">{row.getValue("type")}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Location</span>
                <span className="col-span-3">{row.getValue("location")}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Status</span>
                <span className="col-span-3">
                  <Badge
                    variant={
                      {
                        active: "default",
                        pending: "secondary",
                        suspended: "destructive",
                      }[row.getValue("status")]
                    }
                  >
                    {row.getValue("status")}
                  </Badge>
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            {
              active: "default",
              pending: "secondary",
              suspended: "destructive",
            }[status]
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const issuer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(issuer.id)}
            >
              Copy issuer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>View credentials</DropdownMenuItem>
            {issuer.status === "pending" && (
              <DropdownMenuItem>Verify issuer</DropdownMenuItem>
            )}
            {issuer.status === "active" && (
              <DropdownMenuItem className="text-destructive">
                Suspend issuer
              </DropdownMenuItem>
            )}
            {issuer.status === "suspended" && (
              <DropdownMenuItem>Reactivate issuer</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
