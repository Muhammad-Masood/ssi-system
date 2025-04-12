import type { Metadata } from "next";
import "../globals.css";
import Providers, { WalletContextProvider } from "@/providers/Providers";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/auth";
import { Inter } from "next/font/google";
import { Header } from "../components/Header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSI Health - Decentralized Identities for Healthcare",
  description:
    "Manage decentralized identities and verifiable credentials for hospitals and health sectors.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  console.log("layout session: ", session)
  return (
    <html lang="en">
      {/* <head>
        <title>SSI KIT</title>
      </head> */}
      {/* <body className="bg-gray-100 px-4"> */}
      <body className={inter.className}>
        <Providers session={session}>
          <WalletContextProvider>
            <SidebarProvider>
              <DashboardSidebar />
              <main className="flex-1 overflow-y-auto bg-background">
                <Header session={session} />
                {children}
              </main>
            </SidebarProvider>
          </WalletContextProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
