// assets/js/components/Dashboard.jsx
import { useState, useEffect } from "react";
import TabNavigation from "./navigation/TabNavigation";
import TabContent from "./navigation/TabContent";
import styles from "@css/components/Dashboard.module.scss";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Get WordPress data passed from PHP
  const wpData = window.seoPluginData || {};
  const tabs = wpData.tabs || {};
  const strings = wpData.strings || {};
  const tabKeys = Object.keys(tabs);

  useEffect(() => {
    // Set first available tab as active on load
    if (tabKeys.length > 0 && !activeTab) {
      setActiveTab(tabKeys[0]);
    }
    setIsLoading(false);
  }, [tabKeys, activeTab]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <p>{strings.loading || "Loading..."}</p>
        </div>
      </div>
    );
  }

  // Show message if no tabs available
  if (tabKeys.length === 0) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.noTabs}>
          <h2>No tabs available</h2>
          <p>Tab data not received from WordPress.</p>
          <details style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
            <summary>Debug Info</summary>
            <pre>{JSON.stringify(wpData, null, 2)}</pre>
          </details>
        </div>
      </div>
    );
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className={styles.dashboard}>
      {/* Horizontal tab navigation at the top */}
      <div className={styles.navigationWrapper}>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main content area below tabs */}
      <main className={styles.mainContent}>
        <TabContent activeTab={activeTab} tabConfig={tabs[activeTab]} />
      </main>
    </div>
  );
};

export default Dashboard;
