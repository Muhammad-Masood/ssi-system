export const contract_address = "0xB4EEC5221C0239C78EBC5cF3296832Cc96380BA0";
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