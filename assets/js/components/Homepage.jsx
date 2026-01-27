import React, { useState } from "react";
import styles from "../../css/components/Homepage.module.scss";

import PurchaseModal from "./common/PurchaseModal";

const Homepage = ({ onGetStarted }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const data = window.seoPluginData || {};
  const pluginUrl = data.pluginUrl || "";

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleImportMeta = () => {
    console.log("Import Meta Data clicked - to be implemented");
  };

  return (
    <section className={styles.homeContainer}>
      <div className={styles.homeHero}>
        <div className={styles.imgContainer}>
          <img
            src={`${pluginUrl}dist/images/logo.webp`}
            alt="SEOLite logo"
            height={300}
            width={400}
            className={styles.logo}
          />
        </div>

        <p>
          Complete SEO & custom fields toolkit without the subscription hassle,
          hefty useless bloat features and painful price-tag. Indie developed
          plugin for the people. Take full control over metadata, schemas and
          any script you can imagine. Super lightweight package with all the
          important features in a simple to use dashboard.
        </p>
      </div>

      <div className={styles.homeContent}>
        <h2>Learn More...</h2>
        <p>
          I built this plugin because I was sick of seeing people paying too
          much for slop they do not need. It was not long ago I started out in
          web development and I hope this tool helps people in the same position
          I was.
        </p>
        <p>
          Don't forget - <strong>THIS IS A DEMO VERSION!</strong> In order to
          pay the fees, maintain the codebase and continue upgrading I ask for a
          small one-off payment. You will be restricted to using the admin only
          on the free version.
        </p>
        <p>
          For more information, troubleshooting and the community forum please
          head to the{" "}
          <a href="https://www.seoliteplugin.com">SeoLite Official Website</a>
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.listItems}>
          <h2>Quick Tips...</h2>
          <ul>
            <li>
              <strong>Download Existing Metadata - </strong>
              If you have an SEO plugin installed already, try the 'Import Meta
              Data' button to pre-populate fields.
            </li>
            <li>
              <strong>Hover over the ? buttons - </strong>
              If your unsure about an input these might help as a quick
              reference
            </li>
            <li>
              <strong>Insert as much info as you can! - </strong>
              You should be able to fill multiple schemas for any website, these
              not only help Search Engines, but also GEO - Be seen by AI.
            </li>
            <li>
              <strong>Plan your keywords - </strong>
              Choose a strategy and run with it, don't stuff keywords in your
              content needlessly, but target one per page and monitor your
              results with FREE resources like{" "}
              <a href="https://search.google.com/search-console">
                Google Search Console
              </a>
              .
            </li>
            <li>
              <strong>Build sitemap, robots.txt & breadcrumbs - </strong>
              Don't forget to generate these! Just press the generate button on
              each tab to initialise defaults (this is 100% fine in 99% of use
              cases)
            </li>
            <li>
              <strong>Remove useless plugins! - </strong>
              You no longer need any other SEO plugins, no custom script
              inserters, forget about custom fields and improve your page speed
              by reducing plugins.
            </li>
          </ul>
        </div>

        {/* Action Buttons Section */}
        <div className={styles.btns}>
          <button
            className={`${styles.btn} ${styles.importBtn}`}
            onClick={() => handleImportMeta()}
            type="button"
          >
            Import Meta Data
            <span>→</span>
          </button>

          <button
            className={`${styles.btn} ${styles.purchaseBtn}`}
            onClick={() => setShowPurchaseModal(true)}
          >
            Purchase
            <span>→</span>
          </button>

          <button
            className={`${styles.btn} ${styles.startBtn}`}
            onClick={() => handleGetStarted()}
            type="button"
          >
            Get Started
            <span>→</span>
          </button>
        </div>
      </div>

      {showPurchaseModal && (
        <PurchaseModal
          handleGetStarted={handleGetStarted}
          setShowPurchaseModal={setShowPurchaseModal}
        />
      )}
    </section>
  );
};

export default Homepage;
