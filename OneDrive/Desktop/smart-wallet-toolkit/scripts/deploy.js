const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with address:", deployer.address);

  // Dummy EntryPoint for local
  const ENTRY_POINT_ADDRESS = "0x0000000000000000000000000000000000000001";

  const SmartWallet = await ethers.getContractFactory("SmartWallet");
  const wallet = await SmartWallet.deploy(ENTRY_POINT_ADDRESS, deployer.address);

  await wallet.deployed();

  console.log("✅ SmartWallet deployed to:", wallet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
