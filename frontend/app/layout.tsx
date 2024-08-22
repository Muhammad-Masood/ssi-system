import type { Metadata } from "next";
import "./globals.css";
import Providers, { WalletContextProvider } from "@/providers/Providers";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <head>
        <title>ChainFusion</title>
      </head>
      <body className="bg-gray-100 px-4">
        <Providers session={session}>
          <WalletContextProvider>
            <Navbar />
            {children}
          </WalletContextProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
