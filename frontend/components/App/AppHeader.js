import React from "react";
import styles from "../../styles/Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/zarelicon.png";

export default function AppHeader({
  connected,
  connectWallet,
  accountId,
  accountBal,
}) {
  return (
    <div className={styles.header}>
      <div className={styles.header__title}>
        <Image src={logo} alt="Zarel logo" height={20} width={40} />
        <Link href="./">
          <p className={styles.header__logoText}>Zarel</p>
        </Link>
      </div>
      <div className={styles.header__connect}>
        {connected ? (
          <div className={styles.header__connected}>
            <p className={styles.header__accB}>
              <span className={styles.header__accTitle}>HBAR: </span>
              {accountBal}
            </p>
            <p className={styles.header__acc}>
              <span className={styles.header__accTitle}>ID: </span>
              {accountId}
            </p>
          </div>
        ) : (
          <button onClick={connectWallet} className={styles.header__connectBtn}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
