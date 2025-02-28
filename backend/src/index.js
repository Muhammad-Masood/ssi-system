import express from "express";
import bodyParser from "body-parser";
import {
  createDIDJWT,
  decodeDIDJWT,
  deleteDIDJWT,
  isDIDOnChainVerified,
  splitDid,
  verifyDIDJwt,
} from "./did/services/index.js";
import {
  createVCPresentation,
  createVerifiableCredential,
  decryptCIDHash,
  encryptCIDHash,
  isCertificateOnChainVerified,
  verifyCredentialJWT,
  verifyCredentialPresentation,
  getRevokedCIDs,
  revokeCIDHash,
  createBankIdVc,
  submitVcRequest,
  getVcRequests,
} from "./credential/services/index.js";
import axios from "axios";
import crypto from "crypto";
import { ethers } from "ethers";
import { contract_abi, contract_address } from "./contract.js";
import cors from "cors";
import dotenv from "dotenv";
import {
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./database/firebase.js";
dotenv.config();

const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(cors());
const pinataGateway = "https://api.pinata.cloud";
export const pinataIPFSGateway =
  "https://pink-gentle-krill-627.mypinata.cloud/ipfs";

export const stringToBytesHex = (str) => {
  return "0x" + Buffer.from(str, "utf-8").toString("hex");
};

export const bytesHexToString = (bytesHex) => {
  return Buffer.from(bytesHex.slice(2), "hex").toString("utf-8");
};

//////////////////////////////////////
//////////// Smart Contract /////////
////////////////////////////////////

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
export const contract = new ethers.Contract(contract_address, contract_abi);

/////////////////////////////////////
////////////// IPFS ////////////////
///////////////////////////////////
/**
 * Stores the decoded data document of the DID JWT on IPFS
 * @param {string} decodedDIDJWT
 * @returns {Promise<string>} returns the CID
 */
export const storeDataOnIPFS = async (decodedDIDJWT) => {
  console.log(decodedDIDJWT);
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

///////////////////////////////////
// Decentralized Identifiers (DIDS)
///////////////////////////////////

app.get("/dids", (req, res) => {
  res.send("Decentralized Identifiers.");
});

app.post("/dids/create_did_jwt", async (req, res) => {
  const subject = req.body.subject;
  const method = req.body.method;
  const privateKey = req.headers["private-key"];
  if (!subject || !method || !privateKey) {
    return res.status(400).json({ error: "Invalid request body." });
  }
  try {
    const { jwt, decodedDIDDocHash, did } = await createDIDJWT(
      subject,
      privateKey,
      method
    );
    return res
      .status(200)
      .json({ token: jwt, ipfsHash: decodedDIDDocHash, did: did });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create JWT", details: error.message });
  }
});

app.post("/dids/delete_did_jwt", async (req, res) => {
  const jwt = req.body.jwt;
  const userAddress = req.body.userAddress;
  const ipfsHash = req.body.hash;
  const privateKey = req.headers["private-key"];
  if (!jwt || !userAddress || !privateKey || !ipfsHash) {
    return res.status(400).json({ error: "Invalid request body." });
  }
  try {
    await deleteDIDJWT(jwt, userAddress, privateKey, ipfsHash);
    return res
      .status(200)
      .json({ message: "Successfully deleted DID document" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to delete JWT", details: error.message });
  }
});

app.get("/dids/decode_did_jwt", async (req, res) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }
  const decoded_data = decodeDIDJWT(token);
  // const decoded_data_json = JSON.stringify(decoded_data);
  // const cid = await storeDataOnIPFS(decoded_data_json);
  // console.log(cid);
  return res.status(200).json({ decoded_data });
});

app.get("/dids/verify_did_jwt", async (req, res) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }
  try {
    const verificationResponse = await verifyDIDJwt(token);
    const onChainVerificationResponse = await isDIDOnChainVerified(
      verificationResponse.payload.aud,
      token
    );
    console.log(
      "main req result",
      onChainVerificationResponse,
      verificationResponse.verified
    );
    return res.status(200).json({
      offChainVerificationStatus: verificationResponse.verified,
      onChainVerificationStatus: onChainVerificationResponse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to verify DID", details: error.message });
  }
});

////////////////////////////////
// Verifiable Credentials (VCs)
////////////////////////////////

app.get("/vc", (req, res) => {
  res.send("Verifiable Credentials.");
});

app.get("/vc/get_vc_requests", async (req, res) => {
  const vc_requests = await getVcRequests();
  return res.status(200).json({ vc_requests });
});

app.post("/vc/submit_bank_id_vc_request", async (req, res) => {
  const { fullName, birthDate, nationalID, holderDID } = req.body;
  console.log(req.body);
  const userPrivateKey = req.headers["private-key"];
  console.log(userPrivateKey);
  // if (
  //   !userPrivateKey ||
  //   !fullName ||
  //   !birthDate ||
  //   !holderDID ||
  //   !nationalID
  //   // !userId
  // ) {
  //   return res.status(400).json({ error: "Invalid request body." });
  // }
  const reqId = await submitVcRequest(req.body);
  return res.status(200).json({
    message: "Bank Id VC requested successfully!",
    reqId: reqId,
  });
});

app.post("/vc/issue_bank_id_vc", async (req, res) => {
  const { fullName, birthDate, nationalID, holderDID } = req.body;
  const issuerPrivateKey = req.headers["private-key"];
  if (
    !issuerPrivateKey ||
    !fullName ||
    !birthDate ||
    !holderDID ||
    !nationalID
  ) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const bankIdVcHash = await createBankIdVc(
    fullName,
    birthDate,
    holderDID,
    nationalID,
    issuerPrivateKey
  );

  return res.status(200).json({
    message: "Successfully Issued Bank Id VC",
    documentHash: bankIdVcHash,
  });
});

app.post("/vc/create_vc", async (req, res) => {
  const certificateName = req.body.name;
  const issuerDID = req.body.issuer_did;
  const holderDID = req.body.holder_did;
  const documentHash = req.body.ipfsHash;
  const userAddress = req.body.userAddress;
  const issuerPrivateKey = req.headers["private-key"];

  if (
    !issuerPrivateKey ||
    !certificateName ||
    !issuerDID ||
    !holderDID ||
    !documentHash
  ) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const vcPayload = {
    sub: splitDid(holderDID),
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      credentialSubject: {
        certificate: {
          type: "Medical",
          name: certificateName,
          document: documentHash,
        },
      },
    },
  };
  const { vcJwt, encryptedCIDBytes } = await createVerifiableCredential(
    vcPayload,
    splitDid(issuerDID),
    issuerPrivateKey
  );
  console.log("vc_token -> ", vcJwt);
  const vpPayload = {
    vp: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [vcJwt],
    },
  };
  const vpJwt = await createVCPresentation(
    vpPayload,
    splitDid(issuerDID),
    issuerPrivateKey
  );
  // Store in DB
  const credDocRef = doc(db, "credentials", vcJwt);
  await setDoc(credDocRef, {
    user: userAddress,
    vp_jwt: vpJwt,
    vc_encrypted_hash: encryptedCIDBytes,
  });
  return res.status(200).json({
    verifiable_credential: vcJwt,
    verifiable_presentation: vpJwt,
    encrypCID: encryptedCIDBytes,
  });
});

app.post("/vc/revoke_vc", async (req, res) => {
  const cidHash = req.body.cidHash;
  const endTime = req.body.endTime;
  const issuerPrivateKey = req.headers["private-key"];
  console.log("privKey: ", issuerPrivateKey);
  if (!issuerPrivateKey || !cidHash) {
    return res.status(400).json({ error: "Invalid request body." });
  }
  try {
    await revokeCIDHash(issuerPrivateKey, cidHash, endTime);
    return res
      .status(200)
      .json({ message: "Credential revoked!", cid: cidHash });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/vc/verify_vc", async (req, res) => {
  const vcJwt = req.headers["vc-jwt"];
  const issuerAddress = req.query.issuerAddress;
  // const privateKey = req.headers["private-key"];
  if (!vcJwt) {
    return res.status(400).json({ error: "vc-jwt not found." });
  }
  // if (!privateKey) {
  //   return res.status(400).json({ error: "private-key not found." });
  // }
  try {
    const verificationResponse = await verifyCredentialJWT(vcJwt);
    const issuer_did = verificationResponse.payload.iss;
    const holder_did = verificationResponse.payload.sub;
    console.log("issuer_did -> ", issuer_did);
    console.log("holder_did -> ", holder_did);
    const onChainVerificationResponse = await isCertificateOnChainVerified(
      issuer_did,
      holder_did,
      // privateKey,
      vcJwt
    );
    // verify revocation
    const credDoc = await getDoc(doc(db, "credentials", vcJwt));
    if (credDoc.exists()) {
      const credDocData = credDoc.data();
      const revocationEndTime = credDocData.revocation_end_time;
      if (revocationEndTime) {
        console.log("revocation_end_time -> ", revocationEndTime);
        const endDate = revocationEndTime.toDate();
        const currentDate = new Date();
        if (currentDate > endDate) {
          const isRevokedCurrently = true;
          return res.status(200).json({
            verificationResponse,
            onChainVerificationResponse,
            revocation: { isRevokedCurrently, endDate: endDate.getDate() },
          });
        }
      } else {
        const encrypCID = credDocData.vc_encrypted_hash;
        // verify on chain revocation
        const provider_contract = contract.connect(provider);
        const issuerRevokedCids = await provider_contract.addressToRevokedCIDS(
          issuerAddress
        );
        const isRevokedCurrently = issuerRevokedCids.includes(encrypCID);
        return res.status(200).json({
          verificationResponse,
          onChainVerificationResponse,
          revocation: { isRevokedCurrently, endDate: undefined },
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/vc/issuer_revoked_cids", async (req, res) => {
  const issuerAddress = req.query.issuerAddress;
  if (!issuerAddress) {
    return res.status(400).json({ error: "issuerAddress not found." });
  }
  try {
    const issuerRevokedCids = await getRevokedCIDs(issuerAddress);
    return res.status(200).json({ cids: issuerRevokedCids });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/vc/verify_vp", async (req, res) => {
  const vpJwt = req.headers["vp-jwt"];
  if (!vpJwt) {
    return res.status(400).json({ error: "vp-jwt not found." });
  }
  try {
    const vp = await verifyCredentialPresentation(vpJwt);
    return res.status(200).json({ vp });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/vc/decryptCID", async (req, res) => {
  const encryptedCIDs = req.headers["encrypted-cids"];
  console.log("encryp", encryptedCIDs);
  const formattedEncryptedCIDs = encryptedCIDs
    .split(",")
    .map((ecid) => ecid.trim());
  if (formattedEncryptedCIDs.length === 0) {
    return res.status(400).json({ error: "Invalid request body." });
  }
  console.log("formatted -> ", formattedEncryptedCIDs);
  // convert bytes into string
  const formattedEncryptedCIDsString = formattedEncryptedCIDs.map((ecid) =>
    bytesHexToString(ecid)
  );
  const decryptedCIDs = formattedEncryptedCIDsString.map((ecid) =>
    decryptCIDHash(ecid)
  );
  console.log(formattedEncryptedCIDsString);
  return res.status(200).json({ decryptedCIDs });
});

app.listen(port, async () => {
  console.log("Server is running on port " + port);
  // const signer = new ethers.Wallet("f013ecdaeaa6955889a6a38e67f391b67d328dd9b3afbc6574ac35c88fd5d0b3");
  // const buffer = Buffer.from([
  //   0x18, 0x98, 0x61, 0x0e, 0x80, 0x4e, 0x21, 0x60, 0x66, 0x82, 0x4e, 0x8c
  // ]);z1

  // // Convert the buffer to a base64 string
  // const base64String = buffer.toString("base64");
  // console.log(base64String);
  // const bufferFromEnv = Buffer.from(base64String, "base64");
  // console.log(bufferFromEnv);
  // const secret_key = crypto.randomBytes(16).toString("hex");
  // const secret_nonce = crypto.randomBytes(12).toString("hex");
  // console.log(secret_nonce, secret_key);
  // const enc = encryptCIDHash("9737bc0d89fe3b3d64a66b8fa2b35fea", "8965cb1e28c8e54ea3546af8", "XYZMSANSDAAKSDNMSADLAADAMDASDN");
  // const dec = decryptCIDHash("9737bc0d89fe3b3d64a66b8fa2b35fea", "8965cb1e28c8e54ea3546af8", enc);
  // console.log(dec);
});

export default app;
