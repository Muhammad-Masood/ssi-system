import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { SidebarProvider } from "@/components/ui/sidebar"

import "../globals.css"
import { DashboardSidebar } from "../components/admin/dashboard-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Issuer Dashboard",
  description: "Decentralized Identity System Admin Dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <DashboardSidebar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  )
}

