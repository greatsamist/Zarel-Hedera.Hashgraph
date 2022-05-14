import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Homepage from "../components/Homepage";

function Home() {
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
export default Home;
