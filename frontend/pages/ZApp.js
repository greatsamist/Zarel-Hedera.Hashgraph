require("dotenv").config();
import React, { Fragment, useState } from "react";
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

const stakeContractId = "0.0.34826090";
const borrowContractId = "0.0.34825985";
const NFTAddress = AccountId.fromString("0.0.34362684");
const NFTAddr = NFTAddress.toSolidityAddress();

function ZApp() {
  const [curNav, setCurNav] = useState("dashboard");
  const [walletData, setWalletData] = useState();
  const [accountId, setAccountId] = useState();
  const [accountBal, setAccountBal] = useState("");
  const [connected, setConnected] = useState(false);
  const [floorPrice, setFloorPrice] = useState();

  async function connectWallet() {
    if (accountId !== undefined) {
      console.log(`🔌Account ${accountId} already connected⚡✅`);
      setConnected(true);
      await AccountBalance();
    } else {
      const wData = await walletConnectFcn();
      if (wData !== undefined) {
        console.log(wData);
        setWalletData(wData);
        wData[0].pairingEvent.once((pairingData) => {
          pairingData.accountIds.forEach((id) => {
            console.log(`\n- Paired account id: ${id}`);
            console.log(`🔌Account ${id} connected⚡✅`);
            setAccountId(id);
          });
        });
        setConnected(true);
      }
      AccountBalance();
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

  ///=================================///
  //Contract call query getFloorPrice
  const onClickFloorPrice = async (e) => {
    e.preventDefault();

    const data = {
      addr: e.target.floorPrice.value,
    };

    const tokenAddr = AccountId.fromString(data.addr);
    const tokenAddrSol = tokenAddr.toSolidityAddress();
    console.log(tokenAddrSol);
    const operatorID = AccountId.fromString(operator.id);
    const operatorPrivKey = PrivateKey.fromString(operator.pvkey);
    const client = Client.forTestnet().setOperator(operatorID, operatorPrivKey);

    const query = new ContractCallQuery()
      .setContractId(borrowContractId)
      .setGas(3000000)
      .setFunction(
        "TokenFloorPrice",
        new ContractFunctionParameters().addAddress(NFTAddr)
      );

    //Sign with the client operator private key to pay for the query and submit the query to a Hedera network
    const contractCallResult = await query.execute(client);

    // Get the function value
    const message = contractCallResult.getInt64();
    setFloorPrice(message);
    console.log(`Token Floor price set at: ${message} \n`);
  };

  ///===============================================///
  // Execute a contract function Borrow
  const onClickBorrow = async (e) => {
    e.preventDefault();

    const data = {
      collateral: e.target.collateral.value,
      id: e.target.id.value,
      period: e.target.period.value,
    };

    const nft = AccountId.fromString("0.0.34362684");
    const nftSol = nft.toSolidityAddress();

    const accId = AccountId.fromString(accountId);
    const accIdSol = accId.toSolidityAddress();

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
        new ContractFunctionParameters()
          .addAddress(accIdSol)
          .addAddress(nftSol)
          .addInt64(Number(data.id))
          .addUint40(Number(data.period))
      )
      .freezeWithSigner(signer);
    const contractBorrowSubmit = await contractBorrowTx.executeWithSigner(
      signer
    );
    const contractBorrowRx = await contractBorrowSubmit.getReceipt(signer);
    console.log(`- Borrow: ${contractBorrowRx.status.toString()}`);
  };

  // Execute a contract function (payBack)
  const onClickPayBack = async (e) => {
    e.preventDefault();

    const data = {
      token: e.target.token.value,
      amount: e.target.amount.value,
    };

    const accId = AccountId.fromString(accountId);
    const accIdSol = accId.toSolidityAddress();

    let provider = walletData[0].getProvider(
      "testnet",
      walletData[1].topic,
      accountId
    );
    console.log(walletData[1].privateKey);
    let signer = walletData[0].getSigner(provider);

    const contractStakeTx = new ContractExecuteTransaction()
      .setContractId(stakeContractId)
      .setGas(3000000)
      .setFunction(
        "payBack",
        new ContractFunctionParameters()
          .addAddress(accIdSol)
          .addUint64(Number(data.amount))
      )
      .freezeWithSigner(signer);
    const contractStakeSubmit = await contractStakeTx.executeWithSigner(signer);
    const contractBorrowRx = await contractStakeSubmit.getReceipt(signer);
    console.log(`- payBack: ${contractBorrowRx.status.toString()}`);
  };

  // Calling the stake function
  const onClickStake = async (e) => {
    e.preventDefault();

    const data = {
      token: e.target.token.value,
      amount: e.target.amount.value,
      period: e.target.period.value,
    };

    const accId = AccountId.fromString(accountId);
    const accIdSol = accId.toSolidityAddress();

    let provider = walletData[0].getProvider(
      "testnet",
      walletData[1].topic,
      accountId
    );
    console.log(walletData[1].privateKey);
    let signer = walletData[0].getSigner(provider);

    const contractStakeTx = await new ContractExecuteTransaction()
      .setContractId(stakeContractId)
      .setGas(3000000)
      .setFunction(
        "stake",
        new ContractFunctionParameters()
          .addAddress(accIdSol)
          .addUint64(Number(data.amount))
          .addUint40(Number(data.period))
      )
      .freezeWithSigner(signer);
    const contractStakeSubmit = await contractStakeTx.executeWithSigner(signer);
    const contractStakeRx = await contractStakeSubmit.getReceipt(signer);
    console.log(`- Stake: ${contractStakeRx.status.toString()}`);
  };

  ///// Calling the withdraw stake function
  const onClickWithdraw = async (e) => {
    e.preventDefault();

    const accId = AccountId.fromString(accountId);
    const accIdSol = accId.toSolidityAddress();

    let provider = walletData[0].getProvider(
      "testnet",
      walletData[1].topic,
      accountId
    );
    console.log(walletData[1].privateKey);
    let signer = walletData[0].getSigner(provider);

    const contractStakeTx = new ContractExecuteTransaction()
      .setContractId(stakeContractId)
      .setGas(3000000)
      .setFunction(
        "withdraw",
        new ContractFunctionParameters().addAddress(accIdSol)
      )
      .freezeWithSigner(signer);
    const contractStakeSubmit = await contractStakeTx.executeWithSigner(signer);
    const contractBorrowRx = await contractStakeSubmit.getReceipt(signer);
    console.log(`- withdraw: ${contractBorrowRx.status.toString()}`);
  };

  return (
    <Fragment>
      <AppHeader
        connectWallet={connectWallet}
        connected={connected}
        accountId={accountId}
        accountBal={accountBal}
      />
      <button onClick={AccountBalance}></button>
      {/* <button onClick={getFloorPrice}>FLoor</button>
      <button onClick={associateToken}>associateToken</button>
      <button onClick={onClickBorrow}>Borrow</button> */}
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

      {curNav === "dashboard" ? (
        <Dashboard
          floorPrice={floorPrice}
          onClickPayBack={onClickPayBack}
          onClickFloorPrice={onClickFloorPrice}
          onClickWithdraw={onClickWithdraw}
        />
      ) : (
        ""
      )}
      {curNav === "stake" ? (
        <Stake AccountBalance={AccountBalance} onClickStake={onClickStake} />
      ) : (
        ""
      )}
      {curNav === "borrow" ? <Borrow onClickBorrow={onClickBorrow} /> : ""}
    </Fragment>
  );
}
export default ZApp;
