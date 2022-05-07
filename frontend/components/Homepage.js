import React from "react";
import styles from "../styles/Homepage.module.scss";
import Image from "next/image";

export default function Homepage() {
  return (
    <div className={styles.homepage}>
      <div className={styles.heroSection}>
        <div className={styles.heroText}>
          <p>
            Increase your earnings by staking tokens and receive annual
            percentage yield (APY) in return 💰
          </p>
          <button className={styles.heroBtn}>Connect wallet</button>
        </div>
        <div className={styles.heroImg}>
          <img src="/iPhone13Mockup.svg" width={300} height={350} />
        </div>
      </div>
      {/* /////////////////////////////////////////////////////// */}
      <div className={styles.sectionHeadings}>
        <h3 className={styles.heading3}>How it works</h3>
      </div>
      <div className={styles.description}>
        <div className={styles.details}>
          <h4 className={styles.heading4}>Eligibility</h4>
          <p className={styles.paragraph}>
            Only eligible addresses are allowed to stake tokens and earn in
            returns. Only addresses that holds the outlined NFT are allowed.
          </p>
        </div>
        <div className={styles.details}>
          <h4 className={styles.heading4}>Multi-choice</h4>
          <p className={styles.paragraph}>
            On passing eligibility, addresses can then choose their preferred
            APY with respect to their conditions for staking
          </p>
        </div>
        <div className={styles.details}>
          <h4 className={styles.heading4}>Eligibility</h4>
          <p className={styles.paragraph}>
            Only eligible addresses are allowed to stake tokens and earn in
            returns. Only addresses that holds the outlined NFT are allowed.
          </p>
        </div>
        <div className={styles.details}>
          <h4 className={styles.heading4}>Eligibility</h4>
          <p className={styles.paragraph}>
            Only eligible addresses are allowed to stake tokens and earn in
            returns. Only addresses that holds the outlined NFT are allowed.
          </p>
        </div>
      </div>
      <div className={styles.sectionHeadings}>
        <h3 className={styles.heading3}>About</h3>
        <p className={styles.paragraph}>
          Fleet is a staking based DE-FI which allows end-users have access to
          A-class Bonuses enabling them to make more money, our users have
          access to the best APY. Fleet is a staking based DE-FI which allows
          end-users have access to A-class Bonuses enabling them to make more
          money, our users have access to the best APY.
        </p>
      </div>
    </div>
  );
}
