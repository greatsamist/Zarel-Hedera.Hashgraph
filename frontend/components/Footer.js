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
              <a href="https://twitter.com/greatsamuelojo" target="_blank">
                Twitter
              </a>
            </li>
            <li>
              <a href="#">Medium</a>
            </li>
            <li>
              <a href="greatsamist#6269">Discord</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className={styles.list}>
            <li>
              <h3>Developers</h3>
            </li>
            <li>
              <a
                href={"https://github.com/greatsamist/Zarel-Hedera.Hashgraph"}
                target="_blank"
              >
                Github
              </a>
            </li>
            <li>
              <a href={"#"}>Docs</a>
            </li>
            <li>
              <a href={"#"}>Dev Channel</a>
            </li>
          </ul>
        </div>
        <div>
          <ul className={styles.list}>
            <li>
              <h3>Products</h3>
            </li>
            <li>
              <a href={"#"}>Governance</a>
            </li>
            <li>
              <a href={"#"}>Trading</a>
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
