import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";

function HashConnectHelper() {
  let hashconnect = new HashConnect(true);
  let availableExtensions = (HashConnectTypes.WalletMetadata = []);
  let status = "initializing";
  return <div>HashConnectHelper</div>;
}

export default HashConnectHelper;
