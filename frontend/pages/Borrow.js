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
          <div className={styles.contain}>
            <select className={styles.list}>
              <option className={styles.li}>Choose a Token</option>
              <option className={styles.li}>Token</option>
              <option className={styles.li}>Token</option>
            </select>
            <button className={styles.calculate}>calculate</button>
          </div>
          <input
            className={styles.amount}
            type={Number}
            placeholder={"Amount of Token"}
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
