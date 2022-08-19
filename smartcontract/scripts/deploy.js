const hre = require("hardhat");

const main = async () => {
  const rsvpContractFactory = await hre.ethers.getContractFactory("DPlanner");
  const rsvpContract = await rsvpContractFactory.deploy();
  await rsvpContract.deployed();
  console.log("Contract deployed to:", rsvpContract.address); // 0xC4DA71Af5DfB5133d9fcad4A6cc5195AE0bf2515 - Address of Dplanner
};
0xC4DA71Af5DfB5133d9fcad4A6cc5195AE0bf2515
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();