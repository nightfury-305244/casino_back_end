const { ethers } = require("ethers");

const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address;

  return address;
};

module.exports = { createWallet };
