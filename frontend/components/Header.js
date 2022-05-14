import React from "react";
import styles from "../styles/Header.module.scss";
import Link from "next/link";

export default function Header() {
  return (
    <div className={styles.header}>
      <Link href="./">
        <div className={styles.header__logoText}>Zarel</div>
      </Link>
      <div className={styles.header__connect}>
        <Link href="./App">
          <button className={styles.header__connectBtn}>App</button>
        </Link>
      </div>
    </div>
  );
}
