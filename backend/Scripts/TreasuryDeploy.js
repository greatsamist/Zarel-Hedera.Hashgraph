console.clear();
require("dotenv").config();
const {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  TokenCreateTransaction,
  FileCreateTransaction,
  FileAppendTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractCallQuery,
  TokenUpdateTransaction,
  ContractExecuteTransaction,
  TokenInfoQuery,
  AccountBalanceQuery,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);
const aliceKey = PrivateKey.fromString(process.env.ALICE_PVKEY);
const NFTAddress = AccountId.fromString(process.env.NFTADDR);
const TokenAddress = AccountId.fromString(process.env.TOKENADDR);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

///////////////////////////
const adminAddr = treasuryId.toSolidityAddress();
const tokenAddr = TokenAddress.toSolidityAddress();
const NFTAddr = NFTAddress.toSolidityAddress();

async function main() {
  // STEP 1 ===================================
  console.log(`STEP 1 ===================================`);
  const bytecode = fs.readFileSync("./Contracts_treasury_sol_Treasury.bin");
  console.log(`- Done \n`);

  // STEP 2 ===================================
  console.log(`STEP 2 ===================================`);

  //Create a file on Hedera and store the contract bytecode
  const fileCreateTx = new FileCreateTransaction()
    .setKeys([treasuryKey])
    .freezeWith(client);
  const fileCreateSign = await fileCreateTx.sign(treasuryKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateRx = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateRx.fileId;
  console.log(`- The smart contract bytecode file ID is ${bytecodeFileId}`);

  // Append contents to the file
  const fileAppendTx = new FileAppendTransaction()
    .setFileId(bytecodeFileId)
    .setContents(bytecode)
    .setMaxChunks(10)
    .freezeWith(client);
  const fileAppendSign = await fileAppendTx.sign(treasuryKey);
  const fileAppendSubmit = await fileAppendSign.execute(client);
  const fileAppendRx = await fileAppendSubmit.getReceipt(client);
  console.log(`- Content added: ${fileAppendRx.status} \n`);

  // STEP 3 ===================================
  console.log(`STEP 3 ===================================`);
  // Create the smart contract
  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(3000000)
    .setAdminKey(treasuryKey)
    .setConstructorParameters(new ContractFunctionParameters())
    .freezeWith(client);
  const contractExecSign1 = await contractInstantiateTx.sign(treasuryKey);
  const contractInstantiateSubmit = await contractExecSign1.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contractInstantiateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId}`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress} \n`
  );

  //////////////////////////////////////////
  // Associate Contract with Token
  console.log(`STEP 3b ===================================`);
  //Execute a contract function (associate)
  console.log(`ASSOCIATE TOKEN WITH CONTRACT ==================`);
  const contractExecTx1 = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      "tokenAssociate",
      new ContractFunctionParameters().addAddress(tokenAddr)
    )
    .freezeWith(client);
  //   const contractExecSign1 = await contractExecTx1.sign(aliceKey);
  const contractExecSubmit1 = await contractExecTx1.execute(client);
  const contractExecRx1 = await contractExecSubmit1.getReceipt(client);
  console.log(
    `- Token association with Contract's account: ${contractExecRx1.status.toString()} \n`
  );
  //////////////////////////////////////////
  console.log(`STEP 3c ===================================`);
  //Execute a contract function (associate)
  console.log(`ASSOCIATE NFT WITH CONTRACT ==================`);
  const contractExecTx2 = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      "tokenAssociate",
      new ContractFunctionParameters().addAddress(NFTAddr)
    )
    .freezeWith(client);
  //
  const contractExecSubmit2 = await contractExecTx2.execute(client);
  const contractExecRx2 = await contractExecSubmit2.getReceipt(client);
  console.log(
    `- NFT association with Contract's account: ${contractExecRx2.status.toString()} \n`
  );
}
main();
