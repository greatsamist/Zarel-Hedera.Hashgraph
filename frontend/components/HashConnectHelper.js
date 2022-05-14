import { HashConnect } from "hashconnect";

async function walletConnectFcn() {
  console.log("- Connecting wallet");

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

  //first init and store the private for later
  const initData = await hashconnect.init(appMetadata);
  saveData.privateKey = initData.privKey;
  console.log(`\n- Private key for pairing: ${saveData.privateKey}`);

  //then connect, storing the new topic for later
  const state = await hashconnect.connect();
  saveData.topic = state.topic;
  console.log(`\n- Pairing topic is: ${saveData.topic}`);

  //generate a pairing string, which you can display and generate a QR code from
  saveData.pairingString = hashconnect.generatePairingString(
    state,
    "testnet",
    false
  );

  //find any supported local wallets
  hashconnect.findLocalWallets();
  hashconnect.connectToLocalWallet(saveData.pairingString);

  return [hashconnect, saveData];
}

export default walletConnectFcn;
