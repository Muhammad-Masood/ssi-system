"use server";

import { getSession } from "@/auth";
import { contract } from "@/lib/contract";
import { db } from "@/lib/firebase";
import { DIDDB } from "@/lib/utils";
import axios from "axios";
import { ethers, Wallet } from "ethers";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export const setupUserWallet = async (tab: string) => {
  const session = await getSession();
  if (session) {
    try {
      // check if user already has a wallet
      const userWalletDocRef = doc(db, "wallets", session.user!.email!);
      const walletDoc = await getDoc(userWalletDocRef);
      if (!walletDoc.exists()) {
        // create a new wallet
        const newWallet = Wallet.createRandom();
        await setDoc(userWalletDocRef, {
          address: newWallet.address,
          privateKey: newWallet.privateKey,
          tab,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const getUserWallet = async () => {
  const session = await getSession();
  if (session) {
    try {
      const userWalletDocRef = doc(db, "wallets", session.user!.email!);
      const walletDoc = await getDoc(userWalletDocRef);
      const walletData = walletDoc.data()! as Wallet;
      const provider = new ethers.JsonRpcProvider(
        process.env.RPC_URL as string
      );
      const wallet = new ethers.Wallet(walletData.privateKey, provider);
      return wallet;
    } catch (error) {
      console.log(error);
    }
  } else {
    throw new Error("Please login to your account.");
  }
};

export const getSessionServer = async () => {
  const session = await getSession();
  return session;
};

export const fetchUserDIDs = async (address: string) => {
  const userDIDDocsquery = query(
    collection(db, "dids"),
    where("user", "==", address)
  );
  const docs = await getDocs(userDIDDocsquery);
  console.log(docs);
  let dids: DIDDB[] = [];
  docs.forEach((doc) => {
    const data = doc.data();
    dids.push({ did: data.did, token: doc.id });
  });
  return dids;
};

export const createCredential = async (
  name: string,
  issuer_address: string,
  issuer_did: string,
  holder_did: string,
  privateKey: string,
  ipfsHash: string
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/create_vc`,
      {
        name,
        issuer_did,
        holder_did,
        ipfsHash,
      },
      {
        headers: {
          "private-key": privateKey,
        },
      }
    );
    const { verifiable_credential, verifiable_presentation } = response.data;
    // store in db
    const credDocRef = doc(db, "credentials", verifiable_credential);
    await setDoc(credDocRef, {
      user: issuer_address,
      vp_jwt: verifiable_presentation,
    });
  } catch (error) {
    throw new Error(String(error));
  }
};

export const uploadFileIPFS = async (file: any) => {
  try {
    const pinataEndpoint =
      process.env.NEXT_PUBLIC_PINATA_GATEWAY + "/pinning/pinFileToIPFS";
    const form_data = new FormData();
    form_data.append("file", file);
    const response = await axios.post(pinataEndpoint, form_data, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
        "Content-Type": "multipart/form-data",
      },
    });
    const res_data = response.data;
    const ipfsHash = res_data.IpfsHash;
    return ipfsHash;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getUserIssuedCertificatesHashes = async (
  privateKey: string,
  issuer: string
) => {
  const encryptedCIDs: string[] = await contract.userToIssuedCertificates(
    issuer
  );
  if (encryptedCIDs.length === 0) return [];
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/decryptCID`,
    {
      headers: {
        "encrypted-cids": encryptedCIDs,
      },
    }
  );
  return response.data.decryptedCIDs;
};

export const getUserOwnedCertificatesHashes = async (
  privateKey: string,
  user: string
) => {
  const encryptedCIDs: string[] = await contract.userToOwnedCertificates(user);
  if (encryptedCIDs.length === 0) return [];
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/vc/decryptCID`,
    {
      headers: {
        "encrypted-cids": encryptedCIDs,
      },
    }
  );
  console.log("server_2 -> ", response.data.decryptedCIDs);
  return response.data.decryptedCIDs;
};
