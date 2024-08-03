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
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
// require("dotenv").config();
// configDotenv
/**
 * @returns {string} returns the did
 * @param {string} privateKey
 * @param {"did:ethr" | "did:key"} method
 */

const pinataGateway = "https://api.pinata.cloud";

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
  console.log(expiry);
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
const verifyJwt = async (jwt) => {
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

/**
 * Stores the decoded data document of the DID JWT on IPFS
 * @returns {Promise<string>} returns the CID
 */
const storeDecodedJWTIPFS = async (decodedDIDJWT) => {
  const decodedDIDJWTJson = JSON.stringify(decodedDIDJWT);
  console.log(decodedDIDJWTJson);
  const response = await axios.post(
    `${pinataGateway}/pinning/pinJSONToIPFS`,
    decodedDIDJWT,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    }
  );
  const cid = response.data.IpfsHash;
  return cid;
};

export { createDIDJWT, decodeDIDJWT, verifyJwt, storeDecodedJWTIPFS };
