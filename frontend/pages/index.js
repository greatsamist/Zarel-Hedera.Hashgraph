require("dotenv").config();
import Head from "next/head";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Homepage from "../components/Homepage";

import { HashConnect } from "hashconnect";

const {
  TransferTransaction,
  AccountId,
  ContractExecuteTransaction,
} = require("@hashgraph/sdk");

export default function Home() {
  // track whether a user is connected or not
  const [connected, setConnected] = useState(false);

  let hashconnect = new HashConnect();

  let saveData = {
    topic: "",
    pairingString: "",
    privateKey: "",
    pairedWalletData: null,
    pairedAccounts: [],
  };

  let appMetadata = {
    name: "Zarel Finance",
    description: "Zarel Staking and Borrowing dApp",
    icon: "",
  };

  const ConnectWallet = async () => {
    //create the hashconnect instance
    // hashconnect = new HashConnect();

    // if (!loadLocalData()) {
    //first init and store the private for later
    let initData = await hashconnect.init(appMetadata);
    saveData.privateKey = initData.privKey;

    //then connect, storing the new topic for later
    let state = await hashconnect.connect();
    saveData.topic = state.topic;
    console.log("Topic is" + saveData.topic);
    //generate a pairing string, which you can display and generate a QR code from
    saveData.pairingString = hashconnect.generatePairingString(
      state,
      "testnet",
      false
    );

    //find any supported local wallets
    const result = hashconnect.findLocalWallets();
    console.log(result + "result");

    hashconnect.connectToLocalWallet(saveData.pairingString);

    hashconnect.pairingEvent.once((pairingData) => {
      pairingData.accountIds.forEach((id) => {
        saveData.pairedAccounts.push(id);
        setConnected(true);
        console.log(saveData.pairedAccounts[0]);
      });
      // saveDataInLocalstorage();
    });

    // } else {
    // //   //use loaded data for initialization + connection
    // await hashconnect.init(appMetadata, saveData.privateKey);
    // await hashconnect.connect(saveData.topic, saveData.pairedWalletData);

    // }

    // const requestAccountInfo = async () => {
    //   let request = {
    //     topic: saveData.topic,
    //     network: "testnet",
    //     multiAccount: true,
    //   };

    //   await hashconnect.requestAdditionalAccounts(
    //     saveData.topic,
    //     request
    //   );
    // };

    // function saveDataInLocalstorage() {
    //   let data = JSON.stringify(saveData);

    //   localStorage.setItem("hashconnectData", data);
    // }

    // function loadLocalData() {
    //   let foundData = localStorage.getItem("hashconnectData");

    //   if (foundData) {
    //     saveData = JSON.parse(foundData);
    //     setConnected(true);
    //     console.log(saveData.pairedAccounts);
    //     return true;
    //   } else {
    //     setConnected(false);
    //     return false;
    //   }
  };

  const associateToken = async () => {
    const provider = hashconnect.getProvider(
      "testnet",
      saveData.topic,
      saveData.pairedAccounts[0]
    );
    const signer = hashconnect.getSigner(provider);
    const TokenAddress = AccountId.fromString(process.env.TOKENADDR);
    const tokenAddr = TokenAddress.toSolidityAddress();

    const contractId = AccountId.fromString(process.env.CONTRACT_ID);

    const contractExecTx = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        "tokenAssociate",
        new ContractFunctionParameters().addAddress(tokenAddr)
      )
      .freezeWithSigner(signer);

    const res = await contractExecTx.executeWithSigner(signer);

    console.log(`- Token association with Contract's account: ${res} \n`);
  };

  const AccountBalanceTest = async () => {
    let res = await provider.getAccountBalance(saveData.pairedAccounts[0]);

    console.log("got account balance", res);
  };
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

      <Header connectWallet={ConnectWallet} connected={connected} />
      <button onClick={associateToken}>Associate</button>
      <Homepage />
      <Footer />
    </div>
  );
}
