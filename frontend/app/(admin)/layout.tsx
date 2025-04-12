import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SidebarProvider } from "@/components/ui/sidebar";

import "../globals.css";
import { DashboardSidebar } from "../components/admin/dashboard-sidebar";
import Providers, { WalletContextProvider } from "@/providers/Providers";
import { getSession } from "@/auth";
import { DashboardHeader } from "../components/admin/dashboard-header";
import { Header } from "../components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Issuer Dashboard",
  description: "Decentralized Identity System Admin Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <WalletContextProvider>
            {/* <Header session={session} /> */}
            <SidebarProvider>
              <DashboardSidebar />
              {children}
            </SidebarProvider>
          </WalletContextProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
