// assets/js/components/tabs/SocialMedia.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import ReviewPublishButton from "../common/ReviewPublishButton";
import Tooltip from "../schemaTypes/Tooltip";
import { socialFields } from "./socialFields";
import styles from "@css/components/tabs/SocialMedia.module.scss";

const SocialMedia = ({ tabId, config, onNavigate }) => {
  const { settings, updateSetting, savePageSettings, loadPages, isSaving } =
    useSettings();

  const [selectedPage, setSelectedPage] = useState("global");
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // State for collapsible sections - first section open by default
  const [expandedSections, setExpandedSections] = useState({
    "Social Media Profiles": true, // Open by default
    "Default Social Images": false,
    "Open Graph Settings": false,
    "Twitter Card Settings": false,
    "Facebook Settings": false,
  });

  useEffect(() => {
    const loadPagesOnce = async () => {
      try {
        setIsLoadingPages(true);
        setApiError(null);

        const fetchedPages = await loadPages();

        if (fetchedPages && fetchedPages.length > 0) {
          setPages(fetchedPages);
        } else {
          setApiError(
            "No pages found. The WordPress API might not be working properly.",
          );
          setPages([
            { id: "global", title: "Global Defaults", type: "global" },
          ]);
        }
      } catch (error) {
        setApiError(`API Error: ${error.message}`);
        setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
      } finally {
        setIsLoadingPages(false);
      }
    };

    loadPagesOnce();
  }, []); // Only run once on mount

  // Reset hasChanges when page changes
  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
    setHasChanges(false);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
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
    const currentPageSettings = settings[pageKey] || {};

    const updatedPageSettings = {
      ...currentPageSettings,
      [fieldKey]: value,
    };

    updateSetting(pageKey, updatedPageSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const pageKey = `page_${selectedPage}`;
      const pageSettingsToSave = settings[pageKey] || {};

      const result = await savePageSettings(selectedPage, pageSettingsToSave);

      if (result.success) {
        setHasChanges(false);
        setShowSaveAlert(true);
        setTimeout(() => setShowSaveAlert(false), 3000);
      } else {
        throw new Error(result.message || "Save failed");
      }
    } catch (error) {
      console.error("❌ SocialMedia: Save failed:", error);
      setApiError(`Save failed: ${error.message}`);
    }
  };

  // Generate the actual meta tags that would appear in <head>
  const generateMetaTags = () => {
    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    // Get effective values (page-specific takes precedence over global)
    const effectiveValues = {};
    socialFields
      .flatMap((section) => section.fields)
      .forEach((field) => {
        const pageValue = pageSettings[field.key];
        const globalValue = globalSettings[field.key];

        // Use page value if it exists, otherwise fall back to global
        if (pageValue !== undefined && pageValue !== "") {
          effectiveValues[field.key] = pageValue;
        } else if (globalValue !== undefined && globalValue !== "") {
          effectiveValues[field.key] = globalValue;
        }
      });

    const metaTags = [];

    // Open Graph tags
    if (effectiveValues.og_title) {
      metaTags.push(
        `<meta property="og:title" content="${effectiveValues.og_title}" />`,
      );
    }
    if (effectiveValues.og_description) {
      metaTags.push(
        `<meta property="og:description" content="${effectiveValues.og_description}" />`,
      );
    }
    if (effectiveValues.og_type) {
      metaTags.push(
        `<meta property="og:type" content="${effectiveValues.og_type}" />`,
      );
    }
    if (effectiveValues.og_image) {
      metaTags.push(
        `<meta property="og:image" content="${effectiveValues.og_image}" />`,
      );
    }
    if (effectiveValues.og_image_alt) {
      metaTags.push(
        `<meta property="og:image:alt" content="${effectiveValues.og_image_alt}" />`,
      );
    }
    if (effectiveValues.og_site_name) {
      metaTags.push(
        `<meta property="og:site_name" content="${effectiveValues.og_site_name}" />`,
      );
    }
    if (effectiveValues.og_locale) {
      metaTags.push(
        `<meta property="og:locale" content="${effectiveValues.og_locale}" />`,
      );
    }

    // Twitter Card tags
    if (effectiveValues.twitter_card_type) {
      metaTags.push(
        `<meta name="twitter:card" content="${effectiveValues.twitter_card_type}" />`,
      );
    }
    if (effectiveValues.twitter_site) {
      metaTags.push(
        `<meta name="twitter:site" content="${effectiveValues.twitter_site}" />`,
      );
    }
    if (effectiveValues.twitter_creator) {
      metaTags.push(
        `<meta name="twitter:creator" content="${effectiveValues.twitter_creator}" />`,
      );
    }
    if (effectiveValues.twitter_title) {
      metaTags.push(
        `<meta name="twitter:title" content="${effectiveValues.twitter_title}" />`,
      );
    }
    if (effectiveValues.twitter_description) {
      metaTags.push(
        `<meta name="twitter:description" content="${effectiveValues.twitter_description}" />`,
      );
    }
    if (effectiveValues.twitter_image) {
      metaTags.push(
        `<meta name="twitter:image" content="${effectiveValues.twitter_image}" />`,
      );
    }

    // Facebook specific
    if (effectiveValues.fb_app_id) {
      metaTags.push(
        `<meta property="fb:app_id" content="${effectiveValues.fb_app_id}" />`,
      );
    }
    if (effectiveValues.fb_admins) {
      metaTags.push(
        `<meta property="fb:admins" content="${effectiveValues.fb_admins}" />`,
      );
    }

    // Social profile URLs (these go in Organization schema, but we'll show them as comments)
    if (effectiveValues.social_facebook_url) {
      metaTags.push(
        `<!-- Facebook Profile: ${effectiveValues.social_facebook_url} -->`,
      );
    }
    if (effectiveValues.social_twitter_url) {
      metaTags.push(
        `<!-- Twitter Profile: ${effectiveValues.social_twitter_url} -->`,
      );
    }
    if (effectiveValues.social_instagram_url) {
      metaTags.push(
        `<!-- Instagram Profile: ${effectiveValues.social_instagram_url} -->`,
      );
    }
    if (effectiveValues.social_linkedin_url) {
      metaTags.push(
        `<!-- LinkedIn Profile: ${effectiveValues.social_linkedin_url} -->`,
      );
    }
    if (effectiveValues.social_youtube_url) {
      metaTags.push(
        `<!-- YouTube Profile: ${effectiveValues.social_youtube_url} -->`,
      );
    }
    if (effectiveValues.social_tiktok_url) {
      metaTags.push(
        `<!-- TikTok Profile: ${effectiveValues.social_tiktok_url} -->`,
      );
    }

    // Default social images (used as fallbacks, shown as comments)
    if (effectiveValues.social_default_image) {
      metaTags.push(
        `<!-- Default Social Image: ${effectiveValues.social_default_image} -->`,
      );
    }
    if (effectiveValues.social_twitter_image) {
      metaTags.push(
        `<!-- Twitter Default Image: ${effectiveValues.social_twitter_image} -->`,
      );
    }

    return metaTags.join("\n");
  };

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
          {field.tooltip && <Tooltip text={field.tooltip} />}
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
            <span className={styles.sectionIcon}>
              {isExpanded ? "Ã¢â€“Â¼" : "Ã¢â€“Â¶"}
            </span>
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
            <span className={styles.alertIcon}>Ã¢Å“â€¦</span>
            <span className={styles.alertText}>
              Settings saved successfully!
            </span>
            <button
              className={styles.alertClose}
              onClick={() => setShowSaveAlert(false)}
            >
              Ãƒâ€”
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
          <option value="global">Ã°Å¸Å’Â Global Defaults (All Pages)</option>
          {pages
            .filter((page) => page.id !== "global")
            .map((page) => (
              <option key={page.id} value={page.id}>
                Ã°Å¸â€œâ€ž {page.title}
                {page.url ? ` (${page.url})` : ""}
              </option>
            ))}
        </select>

        {selectedPage !== "global" && (
          <div className={styles.inheritanceInfo}>
            <small>
              Ã°Å¸â€™Â¡ This page inherits social media settings from Global.
              Override any field to customize it specifically for this page.
            </small>
          </div>
        )}
      </div>

      {/* Error Display */}
      {apiError && (
        <div className={styles.errorAlert}>
          <p>Ã¢Å¡Â Ã¯Â¸Â {apiError}</p>
        </div>
      )}

      {/* Collapsible Sections */}
      <div className={styles.sectionsContainer}>
        {socialFields.map(renderSection)}
      </div>

      {/* Save Button */}
      <div className={styles.saveSection}>
        <ReviewPublishButton
          onSave={handleSave}
          hasChanges={hasChanges}
          isSaving={isSaving}
          onNavigate={onNavigate}
        />
      </div>

      {/* Meta Tags Preview - Always visible for debugging */}
      <div style={{ marginTop: "2rem" }}>
        <div className={styles.pageSelector}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => setShowPreview(!showPreview)}
            style={{ marginRight: "1rem" }}
          >
            {showPreview ? "Hide Meta Tags Preview" : "Show Meta Tags Preview"}
          </button>

          {selectedPage !== "global" && (
            <div
              className={styles.inheritanceInfo}
              style={{ marginTop: "0.5rem" }}
            >
              <small>
                This preview shows ALL meta tags that will be output on this
                page (Global + Page-specific values combined).
              </small>
            </div>
          )}
        </div>

        {showPreview && (
          <div
            className={styles.pageSelector}
            style={{ background: "#f8f9fa" }}
          >
            <label className={styles.selectorLabel}>
              Social Media Meta Tags Output (as they appear in &lt;head&gt;)
            </label>

            {selectedPage !== "global" && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#e3f2fd",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                <strong>What you're seeing:</strong>
                <ul style={{ margin: "0.5rem 0 0 1.5rem", paddingLeft: 0 }}>
                  <li>
                    ✅ <strong>Global values</strong> that apply to all pages
                  </li>
                  <li>
                    ✅ <strong>Page-specific overrides</strong> for this page
                    (take precedence)
                  </li>
                  <li>
                    This is exactly how the meta tags will appear in your page's
                    HTML
                  </li>
                </ul>
              </div>
            )}

            <pre
              style={{
                background: "#282c34",
                color: "#abb2bf",
                padding: "1rem",
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "0.85rem",
                lineHeight: "1.4",
                maxHeight: "600px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {generateMetaTags() ||
                "<!-- No social media meta tags configured yet -->"}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMedia;
