// assets/js/components/navigation/TabContent.jsx
import styles from "@css/components/navigation/TabContent.module.scss";

const TabContent = ({ activeTab, tabConfig }) => {
  console.log("TabContent rendered for tab:", activeTab, tabConfig);

  if (!activeTab || !tabConfig) {
    return (
      <div className={styles.noContent}>
        <h2>Welcome to SEO Plugin</h2>
        <p>Select a tab from the sidebar to configure your SEO settings.</p>
      </div>
    );
  }

  // For now, we'll show placeholder content for each tab
  // Later we'll replace this with actual React components
  const getTabContent = (componentName) => {
    switch (componentName) {
      case "GeneralMeta":
        return (
          <div>
            <p>This will contain:</p>
            <ul>
              <li>Page titles</li>
              <li>Meta descriptions</li>
              <li>Meta keywords</li>
              <li>Robots settings</li>
            </ul>
            <p>
              <em>Forms coming in next step...</em>
            </p>
          </div>
        );

      case "SocialMedia":
        return (
          <div>
            <p>This will contain:</p>
            <ul>
              <li>Open Graph tags</li>
              <li>Twitter Card settings</li>
              <li>Social media images</li>
            </ul>
            <p>
              <em>Forms coming in next step...</em>
            </p>
          </div>
        );

      case "SchemaMarkup":
        return (
          <div>
            <p>This will contain:</p>
            <ul>
              <li>Schema.org markup</li>
              <li>Business information</li>
              <li>Article markup</li>
            </ul>
            <p>
              <em>Forms coming in next step...</em>
            </p>
          </div>
        );

      case "Analytics":
        return (
          <div>
            <p>This will contain:</p>
            <ul>
              <li>Google Analytics tracking</li>
              <li>Google Tag Manager</li>
              <li>Custom tracking codes</li>
            </ul>
            <p>
              <em>Forms coming in next step...</em>
            </p>
          </div>
        );

      case "TechnicalSEO":
        return (
          <div>
            <p>This will contain:</p>
            <ul>
              <li>Canonical URLs</li>
              <li>Robots.txt settings</li>
              <li>XML sitemaps</li>
            </ul>
            <p>
              <em>Forms coming in next step...</em>
            </p>
          </div>
        );

      default:
        return (
          <div>
            <p>Component "{componentName}" not found.</p>
            <p>
              Available components: GeneralMeta, SocialMedia, SchemaMarkup,
              Analytics, TechnicalSEO
            </p>
          </div>
        );
    }
  };

  return (
    <div className={styles.tabContent}>
      <header className={styles.tabHeader}>
        <h2>
          <span className={`${styles.icon} ${tabConfig.icon}`}></span>
          {tabConfig.label}
        </h2>
        <p className={styles.description}>{tabConfig.description}</p>
      </header>

      <div className={styles.tabBody}>{getTabContent(tabConfig.component)}</div>
    </div>
  );
};

export default TabContent;
