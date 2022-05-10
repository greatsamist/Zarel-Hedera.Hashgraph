import Head from "next/head";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Homepage from "../components/Homepage";

const { hethers } = require("@hashgraph/hethers");
// import { hethers } from '@hashgraph/hethers';
import { HashConnect } from "hashconnect";

export default function Home() {
  // track whether a user is connected or not
  const [connected, setConnected] = useState(false);

  // available providers ['mainnet', 'testnet', 'previewnet']
  // const Provider = hethers.providers.getDefaultProvider("testnet");

  let hashconnect;

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
    hashconnect = new HashConnect();

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
        console.log(saveData.pairedAccounts);
      });
    });
    // } else {
    //   //use loaded data for initialization + connection
    //   await hashconnect.init(appMetadata, saveData.privateKey);
    //   await hashconnect.connect(saveData.topic, saveData.pairedWalletData);
    // }
    setConnected(true);
  };

  // const loadLocalData = async () => {
  //   let foundData = localStorage.getItem("hashconnectData");

  //   if (foundData) {
  //     saveData = JSON.parse(foundData);
  //     return true;
  //   } else return false;
  // };

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
      <Homepage />
      <Footer />
    </div>
  );
}
