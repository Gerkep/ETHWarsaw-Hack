import { ethers } from "hardhat";

async function main() {

  const Booker = await ethers.getContractFactory("Booker");
  const booker = await Booker.deploy();

  await booker.deployed();

  console.log(`Booker deployed to ${booker.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
