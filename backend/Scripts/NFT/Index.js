console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  FileCreateTransaction,
  FileAppendTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  TokenUpdateTransaction,
  ContractExecuteTransaction,
  TokenInfoQuery,
  AccountBalanceQuery,
  TokenMintTransaction,
  TransferTransaction,
  TokenAssociateTransaction,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PVKEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);
const aliceKey = PrivateKey.fromString(process.env.ALICE_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const supplyKey = PrivateKey.generate();

async function main() {
  // STEP 1 ===================================
  console.log(`STEP 1 ===================================`);
  const bytecode = fs.readFileSync(
    "./Contracts/bin/Contracts_ZarelNFT_sol_ZarelNFT.bin"
  );
  console.log(`- Done \n`);

  // STEP 2 ===================================
  console.log(`STEP 2 ===================================`);

  //Create the NFT
  let nftCreate = await new TokenCreateTransaction()
    .setTokenName("ZarelNFT")
    .setTokenSymbol("ZNFT")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(treasuryId)
    .setAdminKey(treasuryKey)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(5)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  //Sign the transaction with the treasury key
  let nftCreateTxSign = await nftCreate.sign(treasuryKey);

  //Submit the transaction to a Hedera network
  let nftCreateSubmit = await nftCreateTxSign.execute(client);

  //Get the transaction receipt
  let nftCreateRx = await nftCreateSubmit.getReceipt(client);

  //Get the token ID
  let tokenId = nftCreateRx.tokenId;
  let tokenAddressSol = tokenId.toSolidityAddress();

  //Log the token ID
  console.log(`- Created NFT with Token ID: ${tokenId} \n`);
  console.log(`- Token ID in Solidity format: ${tokenAddressSol}`);

  //IPFS content identifiers for which we will create a NFT
  CID = ["QmaF4tgqTVLybSnrgBWaAPUeogUZo19GnQDUfDxXosjRqJ"];
  ///////////////////////////////////////////////////
  console.log(`STEP 3 ================================`);
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
  console.log(`STEP 3b ===================================`);
  // Create the smart contract
  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(2000000)
    .setConstructorParameters(
      new ContractFunctionParameters().addAddress(tokenAddressSol)
    );
  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contractInstantiateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(`- The smart contract ID is: ${contractId}`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress} \n`
  );

  // Token query 2.1
  const tokenInfo2p1 = await tQueryFcn(tokenId);
  console.log(`- Token supply key: ${tokenInfo2p1.supplyKey.toString()}`);

  // Update the Non fungible so the smart contract manages the supply
  // const tokenUpdateTx = await new TokenUpdateTransaction()
  //   .setTokenId(tokenId)
  //   .setSupplyKey(contractId)
  //   .freezeWith(client)
  //   .sign(treasuryKey);
  // const tokenUpdateSubmit = await tokenUpdateTx.execute(client);
  // const tokenUpdateRx = await tokenUpdateSubmit.getReceipt(client);
  // console.log(`- Token update status: ${tokenUpdateRx.status}`);

  // // Token query 2.2
  // const tokenInfo2p2 = await tQueryFcn(tokenId);
  // console.log(`- Token supply key: ${tokenInfo2p2.supplyKey.toString()} \n`);

  ///////////////////////////////////////////////////

  // STEP 4 ===================================
  // console.log(`STEP 4 ===================================`);
  // //Execute a contract function (mint)
  // const contractExecTx = await new ContractExecuteTransaction()
  //   .setContractId(contractId)
  //   .setGas(3000000)
  //   .setFunction(
  //     "mintZarelNFT",
  //     new ContractFunctionParameters().addBytesArray([Buffer.from(CID)])
  //   );
  // console.log(`1 passssssssssssss`);
  // const contractExecSubmit = await contractExecTx.execute(client);
  // console.log(`1 passssssssssssss`);
  // const contractExecRx = await contractExecSubmit.getReceipt(client);
  // console.log(`- New tokens minted: ${contractExecRx.serials[0].low}`);

  // // Token query 3
  // const tokenInfo3 = await tQueryFcn(tokenId);
  // console.log(`- New token supply: ${tokenInfo3.totalSupply.low} \n`);

  // Mint new NFT
  let mintTx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata([Buffer.from(CID)])
    .freezeWith(client);

  //Sign the transaction with the supply key
  let mintTxSign = await mintTx.sign(supplyKey);

  //Submit the transaction to a Hedera network
  let mintTxSubmit = await mintTxSign.execute(client);

  //Get the transaction receipt
  let mintRx = await mintTxSubmit.getReceipt(client);

  //Log the serial number
  console.log(
    `- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`
  );

  //Execute a contract function (associate)
  const contractExecTx1 = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      "NFTAssociate",
      new ContractFunctionParameters().addAddress(aliceId.toSolidityAddress())
    )
    .freezeWith(client);
  const contractExecSign1 = await contractExecTx1.sign(aliceKey);
  const contractExecSubmit1 = await contractExecSign1.execute(client);
  const contractExecRx1 = await contractExecSubmit1.getReceipt(client);
  console.log(
    `- Token association with Alice's account: ${contractExecRx1.status.toString()} \n`
  );
  ///////////////////////////////////////////////////////////////

  //Create the associate transaction and sign with Alice's key
  // let associateAliceTx = await new TokenAssociateTransaction()
  //   .setAccountId(aliceId)
  //   .setTokenIds([tokenId])
  //   .freezeWith(client)
  //   .sign(aliceKey);

  // //Submit the transaction to a Hedera network
  // let associateAliceTxSubmit = await associateAliceTx.execute(client);

  // //Get the transaction receipt
  // let associateAliceRx = await associateAliceTxSubmit.getReceipt(client);

  // //Confirm the transaction was successful
  // console.log(
  //   `- NFT association with Alice's account: ${associateAliceRx.status}\n`
  // );

  // Check the balance before the transfer for the treasury account
  // var balanceCheckTx = await new AccountBalanceQuery()
  //   .setAccountId(treasuryId)
  //   .execute(client);
  // console.log(
  //   `- Treasury balance: ${balanceCheckTx.tokens._map.get(
  //     tokenId.toString()
  //   )} NFTs of ID ${tokenId}`
  // );

  // // Check the balance before the transfer for Alice's account
  // var balanceCheckTx = await new AccountBalanceQuery()
  //   .setAccountId(aliceId)
  //   .execute(client);
  // console.log(
  //   `- Alice's balance: ${balanceCheckTx.tokens._map.get(
  //     tokenId.toString()
  //   )} NFTs of ID ${tokenId}`
  // );
  ///////////////////////////////////////////////////////////////////

  //Execute a contract function (transfer)
  const contractExecTx2 = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      "transferZarelNFT",
      new ContractFunctionParameters()
        .addAddress(treasuryId.toSolidityAddress())
        .addAddress(aliceId.toSolidityAddress())
        .addInt64(1)
    )
    .freezeWith(client);
  const contractExecSign2 = await contractExecTx2.sign(treasuryKey);
  const contractExecSubmit2 = await contractExecSign2.execute(client);
  const contractExecRx2 = await contractExecSubmit2.getReceipt(client);

  console.log(
    `- NFT transfer from Treasury to Alice: ${contractExecRx2.status.toString()}`
  );

  const tB = await bCheckerFcn(treasuryId);
  const aB = await bCheckerFcn(aliceId);
  console.log(`- Treasury balance: ${tB} units of token ${tokenId}`);
  console.log(`- Alice balance: ${aB} units of token ${tokenId} \n`);

  // // Transfer the NFT from treasury to Alice
  // // Sign with the treasury key to authorize the transfer
  // let tokenTransferTx = await new TransferTransaction()
  //   .addNftTransfer(tokenId, 1, treasuryId, aliceId)
  //   .freezeWith(client)
  //   .sign(treasuryKey);

  // let tokenTransferSubmit = await tokenTransferTx.execute(client);
  // let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

  // console.log(
  //   `\n- NFT transfer from Treasury to Alice: ${tokenTransferRx.status} \n`
  // );

  // // Check the balance of the treasury account after the transfer
  // var balanceCheckTx = await new AccountBalanceQuery()
  //   .setAccountId(treasuryId)
  //   .execute(client);
  // console.log(
  //   `- Treasury balance: ${balanceCheckTx.tokens._map.get(
  //     tokenId.toString()
  //   )} NFTs of ID ${tokenId}`
  // );

  // // Check the balance of Alice's account after the transfer
  // var balanceCheckTx = await new AccountBalanceQuery()
  //   .setAccountId(aliceId)
  //   .execute(client);
  // console.log(
  //   `- Alice's balance: ${balanceCheckTx.tokens._map.get(
  //     tokenId.toString()
  //   )} NFTs of ID ${tokenId}`
  // );

  // ========================================
  // FUNCTIONS
  async function tQueryFcn(tId) {
    let info = await new TokenInfoQuery().setTokenId(tId).execute(client);
    return info;
  }

  async function bCheckerFcn(aId) {
    let balanceCheckTx = await new AccountBalanceQuery()
      .setAccountId(aId)
      .execute(client);
    return balanceCheckTx.tokens._map.get(tokenId.toString());
  }
}
main();
