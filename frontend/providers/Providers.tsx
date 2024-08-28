"use client";
import { createContext, useState } from "react";
import {
  ethers,
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
  // Wallet,
} from "ethers";
import { BrowserProvider } from "ethers";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

type Wallet = {
  provider: undefined | Provider;
  signer: undefined | ethers.Wallet;
  isConnected: boolean;
  tab: string;
};

export const WalletContext = createContext({
  wallet: {
    provider: undefined as undefined | Provider,
    signer: undefined as undefined | ethers.Wallet,
    isConnected: false,
    tab:"default",
  },
  setWallet: (wallet: Wallet) => {},
});

export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wallet, setWallet] = useState<Wallet>({
    provider: undefined,
    signer: undefined,
    isConnected: false,
    tab: "default"
  });

  return (
    <div>
      <WalletContext.Provider value={{ wallet, setWallet }}>
        {children}
      </WalletContext.Provider>
    </div>
  );
}

export default function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
