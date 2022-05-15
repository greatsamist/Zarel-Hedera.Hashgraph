import React from "react";
import styles from "../../styles/stake.module.scss";

function Stake({ onClickStake }) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <form onSubmit={onClickStake}>
          <select className={styles.list} name="token">
            <option className={styles.li}>Select Token to stake</option>
            <option value="0xzk" id="ZKT" className={styles.li}>
              Zarel Tokens
            </option>
            <option value="0xbt" id="BRT" className={styles.li}>
              Bored Tokens
            </option>
          </select>
          <div className={styles.amount}>
            <input
              className={styles.placeholder}
              type="number"
              placeholder="Amount"
              min="100"
              max="20000"
              name="amount"
              id="amount"
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
                value="604800"
              />
              <label className={styles["period__label"]} htmlFor="period_01">
                <p>7 days</p>
              </label>
            </div>
            <div className={styles["period__row"]}>
              <input
                className={styles["period__input"]}
                type="radio"
                id="period_02"
                name="period"
                value="2629743"
              />
              <label className={styles["period__label"]} htmlFor="period_02">
                <p>30 days</p>
              </label>
            </div>
            <div className={styles["period__row"]}>
              <input
                className={`${styles["period__input"]} ${styles["period__period_03"]}`}
                type="radio"
                id="period_03"
                name="period"
                value="86400"
              />
              <label className={styles["period__label"]} htmlFor="period_03">
                <p>90 days</p>
              </label>
            </div>
          </div>
          <div className={styles.stakeBTN}>
            <button type="submit" className={styles.stake}>
              stake
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Stake;
