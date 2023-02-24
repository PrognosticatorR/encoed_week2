import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import "@nomiclabs/hardhat-ethers";
import { Ballot } from "./../typechain-types/Ballot";
import { ethers } from "hardhat";
import hre from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const deployeContract = async () => {
  const INFURA_API_KEY = process.env.INFURA_API_KEY;
  const SECRET_PHRASE = process.env.SECRET_PHRASE || "";
  const p1 = process.env.PROPOSAL_1 || "";
  const p2 = process.env.PROPOSAL_2 || "";
  const p3 = process.env.PROPOSAL_3 || "";
  const proposals = [p1, p2, p3];
  try {
    const provider = new ethers.providers.InfuraProvider("goerli", INFURA_API_KEY);
    let wallet = ethers.Wallet.fromMnemonic(SECRET_PHRASE);
    const signer = wallet.connect(provider);
    console.log(wallet);
    const bytes32StringsArr = proposals.map((proposal) => ethers.utils.formatBytes32String(proposal));
    const BallotContractFactory = new Ballot__factory(signer);
    BallotContractFactory.connect(wallet);
    const ballotContract = await BallotContractFactory.deploy(bytes32StringsArr);
    const receipt = await ballotContract.deployTransaction.wait();
    console.log(receipt);
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

deployeContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
