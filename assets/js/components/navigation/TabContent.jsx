// assets/js/components/navigation/TabContent.jsx
import GeneralMeta from "../tabs/GeneralMeta";
import SchemaMarkup from "../tabs/SchemaMarkup";
import SocialMedia from "../tabs/SocialMedia";
import TrackingTags from "../tabs/TrackingTags";
import styles from "@css/components/navigation/TabContent.module.scss";

const TabContent = ({ activeTab, tabConfig }) => {
  if (!activeTab || !tabConfig) {
    return (
      <div className={styles.noContent}>
        <h2>Welcome to SEO Plugin</h2>
        <p>Select a tab to configure your SEO settings.</p>
      </div>
    );
  }

  // Import and render actual React components
  const getTabComponent = (componentName) => {
    switch (componentName) {
      case "GeneralMeta":
        return <GeneralMeta tabId={activeTab} config={tabConfig} />;

      case "SocialMedia":
        return <SocialMedia tabId={activeTab} config={tabConfig} />;

      case "SchemaMarkup":
        return <SchemaMarkup tabId={activeTab} config={tabConfig} />;

      case "Analytics":
      case "TrackingTags":
        return <TrackingTags tabId={activeTab} config={tabConfig} />;

      case "TechnicalSEO":
        return (
          <div>
            <h3>Technical SEO Settings</h3>
            <p>This will contain:</p>
            <ul>
              <li>Canonical URLs</li>
              <li>Robots.txt settings</li>
              <li>XML sitemaps</li>
            </ul>
            <p>
              <em>Component will be implemented in the next phase.</em>
            </p>
          </div>
        );

      default:
        return (
          <div>
            <h3>Component Not Found</h3>
            <p>Component "{componentName}" not implemented yet.</p>
            <p>
              Available components: GeneralMeta, SocialMedia, SchemaMarkup,
              TrackingTags, TechnicalSEO
            </p>
          </div>
        );
    }
  };

  return (
    <div className={styles.tabContent}>
      <header className={styles.tabHeader}>
        <h2>{tabConfig.label}</h2>
        <p className={styles.description}>{tabConfig.description}</p>
      </header>

      <div className={styles.tabBody}>
        {getTabComponent(tabConfig.component)}
      </div>
    </div>
  );
};

export default TabContent;
