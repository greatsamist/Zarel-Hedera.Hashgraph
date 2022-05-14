import Head from "next/head";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Homepage from "../components/Homepage";
import walletConnectFcn from "../components/HashConnectHelper";

import {
  TransferTransaction,
  ContractFunctionParameters,
  AccountId,
  ContractExecuteTransaction,
} from "@hashgraph/sdk";

require("dotenv").config();

function Home() {
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
  return (
    <div>
      <Head>
        <title>Zarel Finance</title>
        <meta
          name="description"
          content="Zarel Finance: A Staking and Lending protocol"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header
        connectWallet={connectWallet}
        connected={connected}
        accountId={accountId}
      />
      {/* <button onClick={AccountBalanceTest}>Associate</button> */}
      <Homepage connectWallet={connectWallet} connected={connected} />
      <Footer />
    </div>
  );
}
export default Home;
