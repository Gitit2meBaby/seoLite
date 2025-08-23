// assets/js/components/tabs/SocialMedia.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import { socialFields } from "./socialFields";
import styles from "@css/components/tabs/SocialMedia.module.scss";

const SocialMedia = ({ tabId, config }) => {
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
    "Social Media Profiles": true, // Open by default
    "Default Social Images": false,
    "Open Graph Settings": false,
    "Twitter Card Settings": false,
    "Facebook Settings": false,
  });

  // Load pages on component mount
  useEffect(() => {
    loadPagesFromWordPress();
    loadPageSettings(selectedPage);
  }, []);

  // Load page settings when selection changes
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

  const MediaHelper = ({ tooltipText }) => (
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

    if (field.global && selectedPage !== "global") {
      return null;
    }

    const currentPage = pages.find((p) => p.id === selectedPage);
    const pageSlug = currentPage?.title || selectedPage;

    return (
      <div key={field.key} className={styles.field}>
        <label className={styles.label}>
          {field.label}
          {field.hasMediaHelper && (
            <MediaHelper tooltipText={field.tooltipText} />
          )}
          {field.global && (
            <span className={styles.globalBadge}>Global Only</span>
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
          <div className={styles.textareaWrapper}>
            <textarea
              className={`${styles.textarea} ${
                isUsingGlobal ? styles.usingGlobal : ""
              } ${isInherited ? styles.inherited : ""}`}
              value={currentValue}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              rows={3}
            />
            {field.maxLength && (
              <div className={styles.charCount}>
                {currentValue.length}/{field.maxLength}
              </div>
            )}
          </div>
        ) : field.type === "select" ? (
          <select
            className={`${styles.select} ${
              isUsingGlobal ? styles.usingGlobal : ""
            } ${isInherited ? styles.inherited : ""}`}
            value={currentValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <div className={styles.inputWrapper}>
            <input
              type={field.type}
              className={`${styles.input} ${
                isUsingGlobal ? styles.usingGlobal : ""
              } ${isInherited ? styles.inherited : ""}`}
              value={currentValue}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
            />
            {field.maxLength && (
              <div className={styles.charCount}>
                {currentValue.length}/{field.maxLength}
              </div>
            )}
          </div>
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
    return <LoadingSpinner message="Loading social media settings..." />;
  }

  return (
    <div className={styles.socialMedia}>
      {/* Success Alert */}
      {showSaveAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>✅</span>
            <span className={styles.alertText}>
              Settings saved successfully!
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
          Configure social media settings for:
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
              💡 This page inherits social media settings from Global. Override
              any field to customize it specifically for this page.
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
        {socialFields.map(renderSection)}
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
    </div>
  );
};

export default SocialMedia;
