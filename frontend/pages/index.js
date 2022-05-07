import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Homepage from "../components/Homepage";

import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Zarel Finance</title>
        <meta
          name="description"
          content="Zarel Finance: A Staking and Lending protocol"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className={styles.main}>
        <Homepage />
      </main>
      <Footer />
    </div>
  );
}
