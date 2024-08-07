import {
  createVerifiableCredentialJwt,
  createVerifiablePresentationJwt,
  verifyCredential,
  verifyPresentation,
} from "did-jwt-vc";
import { getResolver } from "ethr-did-resolver";
import { Resolver } from "did-resolver";
import { EthrDID } from "ethr-did";
import { ES256KSigner, hexToBytes } from "did-jwt";
import { ethers } from "ethers";
import crypto from "crypto";
import dotenv from "dotenv";
import { contract, provider, storeDataOnIPFS } from "../../index.js";

dotenv.config();

const issuer = new EthrDID({
  identifier: "0x1F4D71254a9175c13c6e8ff441f42D4aE42487De",
  privateKey:
    "f013ecdaeaa6955889a6a38e67f391b67d328dd9b3afbc6574ac35c88fd5d0b3",
});

/**
 * Creates a Verifiable Credential
 * @param {*} vcPayload - The payload of the verifiable credential
 * @param {string} issuerDID - The did of the issuer
 * @param {string} issuerPrivateKey - The private key of the issuer
 */
const createVerifiableCredential = async (
  vcPayload,
  issuerDID,
  issuerPrivateKey
) => {
  const issuer = {
    did: issuerDID,
    signer: ES256KSigner(hexToBytes(issuerPrivateKey)),
  };
  const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
  // store credential document on IPFS
  const vcDoc = await verifyCredential(vcJwt);
  const vcDocJson = JSON.stringify(vcDoc);
  const cid = await storeDataOnIPFS(vcDocJson);
  console.log("Credential stored on IPFS with -> ", cid);
  const encryptedCID = encryptCIDHash(issuerPrivateKey, cid);
  console.log("Encrypted CID -> ", encryptedCID);
  const holderDID = vcPayload.sub;
  const holderAddress = holderDID.split(":")[2];
  const signer = new ethers.BaseWallet(issuerPrivateKey, provider);
  contract.connect(signer);
  const tx = await contract.setIssuedCertificateHash(
    holderAddress,
    encryptedCID
  );
  console.log("Transaction Processed: ", tx);
  return vcJwt;
};

/**
 * @param {string} vcJwt
 * @returns the resolved verifiable credential
 */
const verifyCredentialJWT = async (vcJwt) => {
  const resolver = new Resolver({
    ...getResolver({ infuraProjectId: "4f653d2d351148769fd1017be6f45d45" }),
  });
  const verifiedVC = await verifyCredential(vcJwt, resolver);
  return verifiedVC;
};

const isCertificateOnChainVerified = async (
  issuerDID,
  holderDID,
  privateKey,
  jwt
) => {
  // on-chain verification
  const issuer_address = issuerDID.split(":")[2];
  const holder_address = holderDID.split(":")[2];
  contract.connect(provider);
  const userIssuedCertificates = await contract.userToIssuedCertificates(
    issuer_address
  );
  const userOwnedCertificates = await contract.userToIssuedCertificates(
    holder_address
  );
  const matchingCertificates = userIssuedCertificates.filter((icid) =>
    userOwnedCertificates.find((ocid) => ocid === icid)
  );
  const isVerified = false;
  matchingCertificates.map(async (m_encCID) => {
    const mCID = decryptCIDHash(privateKey, m_encCID);
    const response = await axios.get(`https://ipfs.io/ipfs/${mCID}`);
    const fetchedJWT = response.data.jwt;
    console.log("Fetched from IPFS -> ", fetchedJWT);
    if (fetchedJWT === jwt) {
      isVerified = true;
    }
  });
  return isVerified;
};

/**
 * Creates a Verifiable Credential
 * @param {*} vpPayload - The payload of the verifiable credential
 * @param {string} issuerDID - The did of the issuer
 * @param {string} issuerPrivateKey - The private key of the issuer
 */
const createVCPresentation = async (vpPayload, issuerDID, issuerPrivateKey) => {
  const issuer = {
    did: issuerDID,
    signer: ES256KSigner(hexToBytes(issuerPrivateKey)),
  };
  const vpJwt = await createVerifiablePresentationJwt(vpPayload, issuer);
  return vpJwt;
};

/**
 * @param {string} vcJwt
 * @returns the resolved verifiable credential
 */
const verifyCredentialPresentation = async (vpJwt) => {
  const resolver = new Resolver({
    ...getResolver({ infuraProjectId: "4f653d2d351148769fd1017be6f45d45" }),
  });
  const verifiedPresentation = await verifyPresentation(vpJwt, resolver);
  return verifiedPresentation;
};

const encryptCIDHash = (privateKey, cidHash) => {
  const ivBuffer = Buffer.from(process.env.ENCODE_BUFFER_SECRET, "base64");
  const cipher = crypto.createCipheriv("aes-256-ocb", privateKey, ivBuffer);
  const encrypted = Buffer.concat([cipher.update(cidHash), cipher.final()]);
  return encrypted.toString("hex");
};

/**
 *
 * @param {string} privateKey
 * @param {string} encryptedCID
 * @returns
 */
const decryptCIDHash = (privateKey, encryptedCID) => {
  const ivBuffer = Buffer.from(process.env.ENCODE_BUFFER_SECRET, "base64");
  const encrypted = Buffer.from(encryptedCID, "hex");
  const decipher = crypto.createDecipheriv("aes-256-ocb", privateKey, ivBuffer);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString();
};

export {
  createVerifiableCredential,
  verifyCredentialJWT,
  verifyCredentialPresentation,
  createVCPresentation,
  isCertificateOnChainVerified,
};
