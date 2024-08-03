import express from "express";
import bodyParser from "body-parser";
import {
  createDIDJWT,
  decodeDIDJWT,
  storeDecodedJWTIPFS,
  verifyJwt,
} from "./did/services/index.js";
import {
  createVCPresentation,
  createVerifiableCredential,
  verifyCredentialJWT,
  verifyCredentialPresentation,
} from "./credential/services/index.js";
import axios from "axios";

const app = express();
const port = 3000;
app.use(bodyParser.json());

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
  const cid = await storeDecodedJWTIPFS(decoded_data);
  console.log(cid);
  return res.status(200).json({ decoded_data });
});

app.get("/dids/verify_did_jwt", async (req, res) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }
  const verificationResponse = await verifyJwt(token);
  return res.status(200).json({ verificationResponse });
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
  if (!vcJwt) {
    return res.status(400).json({ error: "vc-jwt not found." });
  }
  const vc = await verifyCredentialJWT(vcJwt);
  return res.status(200).json({ vc });
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
});

export default app;
