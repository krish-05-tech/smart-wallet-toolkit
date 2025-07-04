// smart-wallet-frontend/src/App.jsx
import React from 'react';
// Import the ConnectButton from RainbowKit
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Import your SmartWalletCreator component
import SmartWalletCreator from './components/SmartWalletCreator';

function App() {
  // IMPORTANT: Replace this with the actual deployed EntryPoint address from your Hardhat project.
  // You would have gotten this when you ran your Hardhat deployment script for EntryPoint.
  const ENTRY_POINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example: "0x5FF137D4bEAEaC6Dcecc1Bf1De38ab7b88428Fbd"

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>My Smart Wallet App</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        {/* RainbowKit's connect button */}
        <ConnectButton />
      </div>

      <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

      {/* Render your SmartWalletCreator component */}
      {/* Pass the EntryPoint address to it, as it might be needed for future logic */}
      <SmartWalletCreator entryPointAddress={ENTRY_POINT_ADDRESS} />

      {/* You will add more components here later for:
          - Displaying the created Smart Wallet address
          - Funding the Smart Wallet
          - Sending transactions from the Smart Wallet (UserOperations)
          - Checking Smart Wallet balance
          - etc.
      */}
    </div>
  );
}

// Crucial: This line exports the App component as the default export,
// allowing main.jsx to import it as `import App from './App.jsx';`
export default App;