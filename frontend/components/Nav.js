import React from "react";
import styles from "../styles/nav.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
function Nav() {
  const router = useRouter();
  const activeLink = (
    path,
    content,
    activeClass = `${styles.item__active} ${styles.item}`,
    normalClass = styles.item
  ) => {
    let className = router.pathname === path ? activeClass : normalClass;
    return (
      <Link href={path}>
        <button className={className}>{content}</button>
      </Link>
    );
  };

  return (
    <div className={styles.card}>
      {activeLink("/dashboard", "Dashboard")}
      {activeLink("/Stake", "stake")}
      {activeLink("/Borrow", "Borrow")}
    </div>
  );
}

export default Nav;
