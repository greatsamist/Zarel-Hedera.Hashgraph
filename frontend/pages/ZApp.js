import React, { useState } from "react";
import AppHeader from "../components/App/AppHeader";
import Borrow from "../components/App/Borrow";
import Dashboard from "../components/App/dashboard";
import Stake from "../components/App/Stake";
import walletConnectFcn from "../components/HashConnectHelper";
import operator from "../components/App/operator";
import {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
} from "@hashgraph/sdk";
import { hethers } from "@hashgraph/hethers";
import styles from "../styles/nav.module.scss";

require("dotenv").config();

const stakeContractId = "";
const borrowContractId = "0.0.34738208";

function ZApp() {
  const [curNav, setCurNav] = useState("dashboard");
  const [walletData, setWalletData] = useState();
  const [accountId, setAccountId] = useState();
  const [accountBal, setAccountBal] = useState("");
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    if (accountId !== undefined) {
      console.log(`🔌Account ${accountId} already connected⚡✅`);
      setConnected(true);
      await AccountBalance();
    } else {
      const wData = await walletConnectFcn();
      console.log(wData);
      setWalletData(wData);
      wData[0].pairingEvent.once((pairingData) => {
        pairingData.accountIds.forEach((id) => {
          setAccountId(id);
          console.log(`\n- Paired account id: ${id}`);
          console.log(`🔌Account ${id} connected⚡✅`);
        });
      });
      setConnected(true);
      await AccountBalance();
      console.log(walletData);
    }
  }

  async function AccountBalance() {
    if (accountId !== undefined) {
      let provider = await walletData[0].getProvider(
        "testnet",
        walletData[1].topic,
        accountId
      );
      const balance = await provider.getAccountBalance(accountId);
      const bal = balance.hbars._valueInTinybar.c[0].toString();
      const balFx = Number(hethers.utils.formatUnits(bal, 8)).toFixed(3);
      setAccountBal(balFx);
      console.log("got account balance", balFx);
    }
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
      .setContractId(borrowContractId)
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
    const operatorID = AccountId.fromString(operator.id);
    const operatorPrivKey = PrivateKey.fromString(operator.pvkey);
    const client = Client.forTestnet().setOperator(operatorID, operatorPrivKey);

    const query = new ContractCallQuery()
      .setContractId(borrowContractId)
      .setGas(3000000)
      .setFunction("floorPrice");

    //Sign with the client operator private key to pay for the query and submit the query to a Hedera network
    const contractCallResult = await query.execute(client);

    // Get the function value
    const message = contractCallResult.getInt64();
    console.log(`contract Floor price set at: ${message} \n`);
  }

  // Execute a contract function Borrow
  const onClickBorrow = async (e) => {
    e.preventDefault();

    // const data = {
    //   collateral: e.target.collateral.value,
    //   id: e.target.id.value,
    //   period: e.target.period.value,
    // };
    // console.log(data);
    let AccId = AccountId.fromString(accountId);
    let AccIDSol = AccId.toSolidityAddress();
    let provider = walletData[0].getProvider(
      "testnet",
      walletData[1].topic,
      accountId
    );
    console.log(walletData[1].privateKey);
    let signer = walletData[0].getSigner(provider);

    const contractBorrowTx = await new ContractExecuteTransaction()
      .setContractId(borrowContractId)
      .setGas(3000000)
      .setFunction(
        "Borrow",
        new ContractFunctionParameters().addAddress(AccIDSol).addInt64(1)
      )
      .freezeWithSigner(signer);
    const contractBorrowSubmit = await contractBorrowTx.executeWithSigner(
      signer
    );
    const contractBorrowRx = await contractBorrowSubmit.getReceipt(signer);
    console.log(`- Borrow: ${contractBorrowRx.status.toString()}`);
  };

  // Execute a contract function (payBack)
  const payBack = async () => {
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
  };

  // Calling the stake function
  const onClickStake = async (e) => {
    e.preventDefault();

    const data = {
      token: e.target.token.value,
      amount: e.target.amount.value,
      period: e.target.period.value,
    };
    console.log(data);
  };

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
        accountBal={accountBal}
      />
      <button onClick={AccountBalance}>Bal</button>
      <button onClick={getFloorPrice}>FLoor</button>
      <button onClick={associateToken}>associateToken</button>
      <button onClick={onClickBorrow}>Borrow</button>
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
      {curNav === "stake" ? <Stake onClickStake={onClickStake} /> : ""}
      {curNav === "borrow" ? <Borrow onClickBorrow={onClickBorrow} /> : ""}
    </div>
  );
}
export default ZApp;
