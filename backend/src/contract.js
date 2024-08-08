export const contract_address = "0xe6a020B40Cf8eE72475F7171A1300CFb55064b61";
export const contract_abi = [
  {
    inputs: [{ internalType: "address", name: "publicKey", type: "address" }],
    name: "retrieveResolvableDIDHash",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "string", name: "hash", type: "string" },
    ],
    name: "setIssuedCertificateHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "didHash", type: "string" }],
    name: "setResolvableDIDHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "issuer", type: "address" }],
    name: "userToIssuedCertificates",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "userToOwnedCertificates",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
];

export const test_contract_address = "";

export const test_contract_abi = [];
