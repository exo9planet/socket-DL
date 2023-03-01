import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { network, ethers, run } from "hardhat";

import { ContractFactory, Contract } from "ethers";
import { Address } from "hardhat-deploy/dist/types";
import path from "path";
import fs from "fs";
import { ChainSocketAddresses, DeploymentAddresses } from "../../../src";

export const deployedAddressPath = path.join(
  __dirname,
  "/../../../deployments/addresses.json"
);

export const deployContractWithoutArgs = async (
  contractName: string,
  signer: SignerWithAddress,
  path: string
): Promise<Contract> => {
  try {
    const Contract: ContractFactory = await ethers.getContractFactory(
      contractName
    );
    const contractInstance: Contract = await Contract.connect(signer).deploy();
    await contractInstance.deployed();
    await verify(contractInstance.address, contractName, path, []);

    return contractInstance;
  } catch (error) {
    throw error;
  }
};

export async function deployContractWithArgs(contractName: string, args: Array<any>, signer: SignerWithAddress, path: string) {
  try {
    const Contract: ContractFactory = await ethers.getContractFactory(
      contractName
    );

    const contract: Contract = await Contract.connect(signer).deploy(...args);
    await contract.deployed();

    await verify(contract.address, contractName, path, args);
    return contract;
  } catch (error) {
    throw error;
  }
}

export const verify = async (
  address: string,
  contractName: string,
  path: string,
  args: any[]
) => {
  try {
    const chainId = await getChainId();
    if (chainId === 31337) return;

    await sleep(20);
    console.log(`inside verify contract for contract: ${address} and name: ${path}:${contractName} - with args: ${args}`);
    await run("verify:verify", {
      address,
      contract: `${path}:${contractName}`,
      constructorArguments: args,
    });
  } catch (error) {
    console.log("Error during verification", error);
  }
};

export const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay * 1000));

export const getInstance = async (contractName: string, address: Address): Promise<Contract> =>
  (await ethers.getContractFactory(contractName)).attach(address);

export const getChainId = async (): Promise<number> => {
  if (network.config.chainId === undefined)
    throw new Error("chain id not found");
  return Number(network.config.chainId);
};

export const integrationType = (integrationName: string) =>
  ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(["string"], [integrationName])
  );

export const storeAddresses = async (
  addresses: ChainSocketAddresses,
  chainId: number
) => {
  if (!fs.existsSync(deployedAddressPath)) {
    await fs.promises.mkdir(deployedAddressPath);
  }

  const outputExists = fs.existsSync(deployedAddressPath);
  let deploymentAddresses: DeploymentAddresses = {};
  if (outputExists) {
    const deploymentAddressesString = fs.readFileSync(
      deployedAddressPath,
      "utf-8"
    );
    deploymentAddresses = JSON.parse(deploymentAddressesString);
  }

  deploymentAddresses[chainId] = addresses;
  fs.writeFileSync(
    deployedAddressPath,
    JSON.stringify(deploymentAddresses, null, 2)
  );
};

export const getAddresses = async (
  chainId: number
) => {
  if (!fs.existsSync(deployedAddressPath)) {
    await fs.promises.mkdir(deployedAddressPath);
  }

  const outputExists = fs.existsSync(deployedAddressPath);
  let deploymentAddresses: DeploymentAddresses = {};
  if (outputExists) {
    const deploymentAddressesString = fs.readFileSync(
      deployedAddressPath,
      "utf-8"
    );
    deploymentAddresses = JSON.parse(deploymentAddressesString);
  }

  return deploymentAddresses[chainId];
};

export const createObj = function (obj, keys, value) {
  if (keys.length === 1) {
    obj[keys[0]] = value;
  } else {
    const key = keys.shift();
    obj[key] = createObj(
      typeof obj[key] === "undefined" ? {} : obj[key],
      keys,
      value
    );
  }
  return obj;
};