import React from "react";
import styles from "../styles/Header.module.scss";
import Link from "next/link";

export default function Header({ connected, connectWallet }) {
  return (
    <div className={styles.header}>
      <Link href="./">
        <div className={styles.header__logoText}>Zarel</div>
      </Link>
      <div className={styles.header__connect}>
        {connected ? (
          <button className={styles.header__connectBtn}>App</button>
        ) : (
          <button
            onClick={() => connectWallet()}
            className={styles.header__connectBtn}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
