// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SSI {
    mapping(address key => bytes[] dids) private addressToDIDs;
    mapping(address key => bytes[] cidHash) private addressToIssuedCIDs;
    mapping(address key => bytes[] cidHash) private addressToOwnedCIDs;
    mapping(address key => bytes[] revokedCids) private addressToRevokedCIDs;
    mapping(address key => mapping(bytes cidHash => bool isIssued))
        private isCidIssuedToHolder;

    event CIDIssued(address issuer, address holder, bytes indexed cidHash);
    event DeletedDID(address user, bytes indexed didHash);
    event CIDRevoked(address issuer, bytes indexed cidHash);

    modifier onlyIssuer(bytes memory cidHash) {
        bytes[] memory senderIssuedCids = addressToIssuedCIDs[msg.sender];
        uint256 senderIssuedCidsLen = senderIssuedCids.length;
        bool isCidIssuedBySender;
        for (uint256 i = 0; i < senderIssuedCidsLen; i++) {
            if (keccak256(senderIssuedCids[i]) == keccak256(cidHash))
                isCidIssuedBySender = true;
        }
        require(isCidIssuedBySender, "CID not issued by the sender!");
        _;
    }

    function setResolvableDIDHash(bytes memory didHash) external {
        addressToDIDs[msg.sender].push(didHash);
    }

    function removeResolvableDIDHash(uint8 didIndex) external {
        bytes memory deletedDIDHash = addressToDIDs[msg.sender][didIndex];
        delete addressToDIDs[msg.sender][didIndex];
        emit DeletedDID(msg.sender, deletedDIDHash);
    }

    function setIssuedCertificateHash(
        address holder,
        bytes memory hash
    ) external {
        require(
            !isCidIssuedToHolder[holder][hash],
            "Certificate issued already!"
        );
        address issuer = msg.sender;
        addressToIssuedCIDs[issuer].push(hash);
        addressToOwnedCIDs[holder].push(hash);
        isCidIssuedToHolder[holder][hash] = true;
        emit CIDIssued(issuer, holder, hash);
    }

    function revokeCertificate(
        bytes memory cidHash
    ) external onlyIssuer(cidHash) {
        addressToRevokedCIDs[msg.sender].push(cidHash);
        emit CIDRevoked(msg.sender, cidHash);
    }

    function retrieveResolvableDIDHash(
        address publicKey
    ) external view returns (bytes[] memory) {
        return addressToDIDs[publicKey];
    }

    function userToOwnedCertificates(
        address holder
    ) external view returns (bytes[] memory) {
        return addressToOwnedCIDs[holder];
    }

    function userToIssuedCertificates(
        address issuer
    ) external view returns (bytes[] memory) {
        return addressToIssuedCIDs[issuer];
    }

    function addressToRevokedCIDS(
        address issuer
    ) external view returns (bytes[] memory) {
        return addressToRevokedCIDs[issuer];
    }
}
