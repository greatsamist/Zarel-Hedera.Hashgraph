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
          <form>
            <select className={styles.list}>
              <option value="" className={styles.li}>
                Choose collateral
              </option>
              <option className={styles.li}>ZRT NFT</option>
              <option className={styles.li}>ASAPT NFT</option>
            </select>
            <div className={styles.amount}>
              <input
                className={styles.placeholder}
                type="number"
                min="0"
                max="10000"
                placeholder="NFT id/serial number"
              />
            </div>

            <p className={styles.label}>Choose staking period</p>
            <div className={styles.period}>
              <div className={styles["period__row"]}>
                <input
                  className={styles["period__input"]}
                  type="radio"
                  id="period_01"
                  name="period"
                  value="7"
                />
                <label className={styles["period__label"]} for="period_01">
                  <p>7 days</p>
                </label>
              </div>
              <div className={styles["period__row"]}>
                <input
                  className={styles["period__input"]}
                  type="radio"
                  id="period_02"
                  name="period"
                  value="30"
                />
                <label className={styles["period__label"]} for="period_02">
                  <p>30 days</p>
                </label>
              </div>
              <div className={styles["period__row"]}>
                <input
                  className={`${styles["period__input"]} ${styles["period__period_03"]}`}
                  type="radio"
                  id="period_03"
                  name="period"
                  value="90"
                />
                <label className={styles["period__label"]} for="period_03">
                  <p>90 days</p>
                </label>
              </div>
            </div>
            <div>
              <button className={styles.calculate}>
                calculate loan amount
              </button>
            </div>
            <p className={styles.warning}>
              *Note: Your NFT will be locked till your loan is paid back in
              full.
            </p>
            <div className={styles.applyBTN}>
              <button className={styles.apply}>Apply</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Borrow;
