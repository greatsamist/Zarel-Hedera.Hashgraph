import React from "react";
import Header from "../components/Header";
import Nav from "../components/Nav";
import styles from "../styles/borrow.module.scss";

function Borrow() {
  return (
    <div>
      <Header />
      <div className={styles.root}>
        <Nav />
        <div className={styles.container}>
          <div>
            <label className={styles.label}>Choose a Token or NFT</label>
          </div>
          <select className={styles.list}>
            <option className={styles.li}>ZRT</option>
            <option className={styles.li}>ASAPT</option>
          </select>
          <div className={styles.contain}>
            <label className={styles.label}>NFT id/serial number</label>
            <input className={styles.amount} type="number" placeholder="" />
          </div>
          <button className={styles.calculate}>calculate</button>
          <label className={styles.label}>Choose borrowing period</label>
          <div>
            <button className={styles.days}>7 days</button>
            <button className={styles.days}>30 days</button>
            <button className={styles.days}>90 days</button>
            <p className={styles.warning}>
              *Note: Your NFT will be locked till your loan is paid back in
              full.
            </p>
          </div>
          <input
            className={styles.amount}
            type="number"
            placeholder="Amount of Token"
          />

          <div className={styles.applyBTN}>
            <button className={styles.apply}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Borrow;
