import React from "react";
import styles from "../../styles/borrow.module.scss";

function Borrow({ onClickBorrow }) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <form onSubmit={onClickBorrow}>
          <select className={styles.list} name="collateral">
            <option value="" className={styles.li}>
              Choose NFT
            </option>
            <option value="0xZaer" id="ZKT" className={styles.li}>
              ZRT NFT
            </option>
            <option value="0xbt" id="BRT" className={styles.li}>
              ASAPT NFT
            </option>
          </select>
          <div className={styles.amount}>
            <input
              className={styles.placeholder}
              type="number"
              min="0"
              name="id"
              id="id"
              placeholder="NFT id(serial number)"
            />
          </div>

          <p className={styles.label}>Choose loan period</p>
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
                value="1209600"
              />
              <label className={styles["period__label"]} htmlFor="period_02">
                <p>14 days</p>
              </label>
            </div>
            <div className={styles["period__row"]}>
              <input
                className={`${styles["period__input"]} ${styles["period__period_03"]}`}
                type="radio"
                id="period_03"
                name="period"
                value="2629743"
              />
              <label className={styles["period__label"]} htmlFor="period_03">
                <p>30 days</p>
              </label>
            </div>
          </div>
          <div>
            <button className={styles.calculate}>calculate loan amount</button>
          </div>
          <p className={styles.warning}>
            *Note: Your NFT will be locked till your loan is paid back in full.
          </p>
          <div className={styles.applyBTN}>
            <button type="submit" className={styles.apply}>
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Borrow;
