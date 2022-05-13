import React from "react";
import Header from "../components/Header";
import Nav from "../components/Nav";
import styles from "../styles/stake.module.scss";

function Stake() {
  return (
    <div>
      <Header />
      <div className={styles.root}>
        <Nav />
        <div className={styles.container}>
          <select className={styles.list}>
            <option disabled selected className={styles.li}>
              Select Token to stake
            </option>
            <option className={styles.li}>Token</option>
            <option className={styles.li}>Token</option>
            <option className={styles.li}>Token</option>
          </select>
          <div className={styles.amount}>
            <input
              className={styles.placeholder}
              type={Number}
              placeholder={"Amount"}
            />
            <button className={styles.max}>max</button>
          </div>
          <label className={styles.label}>Choose staking period</label>
          <div>
            <button className={styles.days}>7 days</button>
            <button className={styles.days}>30 days</button>
            <button className={styles.days}>90 days</button>
          </div>
          <div className={styles.stakeBTN}>
            <button className={styles.stake}>stake</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stake;
