import React, { useState } from "react";
import AppHeader from "../components/App/AppHeader";
import Borrow from "../components/App/Borrow";
import Dashboard from "../components/App/dashboard";
import Stake from "../components/App/Stake";

import walletConnectFcn from "../components/HashConnectHelper";

import {
  TransferTransaction,
  ContractFunctionParameters,
  AccountId,
  ContractExecuteTransaction,
  AccountBalanceQuery,
} from "@hashgraph/sdk";

require("dotenv").config();

import styles from "../styles/nav.module.scss";

function App() {
	const [curNav, setCurNav] = useState("dashboard");
  const [walletData, setWalletData] = useState();
  const [accountId, setAccountId] = useState();
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    if (accountId !== undefined) {
      console.log(`🔌Account ${accountId} already connected⚡✅`);
      setConnected(true);
    } else {
      const wData = await walletConnectFcn();
      wData[0].pairingEvent.once((pairingData) => {
        pairingData.accountIds.forEach((id) => {
          setAccountId(id);
          console.log(`\n- Paired account id: ${id}`);
          console.log(`🔌Account ${id} connected⚡✅`);
        });
      });
      setConnected(true);
      console.log(wData);
      setWalletData(wData);
    }
  }

  async function AccountBalanceTest() {
    console.log(walletData[1]);
    let provider = walletData[0].getProvider(
      "testnet",
      walletData[1].topic,
      accountId
    );
    let res = await provider.getAccountBalance(accountId);

    console.log("got account balance", res);
  }

  async function associateToken() {
    let provider = walletData[0].getProvider(
      "testnet",
      walletData[1].topic,
      accountId
    );
    console.log(walletData[1]);
    let signer = walletData[0].getSigner(provider);
    // const TokenAddress = Number("0.0.34386412");
    // const TokenAddress = AccountId.fromString(process.env.TOKENADDR);
    const TokenAddress = AccountId.fromString("0.0.34356109");
    const tokenAddr = TokenAddress.toSolidityAddress();
    const contractId = AccountId.fromString("0.0.34738208");

    const contractExecTx = await new ContractExecuteTransaction()
      .setContractId("0.0.34738208")
      .setGas(3000000)
      .setFunction(
        "tokenAssociate",
        new ContractFunctionParameters().addAddress(tokenAddr)
      )
      .freezeWithSigner(signer);

    const res = await contractExecTx.executeWithSigner(signer);
    const resRx = await res.getReceipt(signer);

    console.log(`- Token association with Contract's account: ${resRx} \n`);
  }

  //Contract call query
  async function getFloorPrice() {
    let provider = walletData[0].getProvider(
      "testnet",
      walletData[1].topic,
      accountId
    );
    console.log(walletData[1]);
    let signer = walletData[0].getSigner(provider);

    const query = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction("floorPrice");

    //Sign with the client operator private key to pay for the query and submit the query to a Hedera network
    const contractCallResult = await query.execute(provider);

    // Get the function value
    const message = contractCallResult.getInt64();
    console.log(`contract Floor price set at: ${message} \n`);
  }

  // Execute a contract function (Borrow)
  async function borrow() {
    const contractBorrowTx = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        "Borrow",
        new ContractFunctionParameters()
          .addAddress(aliceId.toSolidityAddress())
          .addInt64(1)
      )
      .freezeWith(clientAlice);
    const contractExecSign3 = await contractBorrowTx.sign(aliceKey);
    const contractBorrowSubmit = await contractExecSign3.execute(client);
    const contractBorrowRx = await contractBorrowSubmit.getReceipt(client);
    console.log(`- Borrow: ${contractBorrowRx.status.toString()}`);
  }

  // Execute a contract function (payBack)
  async function payBack() {
    const contractPayBackTx = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        "payBack",
        new ContractFunctionParameters()
          .addAddress(aliceId.toSolidityAddress())
          .addInt64(100)
      )
      .freezeWith(client)
      .sign(aliceKey);
    const contractExecSign5 = await contractPayBackTx.sign(aliceKey);
    const contractPayBackSubmit = await contractExecSign5.execute(client);
    const contractPayBackRx = await contractPayBackSubmit.getReceipt(client);
    console.log(`- PayBack: ${contractPayBackRx.status.toString()}`);
  }

  // async function TCheckerFcn(aId) {
  //   let balanceCheckTx = await new AccountBalanceQuery()
  //     .setAccountId(aId)
  //     .execute(client);
  //   return balanceCheckTx.tokens._map.get(TokenAddress.toString());
  
  return (
    <div>
      <AppHeader
        connectWallet={connectWallet}
        connected={connected}
        accountId={accountId}
      />
      <div className={styles.card}>
        <button
          className={
            curNav === "dashboard"
              ? `${styles.item__active} ${styles.item}`
              : `${styles.item}`
          }
          onClick={() => {
            setCurNav("dashboard");
          }}
        >
          DashBoard
        </button>
        <button
          className={
            curNav === "stake"
              ? `${styles.item__active} ${styles.item}`
              : `${styles.item}`
          }
          onClick={() => {
            setCurNav("stake");
          }}
        >
          Stake
        </button>
        <button
          className={
            curNav === "borrow"
              ? `${styles.item__active} ${styles.item}`
              : `${styles.item}`
          }
          onClick={() => {
            setCurNav("borrow");
          }}
        >
          Borrow
        </button>
      </div>

      {curNav === "dashboard" ? <Dashboard /> : ""}
      {curNav === "stake" ? <Stake /> : ""}
      {curNav === "borrow" ? <Borrow /> : ""}
    </div>
  );
}

export default App;
