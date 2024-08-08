import {
  createJWT,
  ES256KSigner,
  decodeJWT,
  verifyJWT,
  hexToBytes,
} from "did-jwt";
import { ethers } from "ethers";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import axios from "axios";
import {
  contract,
  pinataIPFSGateway,
  provider,
  storeDataOnIPFS,
} from "../../index.js";

/**
 * @returns {string} returns the did
 * @param {string} privateKey
 * @param {"did:ethr" | "did:key"} method
 */
const generateDID = (privateKey, method) => {
  const signer = new ethers.Wallet(privateKey);
  const address = signer.address;
  if (method === "did:ethr") {
    return `did:ethr:${address}`;
  } else if (method === "did:key") {
    return ``;
  }
};

/**
 * @returns {Promise<string>} returns the jwt token for the did
 * @param {string} subject the topic of the did
 * @param {"did:ethr" | "did:key"} method
 * @param {string} privateKey
 */
const createDIDJWT = async (subject, privateKey, method) => {
  const signer = ES256KSigner(hexToBytes(privateKey));
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // days
  const did = generateDID(privateKey, method);
  console.log(did);
  const jwt = await createJWT(
    {
      aud: did,
      sub: subject,
      iat: Math.floor(Date.now() / 1000),
      exp: expiry,
    },
    {
      issuer: did,
      signer,
    },
    {
      alg: "ES256K",
      typ: "JWT",
    }
  );
  const decodedDIDDoc = decodeDIDJWT(jwt);
  const decodedDIDDocJson = JSON.stringify(decodedDIDDoc);
  const decodedDIDDocHash = await storeDataOnIPFS(decodedDIDDocJson);
  console.log("Decoded DID document stored on IPFS with ->", decodedDIDDocHash);
  const signer_ethers = new ethers.Wallet(privateKey, provider);
  const signerContract = contract.connect(signer_ethers);
  const tx = await signerContract.setResolvableDIDHash(decodedDIDDocHash);
  console.log("Transaction Processed: ", tx);
  return jwt;
};

/**
 * returns the decoded jwt
 * @param {string} jwt
 */
const decodeDIDJWT = (jwt) => {
  return decodeJWT(jwt);
};

/**
 * Returns the verified DID document
 * @param {string} jwt the jwt to verify
 */
const verifyDIDJwt = async (jwt) => {
  const resolver = new Resolver({
    ...getResolver({ infuraProjectId: "4f653d2d351148769fd1017be6f45d45" }),
  });
  const decoded_jwt = decodeDIDJWT(jwt);
  const verificationResponse = await verifyJWT(jwt, {
    resolver,
    audience: decoded_jwt.payload.aud,
  });
  return verificationResponse;
};

const isDIDOnChainVerified = async (userDID, didJWT) => {
  // on-chain verification
  const user_address = userDID.split(":")[2];
  console.log("User address -> ", user_address);
  const provider_contract = contract.connect(provider);
  const userDIDs = await provider_contract.retrieveResolvableDIDHash(
    user_address
  );
  console.log(userDIDs);
  let isVerified = false;
  await Promise.all(
    userDIDs.map(async (udid) => {
      // const response = await axios.get(`https://ipfs.io/ipfs/${udid}`);
      const response = await axios.get(`${pinataIPFSGateway}/${udid}`);
      const responseDataAud = response.data.payload.aud;
      const ipfsDIDJWT = response.data.data + "." + response.data.signature;
      console.log(ipfsDIDJWT, didJWT, responseDataAud, userDID);
      if (ipfsDIDJWT === didJWT) {
        console.log("true");
        isVerified = true;
      }
    })
  );
  return isVerified;
};

export { createDIDJWT, decodeDIDJWT, verifyDIDJwt, isDIDOnChainVerified };
