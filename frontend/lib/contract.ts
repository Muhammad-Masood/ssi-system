import { ethers } from "ethers";

export const contract_address = "0xEc33375bFB03a6Bc833f25c10F65af8EA67F5bC3";
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


export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
export const contract = new ethers.Contract(contract_address, contract_abi, provider);