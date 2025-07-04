import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// --- Wagmi & RainbowKit Imports ---
import "@rainbow-me/rainbowkit/styles.css"; // RainbowKit styles first
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi"; // The main Wagmi Provider component
import { sepolia, hardhat } from "wagmi/chains"; // Import specific chains you need
import { http } from "wagmi/chains"; // For configuring HTTP transport (new way)

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Required for Wagmi v1+

// --- Configuration ---
// 1. Define your chains
const enabledChains = [
  sepolia,
  hardhat, // Add hardhat chain for local development
  // Add other chains you want to support (e.g., mainnet, polygon, etc.)
];

// 2. Get the default config from RainbowKit, which handles Wagmi v1+ setup
const config = getDefaultConfig({
  appName: "Smart Wallet", // Your application name
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // <--- IMPORTANT: Replace with your actual WalletConnect Project ID
                                            // Get it from cloud.walletconnect.com
  chains: enabledChains,
  transports: {
    // Define the RPC URLs for your chains using 'http'
    [sepolia.id]: http("https://rpc.sepolia.org"), // Example public Sepolia RPC, consider Alchemy/Infura for production
    [hardhat.id]: http("http://127.0.0.1:8545"), // Your local Hardhat node URL
    // Add other chains as needed:
    // [mainnet.id]: http("https://eth.llamarpc.com"),
  },
});

// 3. Setup React Query Client (Wagmi v1+ uses React Query internally)
const queryClient = new QueryClient();

// --- Render your application ---
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap with WagmiProvider first, passing the 'config' */}
    <WagmiProvider config={config}>
      {/* Then with QueryClientProvider */}
      <QueryClientProvider client={queryClient}>
        {/* Finally, RainbowKitProvider with 'chains' from the config */}
        <RainbowKitProvider chains={config.chains}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);