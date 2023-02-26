import { Ballot } from "./../typechain-types/Ballot";
import { Ballot__factory } from "../typechain-types/factories/Ballot__factory";
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Address } from "hardhat-deploy/dist/types";
dotenv.config();

const grantRights = async () => {
  const INFURA_API_KEY = process.env.INFURA_API_KEY;
  const SECRET_PHRASE = process.env.SECRET_PHRASE || "";
  const voters: Address[] = [
    ...(process.env.VOTER_1 ? [process.env.VOTER_1] : []),
    ...(process.env.VOTER_2 ? [process.env.VOTER_2] : []),
    ...(process.env.VOTER_3 ? [process.env.VOTER_3] : []),
  ];
  const smartContractAddres: Address = process.env.CONTRACT_ADDRESS || "";
  try {
    const provider = new ethers.providers.InfuraProvider("goerli", INFURA_API_KEY);
    let wallet = ethers.Wallet.fromMnemonic(SECRET_PHRASE);
    const signer = wallet.connect(provider);
    const BallotFactory = new Ballot__factory(signer);
    const contractInstance: Ballot = BallotFactory.attach(smartContractAddres);
    const grantAccessPromise = voters.map(async (voter) => {
      return await contractInstance.giveRightToVote(voter);
    });
    const transactionRecepits = Promise.all(grantAccessPromise);
    console.log("🦀 ~ file: grantVotingRights.ts:28 ~ grantRights ~ transactionRecepits:", transactionRecepits);
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

grantRights().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
