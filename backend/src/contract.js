export const contract_address = "0x5d936440F9DC6ecDAd25Ae7B4698FbB237Da3850";
export const contract_abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "didHash",
        type: "string",
      },
    ],
    name: "DeletedDID",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "didIndex",
        type: "uint8",
      },
    ],
    name: "removeResolvableDIDHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "setIssuedCertificateHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "didHash",
        type: "string",
      },
    ],
    name: "setResolvableDIDHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "publicKey",
        type: "address",
      },
    ],
    name: "retrieveResolvableDIDHash",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "issuer",
        type: "address",
      },
    ],
    name: "userToIssuedCertificates",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address",
      },
    ],
    name: "userToOwnedCertificates",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const test_contract_address = "";

export const test_contract_abi = [];
