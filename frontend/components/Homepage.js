import React from "react";
import styles from "../styles/Homepage.module.scss";
import Image from "next/image";
import iPhone13Mockup from "../public/iPhone13Mockup.svg";
import Link from "next/link";

export default function Homepage() {
  return (
    <div className={styles.homepage}>
      <div className={styles.heroSection}>
        <div className={styles.heroText}>
          <p>
            Increase your earnings by staking tokens and receive annual
            percentage yield (APY) in return 💰
          </p>

          <Link href="/ZApp">
            <button className={styles.heroBtn}>Explore</button>
          </Link>
        </div>
        <div className={styles.heroImg}>
          <Image
            src={iPhone13Mockup}
            alt="heroImage"
            priority={true}
            width={445}
            height={650}
          />
        </div>
      </div>
      {/* /////////////////////////////////////////////////////// */}
      <div className={styles.homeInfo}>
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
        </div>
        <div className={styles.description}>
          <div className={styles.details}>
            <h4 className={styles.heading4}>Withdrawal</h4>
            <p className={styles.paragraph}>
              Users can withdraw their collateral at any point in time,
              according to the terms and conditions at the time of withdrawal
            </p>
          </div>
          <div className={styles.details}>
            <h4 className={styles.heading4}>Re-invest</h4>
            <p className={styles.paragraph}>
              users can re-invest as much time as possible, multiple staking is
              allowed
            </p>
          </div>
        </div>
        <div className={styles.sectionHeadings}>
          <h3 className={styles.heading3}>About</h3>
          <p className={styles.paragraph}>
            Zarel.finance is a staking and borrowing based DE-FI protocol which
            allows end-users have access to A-class Bonuses enabling them to
            make more money, our users have access to the best APY.
          </p>
        </div>
      </div>
    </div>
  );
}
