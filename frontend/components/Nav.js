import React, { useState } from "react";
import styles from "../styles/nav.module.scss";
import Link from "next/link";
function Nav() {
  const [active, setActive] = useState("");
  return (
    <div>
      <div className={styles.card}>
        <Link href="/dashboard">
          <button className={`${styles.item} ${styles.item__active}`}>
            Dashboard
          </button>
        </Link>
        <Link href="/Stake">
          <button className={styles.item}>Stake</button>
        </Link>
        <Link href="/Borrow">
          <button className={styles.item}>Borrow</button>
        </Link>
      </div>
    </div>
  );
}

export default Nav;
