import React from "react";
import styles from "../styles/nav.module.scss";

function AppNav() {
  return (
    <div className={styles.card}>
      <button
        className={
          curNav === "dashboard" ? `${styles.item__active}` : `${styles.item}`
        }
      >
        DashBoard
      </button>
      <button
        className={
          curNav === "stake" ? `${styles.item__active}` : `${styles.item}`
        }
      >
        Stake
      </button>
      <button
        className={
          curNav === "borrow" ? `${styles.item__active}` : `${styles.item}`
        }
      >
        Borrow
      </button>
    </div>
  );
}

export default AppNav;
