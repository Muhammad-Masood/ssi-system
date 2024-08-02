import {
  createVerifiableCredentialJwt,
  createVerifiablePresentationJwt,
  verifyCredential,
  JwtCredentialPayload,
  JwtPresentationPayload,
  verifyPresentation,
} from "did-jwt-vc";
import { getResolver } from "ethr-did-resolver";
import { Resolver } from "did-resolver";
import { EthrDID } from "ethr-did";
import { createDIDJWT } from "../../did/services";
import { ES256KSigner, hexToBytes } from "did-jwt";

const issuer = new EthrDID({
  identifier: "0x1F4D71254a9175c13c6e8ff441f42D4aE42487De",
  privateKey:
    "f013ecdaeaa6955889a6a38e67f391b67d328dd9b3afbc6574ac35c88fd5d0b3",
});

/**
 * Creates a Verifiable Credential
 * @param {JwtCredentialPayload} vcPayload - The payload of the verifiable credential
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
  console.log(verifiedVC);
  return verifiedVC;
};

/**
 * Creates a Verifiable Credential
 * @param {JwtPresentationPayload} vpPayload - The payload of the verifiable credential
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

export {
  createVerifiableCredential,
  verifyCredentialJWT,
  verifyCredentialPresentation,
  createVCPresentation,
};
