const { ethers, run, network } = require("hardhat")
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying SimpleStorage...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.waitForDeployment()
    console.log(`Deploying contract to: ${await simpleStorage.getAddress()}`)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await verify(await simpleStorage.getAddress(), [])
    }
    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value: ${currentValue.toString()}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value: ${updatedValue.toString()}`)
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.includes("Already verified")) {
            console.log("Already verified")
        }
        console.error(e)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
