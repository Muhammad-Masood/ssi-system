// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SSI {

    mapping(address key => string[] dids) private addressToDIDs;
    mapping(address key => string[] cidHash) private addressToIssuedCIDs;
    mapping(address key => string[] cidHash) private addressToOwnedCIDs;

    function setResolvableDIDHash(string memory didHash) external {
        addressToDIDs[msg.sender].push(didHash);
    }

    function setIssuedCertificateHash(address holder, string memory hash) external {
        addressToIssuedCIDs[msg.sender].push(hash);
        addressToOwnedCIDs[holder].push(hash);
    }

    function retrieveResolvableDIDHash(address publicKey) external view returns(string[] memory) {
        return addressToDIDs[publicKey];
    }

    function userToOwnedCertificates(address holder) external view returns (string [] memory) {
        return addressToOwnedCIDs[holder];
    }

    function userToIssuedCertificates(address issuer) external view returns (string [] memory) {
        return addressToIssuedCIDs[issuer];
    }
}