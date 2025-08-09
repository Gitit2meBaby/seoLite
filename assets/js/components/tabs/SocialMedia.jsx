// assets/js/components/tabs/SocialMedia.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";

import LoadingSpinner from "../common/LoadingSpinner";

import { socialFields } from "./socialFields";

import styles from "@css/components/tabs/GeneralMeta.module.scss"; // Reusing existing styles

const SocialMedia = ({ tabId, config }) => {
  console.log("🎯 SocialMedia component loading!", { tabId, config });

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
    }

    if (globalValue) {
      return "using_global";
    }

    return "empty";
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
    const pageSettings = settings[`page_${selectedPage}`] || {};

    try {
      const result = await savePageSettings(selectedPage, pageSettings);

      if (result.success) {
        setHasChanges(false);
        setShowSaveAlert(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setShowSaveAlert(false), 3000);
      } else {
        alert(`Failed to save settings: ${result.message}`);
      }
    } catch (error) {
      alert(`Error during save: ${error.message}`);
    }
  };

  const generateSocialMetaCode = () => {
    const pageSettings = settings[`page_${selectedPage}`] || {};
    const globalSettings = settings["page_global"] || {};

    const getValue = (key) => {
      if (pageSettings[key] !== undefined && pageSettings[key] !== "") {
        return pageSettings[key];
      }
      return globalSettings[key] || "";
    };

    let code = "";

    // Open Graph tags
    const ogTitle = getValue("og_title") || getValue("meta_title");
    if (ogTitle) {
      code += `<meta property="og:title" content="${ogTitle}" />\n`;
    }

    const ogDescription =
      getValue("og_description") || getValue("meta_description");
    if (ogDescription) {
      code += `<meta property="og:description" content="${ogDescription}" />\n`;
    }

    const ogImage = getValue("og_image") || getValue("social_default_image");
    if (ogImage) {
      code += `<meta property="og:image" content="${ogImage}" />\n`;
    }

    const ogImageAlt = getValue("og_image_alt");
    if (ogImageAlt) {
      code += `<meta property="og:image:alt" content="${ogImageAlt}" />\n`;
    }

    const ogType = getValue("og_type") || "website";
    code += `<meta property="og:type" content="${ogType}" />\n`;

    const ogSiteName = getValue("og_site_name");
    if (ogSiteName) {
      code += `<meta property="og:site_name" content="${ogSiteName}" />\n`;
    }

    const ogLocale = getValue("og_locale");
    if (ogLocale) {
      code += `<meta property="og:locale" content="${ogLocale}" />\n`;
    }

    // Current page URL
    const currentUrl =
      selectedPage === "global"
        ? "https://yoursite.com"
        : pages.find((p) => p.id === selectedPage)?.url || "/page-url";
    code += `<meta property="og:url" content="${currentUrl}" />\n`;

    // Twitter Card tags
    const twitterCardType =
      getValue("twitter_card_type") || "summary_large_image";
    code += `<meta name="twitter:card" content="${twitterCardType}" />\n`;

    const twitterSite = getValue("twitter_site");
    if (twitterSite) {
      code += `<meta name="twitter:site" content="${twitterSite}" />\n`;
    }

    const twitterCreator = getValue("twitter_creator");
    if (twitterCreator) {
      code += `<meta name="twitter:creator" content="${twitterCreator}" />\n`;
    }

    const twitterTitle = getValue("twitter_title") || ogTitle;
    if (twitterTitle) {
      code += `<meta name="twitter:title" content="${twitterTitle}" />\n`;
    }

    const twitterDescription = getValue("twitter_description") || ogDescription;
    if (twitterDescription) {
      code += `<meta name="twitter:description" content="${twitterDescription}" />\n`;
    }

    const twitterImage =
      getValue("twitter_image") || getValue("social_twitter_image") || ogImage;
    if (twitterImage) {
      code += `<meta name="twitter:image" content="${twitterImage}" />\n`;
    }

    // Facebook specific
    const fbAppId = getValue("fb_app_id");
    if (fbAppId) {
      code += `<meta property="fb:app_id" content="${fbAppId}" />\n`;
    }

    const fbAdmins = getValue("fb_admins");
    if (fbAdmins) {
      code += `<meta property="fb:admins" content="${fbAdmins}" />\n`;
    }

    return code || "<!-- No social media tags configured yet -->";
  };

  const MediaHelper = () => (
    <span
      className={styles.mediaHelper}
      title="Upload your image to WordPress Media Library, then copy the URL here"
      style={{
        marginLeft: "8px",
        cursor: "help",
        color: "#666",
        fontSize: "14px",
      }}
    >
      ❓
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
          {field.hasMediaHelper && <MediaHelper />}
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

        {isUsingGlobal && (
          <div className={styles.usingGlobalNote}>
            This page will automatically use the global value. Start typing to
            customize it specifically for this page.
          </div>
        )}

        {isUnique && (
          <div className={styles.uniqueNote}>
            This value is customized specifically for this page.
          </div>
        )}
      </div>
    );
  };

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading pages..." />;
  }

  return (
    <div className={styles.generalMeta}>
      {/* Success Alert */}
      {showSaveAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>✅</span>
            <span className={styles.alertText}>
              Changes saved successfully!
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

      {apiError && (
        <div className={styles.apiError}>
          <h4>⚠️ API Connection Issue</h4>
          <p>{apiError}</p>
          <p>Only Global settings are available until this is resolved.</p>
          <button onClick={loadPagesFromWordPress}>
            🔄 Retry Loading Pages
          </button>
        </div>
      )}

      <div className={styles.pageSelector}>
        <label className={styles.selectorLabel}>
          Configure social media for:
        </label>
        <select
          className={styles.pageSelect}
          value={selectedPage}
          onChange={(e) => {
            setSelectedPage(e.target.value);
            setHasChanges(false);
          }}
        >
          {pages.map((page) => {
            let icon = "";
            let prefix = "";

            if (page.type === "global") {
              icon = "🌐";
              prefix = "Global";
            } else if (page.type === "page") {
              icon = "📄";
              prefix = "Page";
            } else if (page.type === "post") {
              icon = "📝";
              prefix = "Post";
            } else if (page.type === "special") {
              icon = "⭐";
              prefix = "Special";
            }

            return (
              <option key={page.id} value={page.id}>
                {icon} {prefix}: {page.title.replace(/^🌐\s*/, "")}
                {page.url && page.url !== "/" ? ` (${page.url})` : ""}
              </option>
            );
          })}
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

      <div className={styles.previewSection}>
        <h4>Social Media Preview</h4>
        <div className={styles.previewBox}>
          <strong>Facebook/LinkedIn Preview:</strong>
          <div
            style={{
              marginTop: "8px",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#1877f2" }}>
              {getFieldValue("og_title") ||
                getFieldValue("meta_title") ||
                "Page title will appear here"}
            </div>
            <div
              style={{ fontSize: "14px", color: "#65676b", marginTop: "4px" }}
            >
              {getFieldValue("og_description") ||
                getFieldValue("meta_description") ||
                "Description will appear here"}
            </div>
            <div
              style={{ fontSize: "12px", color: "#8a8d91", marginTop: "4px" }}
            >
              {pages.find((p) => p.id === selectedPage)?.url || "yoursite.com"}
            </div>
          </div>

          <strong style={{ display: "block", marginTop: "20px" }}>
            Twitter Preview:
          </strong>
          <div
            style={{
              marginTop: "8px",
              padding: "12px",
              background: "#f7f9fa",
              borderRadius: "4px",
              border: "1px solid #e1e8ed",
            }}
          >
            <div style={{ fontWeight: "bold", color: "#14171a" }}>
              {getFieldValue("twitter_title") ||
                getFieldValue("og_title") ||
                getFieldValue("meta_title") ||
                "Tweet title here"}
            </div>
            <div
              style={{ fontSize: "14px", color: "#657786", marginTop: "4px" }}
            >
              {getFieldValue("twitter_description") ||
                getFieldValue("og_description") ||
                getFieldValue("meta_description") ||
                "Tweet description here"}
            </div>
            <div
              style={{ fontSize: "12px", color: "#657786", marginTop: "4px" }}
            >
              🔗{" "}
              {pages.find((p) => p.id === selectedPage)?.url || "yoursite.com"}
            </div>
          </div>
        </div>

        <h4 style={{ marginTop: "1.5rem" }}>Generated Social Media Code</h4>
        <div className={styles.codePreview}>
          <pre className={styles.codeBlock}>
            <code>{generateSocialMetaCode()}</code>
          </pre>
          <button
            className={styles.copyButton}
            onClick={() => {
              navigator.clipboard.writeText(generateSocialMetaCode());
            }}
          >
            📋 Copy Code
          </button>
        </div>
      </div>

      <div className={styles.fieldsContainer}>
        {socialFields.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4
              style={{
                margin: "2rem 0 1rem 0",
                padding: "0.5rem 0",
                borderBottom: "2px solid #0073aa",
                color: "#0073aa",
              }}
            >
              {section.section}
            </h4>
            {section.fields.map(renderField)}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

        {hasChanges && (
          <span className={styles.unsavedChanges}>
            You have unsaved changes
          </span>
        )}
      </div>
    </div>
  );
};

export default SocialMedia;
