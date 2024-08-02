import express from "express";
import bodyParser from "body-parser";
import { createDIDJWT, decodeDIDJWT, verifyJwt } from "./did/services/index.js";

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
  const method = req.body.method;
  const privateKey = req.headers["private-key"];
  if (!privateKey) {
    return res.status(400).json({ error: "Invalid private key" });
  }
  try {
    const jwt = await createDIDJWT("test_did", privateKey, method);
    return res.status(200).json({ token: jwt });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create JWT", details: error.message });
  }
});

app.get("/dids/decode_did_jwt", (req, res) => {
  const token = req.headers["token"];
  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }
  const decoded_data = decodeDIDJWT(token);
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

app.post("/vc/create_vc", (req, res) => {
  const vcPayload = {
    sub: "did:ethr:0x1F4D71254a9175c13c6e8ff441f42D4aE42487De",
    nbf: 1562950282,
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      credentialSubject: {
        degree: {
          type: "BachelorDegree",
          name: "Baccalauréat en musiques numériques",
        },
      },
    },
  };
});

app.get("/vc/verify_vc", (req, res) => {});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

export default app;
