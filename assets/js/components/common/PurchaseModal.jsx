import React from "react";

import styles from "@css/components/common/PurchaseModal.module.scss";

const PurchaseModal = ({ setShowPurchaseModal, handleGetStarted }) => {
  return (
    <section className={styles.PurchaseModal}>
      <h1>Ready For Lifetime Access??</h1>
      <p>
        SeoLite is available to all users worldwide for a one time purchase of{" "}
        <strong>$10 USD</strong>
      </p>
      <p>
        Upon payment you will recieve a code in your chosen email inbox, please
        enter the code within 24hrs and enjoy lifetime access to seoLite V1!
      </p>
      <em>More information available in next steps...</em>
      <a href="https://www.seoliteplugin.com" target="_blank">
        Purchase Now
      </a>
      <button onClick={() => handleGetStarted()}>Get Started</button>
      <button onClick={() => setShowPurchaseModal(false)}>Close</button>
    </section>
  );
};

export default PurchaseModal;
