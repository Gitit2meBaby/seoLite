// assets/js/components/navigation/TabNavigation.jsx
import { useState } from "react";
import styles from "@css/components/navigation/TabNavigation.module.scss";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const [hoveredTab, setHoveredTab] = useState(null);

  console.log("TabNavigation rendered with tabs:", Object.keys(tabs));

  return (
    <nav className={styles.tabNavigation}>
      <h3 className={styles.title}>SEO Settings</h3>

      <ul className={styles.tabList}>
        {Object.entries(tabs).map(([tabId, tab]) => (
          <li key={tabId} className={styles.tabItem}>
            <button
              className={`${styles.tabButton} ${
                activeTab === tabId ? styles.active : ""
              } ${hoveredTab === tabId ? styles.hovered : ""}`}
              onClick={() => onTabChange(tabId)}
              onMouseEnter={() => setHoveredTab(tabId)}
              onMouseLeave={() => setHoveredTab(null)}
              title={tab.description}
            >
              <span className={styles.label}>{tab.label}</span>
              {/* Active indicator dot */}
              {activeTab === tabId && (
                <span className={styles.activeIndicator}></span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Tooltip that shows on hover */}
      {hoveredTab && tabs[hoveredTab] && (
        <div className={styles.tabTooltip}>
          <strong>{tabs[hoveredTab].label}</strong>
          <p>{tabs[hoveredTab].description}</p>
        </div>
      )}
    </nav>
  );
};

export default TabNavigation;
