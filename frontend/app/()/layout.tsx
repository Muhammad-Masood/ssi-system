import type { Metadata } from "next";
import "../globals.css";
import Providers, { WalletContextProvider } from "@/providers/Providers";
import Navbar from "../components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/auth";
import { Inter } from "next/font/google";
import { Header } from "../components/Header";

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
  return (
    <html lang="en">
      {/* <head>
        <title>SSI KIT</title>
      </head> */}
      {/* <body className="bg-gray-100 px-4"> */}
      <body className={inter.className}>
        <Providers session={session}>
          <WalletContextProvider>
            <Header session={session} />
            {children}
          </WalletContextProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
