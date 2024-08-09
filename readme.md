### Self Sovereign Identity Kit

#### Overview

This project is a decentralized system designed for the creation, management, and verification of Decentralized Identifiers (DIDs) and Verifiable Certificates. The system leverages blockchain technology, IPFS for decentralized storage, and JWT (JSON Web Tokens) for secure communication and data integrity. It ensures that identities and certificates can be securely created, stored, and verified both on-chain and off-chain.

---

### Key Components

1. **User**: The entity requesting the creation of a DID or interacting with the system for certificate-related operations.
2. **Issuer**: The entity responsible for issuing verifiable certificates and presentations.
3. **Verifier**: The entity responsible for verifying the authenticity of DIDs and certificates.
4. **Server**: Handles the generation, storage, and retrieval of DIDs and certificates.
5. **IPFS (InterPlanetary File System)**: A decentralized storage solution where DID documents and certificates are stored.
6. **Blockchain**: A distributed ledger used to store references to the IPFS data, ensuring immutability and transparency.
7. **Smart Contract**: Deployed on the blockchain to manage and verify data related to DIDs and certificates.

---

### Workflow Summary

#### DID Creation and Verification

1. **DID Creation**
   - The user requests the creation of a DID by signing a request with their private key.
   - The server generates a DID document using S256K and EdDSA algorithms.
   - The DID document is stored on IPFS, and its hash is stored on the blockchain, linked to the user's public key/address.
   - The server returns a DID JWT (a token referencing the DID information) to the user.

2. **DID Verification**
   - When a verifier or issuer requests the DID token, the user provides it.
   - The server returns a verified DID document with verification status obtained by performs parallel verification, which includes:
     - **On-chain verification**: Uses smart contracts to verify the data on the blockchain.
     - **Off-chain verification**: Resolves the DID JWT by fetching data from IPFS, verifying its integrity with the data derived from the private ledger using cryptographic hashing algorithms.

#### Certificate Creation and Verification

1. **Certificate Creation**
   - The issuer creates a verifiable certificate and presentation based on the JWT standard.
   - The issuer signs the certificate with their private key.
   - The certificate is stored on IPFS, and the hash is encrypted and stored on the blockchain with reference to the issuer's public key.
   - The server returns the JWT of the verifiable credential and presentation to the issuer.

2. **Certificate Verification**
   - The verifier requests the certificate JWT from the user.
   - The server verifies the JWT by resolving it to the original certificate stored on IPFS by fetching and decoding data from the smart contract and matching it against the data stored on the blockchain.
   - Parallel verification is performed on-chain (using smart contracts) and off-chain (using IPFS and private ledger) to ensure the authenticity and integrity of the certificate.

---

### Diagram Reference

The attached diagrams visually represent the workflows described above. The first diagram details the certificate creation and verification process, while the second diagram outlines the DID creation and verification workflow. These diagrams serve as a comprehensive guide to understanding the sequence of operations, the interaction between various entities, and the parallel verification processes employed.

---

### Conclusion

This system provides a secure and decentralized method for managing identities and certificates. By leveraging blockchain technology, IPFS, and JWT, it ensures that all operations are transparent, immutable, and resistant to tampering. The parallel verification process further enhances the reliability of the system, making it suitable for applications requiring high security and trust.

---

This documentation serves as a high-level overview of the system's architecture and workflows. For more detailed technical documentation, please refer to the system's codebase and associated comments.