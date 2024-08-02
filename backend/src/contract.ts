export const contract_address: string =
  "0x92a33E46cd11E1f55e3A59A32D805051142a77F5";
export const contract_abi = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "giverDID",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "takerDID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "certificateUri",
        type: "string[]",
      },
    ],
    name: "BulkCertificatesIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "giverDID",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "takerDID",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "certificateUri",
        type: "string",
      },
    ],
    name: "CertificateIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "takerAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "giverAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "courseName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "certificateUrl",
        type: "string",
      },
    ],
    name: "CertificateSend",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "string", name: "did", type: "string" },
    ],
    name: "DIDAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [{ internalType: "string", name: "_did", type: "string" }],
    name: "assignDID",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "keyword", type: "string" }],
    name: "find_certificates",
    outputs: [
      { internalType: "string[]", name: "Certificates", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "keyword", type: "string" }],
    name: "find_skills",
    outputs: [{ internalType: "string[]", name: "Skills", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDID",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "get_received_Certificates",
    outputs: [
      {
        internalType: "address[]",
        name: "_sended_addresses",
        type: "address[]",
      },
      { internalType: "string[]", name: "_course_names", type: "string[]" },
      { internalType: "string[]", name: "_certificate_uris", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_did", type: "string" }],
    name: "get_user_data",
    outputs: [
      {
        components: [
          { internalType: "string", name: "did", type: "string" },
          { internalType: "address", name: "user_address", type: "address" },
          {
            internalType: "string[]",
            name: "issued_certificates",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "owned_certificates",
            type: "string[]",
          },
        ],
        internalType: "struct certification_system.user_data",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "string", name: "_course_name", type: "string" },
    ],
    name: "is_user_certified",
    outputs: [
      {
        internalType: "enum certification_system.user_status",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_issuer_did", type: "string" },
      { internalType: "string", name: "_receiver_did", type: "string" },
      {
        internalType: "string[]",
        name: "_certificates_uris",
        type: "string[]",
      },
    ],
    name: "issueBulkCertificates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_issuer_did", type: "string" },
      { internalType: "string", name: "_receiver_did", type: "string" },
      { internalType: "string", name: "_certificate_uri", type: "string" },
    ],
    name: "issueCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const test_contract_address: string =
  "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const test_contract_abi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "assignDID",
    inputs: [{ name: "_did", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDIDStatus",
    inputs: [{ name: "did", type: "string", internalType: "string" }],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum DecentralizeIdentity.DIDStatus",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDIDs",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "string[]", internalType: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHoldedCredentials",
    inputs: [{ name: "did", type: "string", internalType: "string" }],
    outputs: [
      { name: "credentials", type: "string[]", internalType: "string[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getIssuedCredentials",
    inputs: [{ name: "did", type: "string", internalType: "string" }],
    outputs: [
      { name: "credentials", type: "string[]", internalType: "string[]" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "issueCredentials",
    inputs: [
      { name: "issuer_did", type: "string", internalType: "string" },
      { name: "holder_did", type: "string", internalType: "string" },
      { name: "credential", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "maxDIDs",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "removeDID",
    inputs: [{ name: "_did", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CredentialIssued",
    inputs: [
      { name: "issuer", type: "string", indexed: true, internalType: "string" },
      {
        name: "credential",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      { name: "holder", type: "string", indexed: true, internalType: "string" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DIDAssigned",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "did", type: "string", indexed: true, internalType: "string" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DIDRemoved",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "did", type: "string", indexed: true, internalType: "string" },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "MAX_DIDs_Created",
    inputs: [{ name: "_dids", type: "uint256", internalType: "uint256" }],
  },
  { type: "error", name: "UNDEFINED_OR_EXPIRED_DID", inputs: [] },
  { type: "error", name: "Unauthorized", inputs: [] },
];
