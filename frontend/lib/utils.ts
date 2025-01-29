import { type ClassValue, clsx } from "clsx";
import { JsonRpcProvider, JsonRpcSigner } from "ethers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { z } from "zod";

export const issueCredFormSchema = z.object({
  issuer_did: z.any(),
  issuer_address: z.any(),
  holder_did: z.string().min(12),
  certificate_name: z.string().min(3),
  credential: z.any(),
});

export const authFormSchema = z.object({
  address: z
    .string()
    .min(42, { message: "Invalid wallet address" })
    .max(42, { message: "Invalid wallet address" }),
  credential: z.string().min(10, { message: "Invalid credential cid" }),
});

export type NavbarLink = {
  name: string;
  href: string;
};

export const userNavbarLinks: NavbarLink[] = [
  {
    name: "Profile",
    href: "/profile",
  },
  {
    name: "Auth",
    href: "/auth",
  },
];

export const issuerNavbarLinks: NavbarLink[] = [
  {
    name: "Profile",
    href: "/profile",
  },
  {
    name: "Issue Credentials",
    href: "/issue",
  },
  {
    name: "Auth",
    href: "/auth",
  },
];

export const verifierNavbarLinks: NavbarLink[] = [
  {
    name: "Verify",
    href: "/verify",
  },
  {
    name: "Auth",
    href: "/auth",
  },
];

// export const links: NavbarLink[] = [
// ];

export type DIDDB = {
  did: string;
  token: string;
  isDeleting: boolean;
  ipfsHash: string;
};

export type CredentialDB = {
  user: string;
  vp_jwt: string;
  vc_jwt: string;
};
