import Head from "next/head";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Homepage from "../components/Homepage";

const { hethers } = require("@hashgraph/hethers");

export default function Home() {
  const [isConnect, setIsConnect] = useState("");
  // available providers ['mainnet', 'testnet', 'previewnet']
  const Provider = hethers.providers.getDefaultProvider("testnet");

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

      <Header />
      <Homepage />
      <Footer />
    </div>
  );
}
