// assets/js/components/tabs/TrackingTags.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import styles from "@css/components/tabs/SocialMedia.module.scss";
import { trackingFields } from "./trackingFields";

const TrackingTags = ({ tabId, config }) => {
  const {
    settings,
    updateSetting,
    loadPageSettings,
    savePageSettings,
    loadPages,
    isSaving,
  } = useSettings();

  const [selectedPage, setSelectedPage] = useState("global");
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // State for collapsible sections - first section open by default
  const [expandedSections, setExpandedSections] = useState({
    "Google Services": true, // Open by default
    "Social Media Platforms": false,
    "Analytics & Heatmaps": false,
    "Search Console Verification": false,
    "Custom Tracking Codes": false,
  });

  useEffect(() => {
    loadPagesFromWordPress();
    loadPageSettings(selectedPage);
  }, []);

  useEffect(() => {
    if (selectedPage) {
      loadPageSettings(selectedPage);
    }
  }, [selectedPage]);

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const loadPagesFromWordPress = async () => {
    try {
      setIsLoadingPages(true);
      setApiError(null);

      const fetchedPages = await loadPages();

      if (fetchedPages && fetchedPages.length > 0) {
        setPages(fetchedPages);
      } else {
        setApiError(
          "No pages found. The WordPress API might not be working properly."
        );
        setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
      }
    } catch (error) {
      setApiError(`API Error: ${error.message}`);
      setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const getFieldValue = (fieldKey) => {
    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    if (selectedPage === "global") {
      return globalSettings[fieldKey] || "";
    } else {
      if (
        pageSettings[fieldKey] !== undefined &&
        pageSettings[fieldKey] !== ""
      ) {
        return pageSettings[fieldKey];
      } else {
        return globalSettings[fieldKey] || "";
      }
    }
  };

  const getFieldStatus = (fieldKey) => {
    if (selectedPage === "global") return "global";

    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    const pageValue = pageSettings[fieldKey];
    const globalValue = globalSettings[fieldKey];

    if (pageValue !== undefined && pageValue !== "") {
      if (pageValue === globalValue) {
        return "inherited";
      } else {
        return "unique";
      }
    } else {
      return "using_global";
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    const pageKey = `page_${selectedPage}`;
    updateSetting(pageKey, fieldKey, value);
    setHasChanges(true);
  };

  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
    setHasChanges(false);
  };

  const handleSave = async () => {
    try {
      await savePageSettings(selectedPage);
      setHasChanges(false);
      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setApiError(`Save failed: ${error.message}`);
    }
  };

  const TooltipHelper = ({ tooltipText }) => (
    <span className={styles.mediaHelper}>
      <span className={styles.tooltipTrigger} data-tooltip={tooltipText}>
        ℹ️
      </span>
    </span>
  );

  const renderField = (field) => {
    const currentValue = getFieldValue(field.key);
    const fieldStatus = getFieldStatus(field.key);
    const isInherited = fieldStatus === "inherited";
    const isUsingGlobal = fieldStatus === "using_global";
    const isUnique = fieldStatus === "unique";

    const currentPage = pages.find((p) => p.id === selectedPage);
    const pageSlug = currentPage?.title || selectedPage;

    return (
      <div key={field.key} className={styles.field}>
        <label className={styles.label}>
          {field.label}
          {field.hasTooltip && (
            <TooltipHelper tooltipText={field.tooltipText} />
          )}
          {isInherited && (
            <span className={styles.inheritedBadge}>Inherited from Global</span>
          )}
          {isUsingGlobal && (
            <span className={styles.usingGlobalBadge}>Using Global Value</span>
          )}
          {isUnique && (
            <span className={styles.uniqueBadge}>Unique to {pageSlug}</span>
          )}
          {field.description && (
            <span className={styles.description}>{field.description}</span>
          )}
        </label>

        {field.type === "textarea" ? (
          <textarea
            className={`${styles.textarea} ${
              isUsingGlobal ? styles.usingGlobal : ""
            } ${isInherited ? styles.inherited : ""}`}
            value={currentValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
          />
        ) : (
          <input
            type={field.type}
            className={`${styles.input} ${
              isUsingGlobal ? styles.usingGlobal : ""
            } ${isInherited ? styles.inherited : ""}`}
            value={currentValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            pattern={field.pattern}
          />
        )}
      </div>
    );
  };

  const renderSection = (section) => {
    const sectionName = section.section;
    const isExpanded = expandedSections[sectionName];
    const sectionFields = section.fields || [];

    return (
      <div key={sectionName} className={styles.section}>
        <button
          className={`${styles.sectionHeader} ${
            isExpanded ? styles.expanded : ""
          }`}
          onClick={() => toggleSection(sectionName)}
          type="button"
        >
          <div className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>{isExpanded ? "▼" : "▶"}</span>
            <h3>{sectionName}</h3>
          </div>
          <div className={styles.sectionCount}>
            {sectionFields.length} setting
            {sectionFields.length !== 1 ? "s" : ""}
          </div>
        </button>

        {isExpanded && (
          <div className={styles.sectionContent}>
            <div className={styles.fieldsContainer}>
              {sectionFields.map(renderField)}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading tracking settings..." />;
  }

  return (
    <div className={styles.socialMedia}>
      {/* Success Alert */}
      {showSaveAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>✅</span>
            <span className={styles.alertText}>
              Tracking settings saved successfully!
            </span>
            <button
              className={styles.alertClose}
              onClick={() => setShowSaveAlert(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Page Selector */}
      <div className={styles.pageSelector}>
        <label className={styles.selectorLabel}>
          Configure tracking codes for:
        </label>
        <select
          className={styles.pageSelect}
          value={selectedPage}
          onChange={(e) => handlePageChange(e.target.value)}
        >
          <option value="global">🌐 Global Defaults (All Pages)</option>
          {pages
            .filter((page) => page.id !== "global")
            .map((page) => (
              <option key={page.id} value={page.id}>
                📄 {page.title}
                {page.url ? ` (${page.url})` : ""}
              </option>
            ))}
        </select>

        {selectedPage !== "global" && (
          <div className={styles.inheritanceInfo}>
            <small>
              💡 This page inherits tracking codes from Global. Override any
              field to customize it specifically for this page.
            </small>
          </div>
        )}
      </div>

      {/* Error Display */}
      {apiError && (
        <div className={styles.errorAlert}>
          <p>⚠️ {apiError}</p>
        </div>
      )}

      {/* Collapsible Sections */}
      <div className={styles.sectionsContainer}>
        {trackingFields.map(renderSection)}
      </div>

      {/* Save Button */}
      <div className={styles.saveSection}>
        <button
          className={`${styles.saveButton} ${
            hasChanges ? styles.hasChanges : ""
          }`}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
        </button>
      </div>

      {/* Important Notes Section - Moved to Bottom */}
      <div className={styles.importantNotes}>
        <div className={styles.notesSection}>
          <h4>⚠️ Important Notes:</h4>
          <ul>
            <li>
              Most tracking codes work best when placed globally rather than on
              individual pages
            </li>
            <li>
              Test your tracking codes in a staging environment before going
              live
            </li>
            <li>
              Some analytics tools may conflict with each other - monitor your
              data quality
            </li>
            <li>
              Consider using Google Tag Manager to manage multiple tracking
              codes from one place
            </li>
            <li>
              Custom scripts should be tested thoroughly as they can affect site
              performance
            </li>
          </ul>
        </div>

        <div className={styles.testingSection}>
          <h4>🔍 Testing Your Tracking Codes:</h4>
          <ul>
            <li>
              <strong>Google Analytics:</strong>{" "}
              <a
                href="https://tagassistant.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Tag Assistant
              </a>
            </li>
            <li>
              <strong>Facebook Pixel:</strong>{" "}
              <a
                href="https://www.facebook.com/business/help/742478679120153"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook Pixel Helper
              </a>
            </li>
            <li>
              <strong>Multiple Tags:</strong>{" "}
              <a
                href="https://tagmanager.google.com/web/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Tag Manager Preview Mode
              </a>
            </li>
            <li>
              <strong>General Debugging:</strong> Use browser developer tools
              (F12) → Network tab to verify scripts are loading
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrackingTags;
