
import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ethers } from 'ethers'; // For encoding data

// Import your contract ABIs
import SmartWalletFactoryAbi from '../contracts/SmartWalletFactory.json';
// You might also need the EntryPoint ABI if you directly call handleOps from here
// import EntryPointAbi from '../contracts/EntryPoint.json';

const SMART_WALLET_FACTORY_ADDRESS = "YOUR_SMART_WALLET_FACTORY_ADDRESS"; // Hardcode or get from config

function SmartWalletCreator({ entryPointAddress }) {
  const { address: eoaAddress } = useAccount();
  const [newWalletAddress, setNewWalletAddress] = useState(null);
  const [salt, setSalt] = useState(0); // For create2 based factory

  // Wagmi hook to write to the factory contract
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Wagmi hook to wait for the transaction to be mined
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const createSmartWallet = async () => {
    if (!eoaAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    // You'd typically increment salt or derive it uniquely
    setSalt(Date.now()); // Simple unique salt for testing

    try {
      writeContract({
        address: SMART_WALLET_FACTORY_ADDRESS,
        abi: SmartWalletFactoryAbi.abi, // Use the ABI from your JSON file
        functionName: 'createAccount',
        args: [eoaAddress, salt], // Pass the owner (your EOA) and a salt
      });
    } catch (err) {
      console.error("Error creating smart wallet:", err);
    }
  };

  React.useEffect(() => {
    if (isConfirmed && hash) {
      // You'll need to parse the event from the transaction receipt
      // to get the new wallet address. This is a simplified example.
      // For a real factory, you'd listen to the SmartWalletCreated event.
      console.log("Transaction hash:", hash);
      alert("Smart Wallet creation transaction sent! Check console for details.");
      // For a true factory, you would use event listeners on the receipt
      // to get the created address. For now, assume a simple deployment.
      // You'll need to fetch the address by calling the factory's
      // `getAddress` (if it exists) or by parsing the event.
    }
    if (error) {
        console.error("Transaction error:", error);
        alert("Error creating wallet: " + error.message);
    }
  }, [isConfirmed, hash, error]);

  return (
    <div>
      <h3>Create New Smart Wallet</h3>
      <button onClick={createSmartWallet} disabled={isPending || isConfirming}>
        {isPending ? 'Confirming...' : isConfirming ? 'Creating Wallet...' : 'Create Wallet'}
      </button>
      {newWalletAddress && <p>New Smart Wallet deployed at: {newWalletAddress}</p>}
      {error && <p className="error">Error: {error.message}</p>}
    </div>
  );
}

export default SmartWalletCreator;