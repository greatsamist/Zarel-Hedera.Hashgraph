import React from "react";
import styles from "../styles/Footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.main}>
        <div>
          <ul className={styles.list}>
            <li>
              <h3>About</h3>
            </li>
            <li>
              <a href={"url"}>medium</a>
            </li>
            <li>
              <a href={"url"}>Discord</a>
            </li>
            <li>
              <a href={"url"}>Twitter</a>
            </li>
            <li>
              <a href={"url"}>reddit</a>
            </li>
            <li>
              <a href={"url"}>blog</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className={styles.list}>
            <li>
              <h3>Developers</h3>
            </li>
            <li>
              <a href={"url"}>Github</a>
            </li>
            <li>
              <a href={"url"}>Docs</a>
            </li>
            <li>
              <a href={"url"}>Dev Channel</a>
            </li>
            <li>
              <a href={"url"}>Bug Bounty</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className={styles.list}>
            <li>
              <h3>Products</h3>
            </li>
            <li>
              <a href={"url"}>Governance</a>
            </li>
            <li>
              <a href={"url"}>Trading</a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <ul className={styles.l_list}>
          <li>
            <h3>Zarel</h3>
          </li>
          <li>Copyrite</li>
          <li>2022</li>
        </ul>
      </div>
    </div>
  );
}
