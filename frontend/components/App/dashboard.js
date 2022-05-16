import React from "react";
import Image from "next/image";
import incoming from "../../public/incoming.svg";
import outgoing from "../../public/outgoing.svg";

import styles from "../../styles/dashboard.module.scss";

const Dashboard = () => {
  return (
    <div className={styles.root}>
      <div className={styles.table_container}>
        <table className={styles.table}>
          <thead className={styles.head}>
            <tr>
              <td>Your Stake</td>
              <td>Share</td>
              <td>Yield</td>
              <td>Start Date</td>
              <td>Date Due</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2000 zkt</td>
              <td>10%</td>
              <td>200</td>
              <td>16/05/22</td>
              <td>16/06/22</td>
              <td className={styles.claim}>claim</td>
              <td className={styles.restake}>Restake</td>
            </tr>

            <tr>
              <td>100 zkt</td>
              <td>10%</td>
              <td>.....</td>
              <td>15/05/22</td>
              <td>30/05/22</td>
              <td className={styles.claim}>claim</td>
            </tr>
            {/* <tr>
              <td>12000zkt</td>
              <td>0.05%</td>
              <td>.....</td>
              <td>12/01/21</td>
              <td>12/04/22</td>
              <td className={styles.claim}>claim</td>
            </tr> */}
          </tbody>
        </table>
      </div>
      <div>
        <table className={styles.History_Table}>
          <caption className={styles.caption}>History</caption>
          <thead className={styles.history_head}>
            <tr>
              <td>Amount</td>
              <td>Date</td>
              <td>Address</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                5000 zkt
                <Image src={incoming} alt="incoming" width={15} height={10} />
              </td>
              <td>12/05/22</td>
              <td className={styles.addr}>0.0.326789</td>
            </tr>

            <tr>
              <td>
                12000 kt{" "}
                <Image alt="outgoing" src={outgoing} width={15} height={10} />
              </td>
              <td>1/05/22</td>
              <td className={styles.addr}>0.0.226332</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
