import express from "express";
import bodyParser from "body-parser";
import {
  createDIDJWT,
  decodeDIDJWT,
  isDIDOnChainVerified,
  verifyDIDJwt,
} from "./did/services/index.js";
import {
  createVCPresentation,
  createVerifiableCredential,
  isCertificateOnChainVerified,
  verifyCredentialJWT,
  verifyCredentialPresentation,
} from "./credential/services/index.js";
import axios from "axios";
import crypto from "crypto";
import { ethers } from "ethers";
import { contract_abi, contract_address } from "./contract.js";

const app = express();
const port = 3000;
app.use(bodyParser.json());
const pinataGateway = "https://api.pinata.cloud";

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
  if (!privateKey) {
    return res.status(400).json({ error: "Invalid private key" });
  }
  try {
    const jwt = await createDIDJWT(subject, privateKey, method);
    return res.status(200).json({ token: jwt });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create JWT", details: error.message });
  }
});

app.get("/dids/decode_did_jwt", async (req, res) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }
  const decoded_data = decodeDIDJWT(token);
  const decoded_data_json = JSON.stringify(decoded_data);
  const cid = await storeDataOnIPFS(decoded_data_json);
  console.log(cid);
  return res.status(200).json({ decoded_data });
});

app.get("/dids/verify_did_jwt", async (req, res) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }
  const verificationResponse = await verifyDIDJwt(token);
  const onChainVerificationResponse = await isDIDOnChainVerified(
    verificationResponse.payload.sub,
    token
  );
  return res.status(200).json({
    offChainVerificationStatus: verificationResponse.verified,
    onChainVerificationStatus: onChainVerificationResponse,
  });
});

////////////////////////////////
// Verifiable Credentials (VCs)
////////////////////////////////

app.get("/vc", (req, res) => {
  res.send("Verifiable Credentials.");
});

app.post("/vc/create_vc", async (req, res) => {
  const issuerDID = req.body.issuer_did;
  const holderDID = req.body.holder_did;
  const issuerPrivateKey = req.headers["private-key"];

  if (!issuerPrivateKey) {
    return res.status(400).json({ error: "private key not found." });
  }
  if (!issuerDID) {
    return res.status(400).json({ error: "issuer DID not found." });
  }
  if (!holderDID) {
    return res.status(400).json({ error: "holder DID not found." });
  }

  const vcPayload = {
    sub: holderDID,
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      credentialSubject: {
        certificate: {
          type: "Medical",
          name: "Certified Respiratory Therapist",
        },
      },
    },
  };
  const vcJwt = await createVerifiableCredential(
    vcPayload,
    issuerDID,
    issuerPrivateKey
  );
  const vpPayload = {
    vp: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: [vcJwt],
    },
  };
  const vpJwt = await createVCPresentation(
    vpPayload,
    issuerDID,
    issuerPrivateKey
  );
  return res
    .status(200)
    .json({ verifiable_credential: vcJwt, verifiable_presentation: vpJwt });
});

app.get("/vc/verify_vc", async (req, res) => {
  const vcJwt = req.headers["vc-jwt"];
  const privateKey = req.headers["private-key"];
  if (!vcJwt) {
    return res.status(400).json({ error: "vc-jwt not found." });
  }
  const verificationResponse = await verifyCredentialJWT(vcJwt);
  const issuer_did = verificationResponse.payload.iss;
  const holder_did = verificationResponse.payload.sub;
  const onChainVerificationResponse = await isCertificateOnChainVerified(
    issuer_did,
    holder_did,
    privateKey,
    vcJwt
  );
  return res
    .status(200)
    .json({ verificationResponse, onChainVerificationResponse });
});

app.get("/vc/verify_vp", async (req, res) => {
  const vpJwt = req.headers["vp-jwt"];
  if (!vpJwt) {
    return res.status(400).json({ error: "vp-jwt not found." });
  }
  const vp = await verifyCredentialPresentation(vpJwt);
  return res.status(200).json({ vp });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
  // const buffer = Buffer.from([
  //   0x18, 0x98, 0x61, 0x0e, 0x80, 0x4e, 0x21, 0x60, 0x66, 0x82, 0x4e, 0x8c,
  //   0x0a, 0xf1, 0x83, 0xbb,
  // ]);
  // const base64String = buffer.toString("base64");
  // console.log(base64String);
  // const bufferFromEnv = Buffer.from(base64String, "base64");
  // console.log(bufferFromEnv);
});

export default app;
