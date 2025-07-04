// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// All imports should come first
import "@account-abstraction/contracts/core/UserOperationLib.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// You might also need Strings for abi.encodePacked with int/uint.
// import "@openzeppelin/contracts/utils/Strings.sol";

contract SmartWallet is BaseAccount, Ownable {
    using ECDSA for bytes32;

    // MOVED THIS LINE INSIDE THE CONTRACT
    using UserOperationLib for IEntryPoint.UserOperation;

    IEntryPoint private immutable _entryPoint;

    mapping(uint256 => uint256) private _nonces;

    constructor(IEntryPoint entryPoint_, address initialOwner)
        Ownable(initialOwner)
    {
        _entryPoint = entryPoint_;
    }

    receive() external payable {}

    function _validateSignature(IEntryPoint.UserOperation calldata userOp, bytes32 userOpHash)
        internal view override returns (uint256 validationData)
    {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        require(owner() == hash.recover(userOp.signature), "SmartWallet: Invalid signature");
        return 0;
    }

    function _validateAndUpdateNonce(IEntryPoint.UserOperation calldata userOp)
        internal override returns (uint256)
    {
        uint256 key = userOp.getNonceKey();
        uint256 sequence = userOp.getNonceSequence();

        require(_nonces[key] == sequence, "SmartWallet: Invalid nonce sequence");
        _nonces[key]++;
        return key;
    }

    function execute(address dest, uint256 value, bytes calldata func) external onlyOwner {
        (bool success, ) = dest.call{value: value}(func);
        require(success, "SmartWallet: Execution failed");
    }

    function executeBatch(address[] calldata dests, bytes[] calldata funcs) external onlyOwner {
        require(dests.length == funcs.length, "SmartWallet: Mismatched arrays length");
        for (uint i = 0; i < dests.length; i++) {
            (bool success, ) = dests[i].call(funcs[i]);
            // If you uncommented Strings.sol, then this line is valid:
            // require(success, string(abi.encodePacked("SmartWallet: Batch execution failed at index ", Strings.toString(i))));
            // Otherwise, for now, just a generic message:
            require(success, "SmartWallet: Batch execution failed");
        }
    }

    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }

    function getNonce(uint256 key) public view returns (uint256) {
        return _nonces[key];
    }
}