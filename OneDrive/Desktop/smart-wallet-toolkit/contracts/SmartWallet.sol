// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/interfaces/UserOperation.sol";
import "@account-abstraction/contracts/core/UserOperationLib.sol";

using UserOperationLib for UserOperation;


import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartWallet is BaseAccount, Ownable {
    using ECDSA for bytes32;

    IEntryPoint private immutable _entryPoint;

    constructor(IEntryPoint entryPoint_, address initialOwner) {
        _entryPoint = entryPoint_;
        _transferOwnership(initialOwner);
    }

    receive() external payable {}

    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal view override returns (uint256 validationData)
    {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        require(owner() == hash.recover(userOp.signature), "Invalid signature");
        return 0;
    }

    function _validateAndUpdateNonce(UserOperation calldata userOp)
        internal override returns (uint256) {
        return 0; // MVP version — no nonce logic
    }

    function execute(address dest, uint256 value, bytes calldata func) external onlyOwner {
        (bool success, ) = dest.call{value: value}(func);
        require(success, "Execution failed");
    }

    function executeBatch(address[] calldata dests, bytes[] calldata funcs) external onlyOwner {
        require(dests.length == funcs.length, "Mismatched arrays");
        for (uint i = 0; i < dests.length; i++) {
            (bool success, ) = dests[i].call(funcs[i]);
            require(success, "Batch execution failed");
        }
    }

    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }
}
