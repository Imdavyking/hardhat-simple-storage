const {task} = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(async (taskArgs, hre) => {
   const blockNumbr = await hre.ethers.provider.getBlockNumber();
   console.log("Current block number: ", blockNumbr);
});