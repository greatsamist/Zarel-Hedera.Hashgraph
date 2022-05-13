import Head from "next/head";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Homepage from "../components/Homepage";
import walletConnectFcn from "../components/HashConnectHelper";

import { HashConnect } from "hashconnect";

import {
  TransferTransaction,
  ContractFunctionParameters,
  AccountId,
  ContractExecuteTransaction,
} from "@hashgraph/sdk";

require("dotenv").config();

// let accountId = "";

// const ConnectWallet = async () => {
//create the hashconnect instance
// hashconnect = new HashConnect();
// if (!loadLocalData()) {
//   //first init and store the private for later
//   let initData = await hashconnect.init(appMetadata);
//   saveData.privateKey = initData.privKey;
//   //then connect, storing the new topic for later
//   let state = await hashconnect.connect();
//   saveData.topic = state.topic;
//   console.log("Topic is" + saveData.topic);
//   //generate a pairing string, which you can display and generate a QR code from
//   saveData.pairingString = hashconnect.generatePairingString(
//     state,
//     "testnet",
//     false
//   );
//find any supported local wallets
// hashconnect.findLocalWallets();
// hashconnect.connectToLocalWallet(saveData.pairingString);
// hashconnect.pairingEvent.on((pairingData) => {
//   pairingData.accountIds.forEach((id) => {
//     saveData.pairedAccounts.push(id);
//     accountId = id;
//     // setConnected(true);
//     console.log(saveData.pairedAccounts[0]);
//   });
//   // saveDataInLocalstorage();
// });
// } else {
//   //   //use loaded data for initialization + connection
//   await hashconnect.init(appMetadata, saveData.privateKey);
//   await hashconnect.connect(saveData.topic, saveData.pairedWalletData);
// }
// const requestAccountInfo = async () => {
//   let request = {
//     topic: saveData.topic,
//     network: "testnet",
//     multiAccount: true,
//   };
//   await hashconnect.requestAdditionalAccounts(saveData.topic, request);
// };
// function saveDataInLocalstorage() {
//   let data = JSON.stringify(saveData);
//   localStorage.setItem("hashconnectData", data);
// }
// function loadLocalData() {
//   let foundData = localStorage.getItem("hashconnectData");
//   if (foundData) {
//     saveData = JSON.parse(foundData);
//     console.log(saveData);
//     // setConnected(true);
//     console.log(saveData.pairedAccounts);
//     return true;
//   } else {
//     // setConnected(false);
//     return false;
//   }
// }
// };
// const AccountBalanceTest = async () => {
//   let res = await provider.getNetwork(saveData.pairedAccounts[0]);

//   console.log("got account balance", res);
// };

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
          setConnected(true);
          console.log(`\n- Paired account id: ${id}`);
          console.log(`🔌Account ${id} connected⚡✅`);
        });
      });
      setWalletData(wData);
    }
  }

  async function associateToken() {
    let provider = wData[0].getProvider("testnet", saveData.topic, accountId);
    console.log(saveData);
    let signer = wData[0].getSigner(provider);
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
    // const resRx = await res.getRecord(signer);

    console.log(`- Token association with Contract's account: ${res} \n`);
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
      {/* <button onClick={associateToken}>Associate</button> */}
      <Homepage connectWallet={connectWallet} connected={connected} />
      <Footer />
    </div>
  );
}
export default Home;
