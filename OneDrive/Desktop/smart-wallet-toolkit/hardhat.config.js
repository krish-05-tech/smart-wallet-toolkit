require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1 private key
      ],
    },
  },
  solidity: "0.8.19",
};
