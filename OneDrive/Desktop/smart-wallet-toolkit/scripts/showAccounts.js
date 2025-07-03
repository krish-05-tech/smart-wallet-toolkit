const { ethers } = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();
  for (let account of accounts) {
    console.log(`Address: ${account.address}`);
  }
}

main();
