import React from "react";
import Header from "../components/Header";
import Nav from "../components/Nav";
import styles from "../styles/dashboard.module.scss";

const Dashboard = () => {
  return (
    <div>
      <Header />
      <div className={styles.root}>
        <Nav />

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
                <td>12000cft</td>
                <td>0.05%</td>
                <td>200kron</td>
                <td>12/01/21</td>
                <td>12/04/22</td>
                <td className={styles.claim}>claim</td>
                <td className={styles.restake}>Restake</td>
              </tr>

              <tr>
                <td>12000cft</td>
                <td>0.05%</td>
                <td>.....</td>
                <td>12/01/21</td>
                <td>12/04/22</td>
                <td className={styles.claim}>claim</td>
              </tr>
              <tr>
                <td>12000cft</td>
                <td>0.05%</td>
                <td>.....</td>
                <td>12/01/21</td>
                <td>12/04/22</td>
                <td className={styles.claim}>claim</td>
              </tr>
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
                  12000cft
                  <img src="/incoming.svg" width={15} height={10} />
                </td>
                <td>12/04/22</td>
                <td className={styles.addr}>0x1626***aA9B5D***f2e</td>
              </tr>

              <tr>
                <td>
                  12000cft <img src="/outgoing.svg" width={15} height={10} />
                </td>
                <td>12/04/22</td>
                <td className={styles.addr}>0x1626***aA9B5D***f2e</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
