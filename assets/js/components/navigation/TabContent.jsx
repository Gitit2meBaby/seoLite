import { Suspense, lazy } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import styles from "@css/components/navigation/TabContent.module.scss";

// Lazy load tab components for better performance
const tabComponents = {
  GeneralMeta: lazy(() => import("../tabs/GeneralMeta")),
  SocialMedia: lazy(() => import("../tabs/SocialMedia")),
  SchemaMarkup: lazy(() => import("../tabs/SchemaMarkup")),
  Analytics: lazy(() => import("../tabs/Analytics")),
  TechnicalSEO: lazy(() => import("../tabs/TechnicalSEO")),
};

const TabContent = ({ activeTab, tabConfig }) => {
  if (!activeTab || !tabConfig) {
    return (
      <div className={styles.noContent}>
        <h2>Welcome to SEO Plugin</h2>
        <p>Select a tab from the sidebar to configure your SEO settings.</p>
      </div>
    );
  }

  const TabComponent = tabComponents[tabConfig.component];

  if (!TabComponent) {
    return (
      <div className={styles.error}>
        <h2>Component Not Found</h2>
        <p>The component "{tabConfig.component}" could not be loaded.</p>
        <p>Available components: {Object.keys(tabComponents).join(", ")}</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <header className={styles.tabHeader}>
        <h2>
          <span className={`${styles.icon} ${tabConfig.icon}`}></span>
          {tabConfig.label}
        </h2>
        <p className={styles.description}>{tabConfig.description}</p>
      </header>

      <div className={styles.tabBody}>
        <Suspense fallback={<LoadingSpinner />}>
          <TabComponent tabId={activeTab} config={tabConfig} />
        </Suspense>
      </div>
    </div>
  );
};

export default TabContent;
