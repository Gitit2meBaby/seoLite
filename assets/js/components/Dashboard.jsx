import { useState, useEffect } from "react";
import { useSettings } from "../providers/SettingsProvider";
import TabNavigation from "./navigation/TabNavigation";
import TabContent from "./navigation/TabContent";
import MetaPreview from "./common/MetaPreview";
import LoadingSpinner from "./common/LoadingSpinner";
import styles from "@css/components/Dashboard.module.scss";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { settings, isLoadingSettings } = useSettings();

  // Get tabs from WordPress localized data
  const tabs = window.seoPluginData?.tabs || {};
  const tabKeys = Object.keys(tabs);

  useEffect(() => {
    // Set first available tab as active on load
    if (tabKeys.length > 0 && !activeTab) {
      setActiveTab(tabKeys[0]);
    }
    setIsLoading(false);
  }, [tabKeys, activeTab]);

  if (isLoading || isLoadingSettings) {
    return <LoadingSpinner message={window.seoPluginData?.strings?.loading} />;
  }

  if (tabKeys.length === 0) {
    return (
      <div className={styles.noTabs}>
        <p>{window.seoPluginData?.strings?.selectTab}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <MetaPreview activeTab={activeTab} settings={settings} />
      </div>

      <main className={styles.mainContent}>
        <TabContent activeTab={activeTab} tabConfig={tabs[activeTab]} />
      </main>
    </div>
  );
};

export default Dashboard;
