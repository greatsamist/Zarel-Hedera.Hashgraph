import styles from "../styles/Header.module.scss";

import React from "react";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.header__logoText}>Zarel</div>
    </div>
  );
}
