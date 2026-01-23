// assets/js/components/tabs/GeneralMeta.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import ReviewPublishButton from "../common/ReviewPublishButton";

import styles from "@css/components/tabs/GeneralMeta.module.scss";

const GeneralMeta = ({ tabId, config, onNavigate }) => {
  const settingsContext = useSettings();
  const {
    settings,
    updateSetting,
    loadPageSettings,
    savePageSettings,
    loadPages,
    isSaving,
  } = settingsContext;

  const [selectedPage, setSelectedPage] = useState("global");
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Meta fields configuration with FIXED defaults
  const metaFields = [
    {
      key: "meta_title",
      label: "Page Title",
      type: "text",
      placeholder: "Enter page title (recommended: 50-60 characters)",
      description: "The title that appears in search results and browser tabs",
      maxLength: 60,
    },
    {
      key: "meta_description",
      label: "Meta Description",
      type: "textarea",
      placeholder: "Write a compelling description for search results",
      description:
        "Brief summary shown in search results (recommended: 150-160 characters)",
      maxLength: 160,
    },
    {
      key: "meta_keywords",
      label: "Meta Keywords",
      type: "text",
      placeholder: "keyword1, keyword2, keyword3",
      description:
        "Comma-separated keywords (mostly ignored by modern search engines)",
    },
    {
      key: "charset",
      label: "Character Encoding",
      type: "select",
      options: [
        { value: "UTF-8", label: "UTF-8 (recommended)" },
        { value: "ISO-8859-1", label: "ISO-8859-1" },
        { value: "UTF-16", label: "UTF-16" },
      ],
      description: "Character encoding for the webpage",
      defaultValue: "UTF-8",
      global: true,
    },
    {
      key: "viewport",
      label: "Viewport",
      type: "select",
      options: [
        {
          value: "width=device-width, initial-scale=1",
          label: "Responsive (recommended)",
        },
        {
          value: "width=device-width, initial-scale=1, maximum-scale=1",
          label: "Responsive (no zoom)",
        },
        { value: "width=1024", label: "Fixed width (1024px)" },
        { value: "", label: "No viewport tag" },
      ],
      description: "Controls layout on mobile browsers",
      defaultValue: "width=device-width, initial-scale=1",
      global: true,
    },
    {
      key: "canonical_url",
      label: "Canonical URL",
      type: "url",
      placeholder: "https://example.com/canonical-page",
      description:
        "Preferred URL for this content to avoid duplicate content issues",
    },
    {
      key: "meta_author",
      label: "Author",
      type: "text",
      placeholder: "Author name",
      description: "Content author or site owner",
    },
    {
      key: "meta_copyright",
      label: "Copyright",
      type: "text",
      placeholder: "Ã‚Â© 2025 Your Company Name",
      description: "Copyright information",
    },
    {
      key: "robots_index",
      label: "Search Engine Indexing",
      type: "select",
      options: [
        { value: "index", label: "Index (allow search engines)" },
        { value: "noindex", label: "No Index (hide from search engines)" },
      ],
      description: "Whether search engines should index this page",
      defaultValue: "index",
    },
    {
      key: "robots_follow",
      label: "Link Following",
      type: "select",
      options: [
        { value: "follow", label: "Follow (crawl links)" },
        { value: "nofollow", label: "No Follow (don't crawl links)" },
      ],
      description: "Whether search engines should follow links on this page",
      defaultValue: "follow",
    },
    {
      key: "robots_advanced",
      label: "Advanced Robots Directives",
      type: "select",
      options: [
        { value: "", label: "None" },
        { value: "noarchive", label: "No Archive (don't cache)" },
        { value: "nosnippet", label: "No Snippet (don't show description)" },
        { value: "noimageindex", label: "No Image Index" },
        { value: "notranslate", label: "No Translate" },
        { value: "max-snippet:-1", label: "No Snippet Limit" },
        { value: "max-image-preview:large", label: "Large Image Preview" },
      ],
      description: "Additional robots directives for search engines",
    },
    {
      key: "hreflang",
      label: "Hreflang",
      type: "select",
      options: [
        { value: "", label: "No hreflang" },
        { value: "en", label: "English" },
        { value: "en-US", label: "English (United States)" },
        { value: "en-GB", label: "English (United Kingdom)" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "it", label: "Italian" },
        { value: "pt", label: "Portuguese" },
        { value: "ja", label: "Japanese" },
        { value: "ko", label: "Korean" },
        { value: "zh", label: "Chinese" },
      ],
      description: "Language and region targeting for international SEO",
    },
    {
      key: "refresh_redirect",
      label: "Refresh/Redirect",
      type: "text",
      placeholder: "5;url=https://example.com",
      description: "Auto-refresh or redirect (format: seconds;url=destination)",
    },
    {
      key: "date_published",
      label: "Date Published",
      type: "datetime-local",
      description:
        "When this content was first published (used for articles/news)",
    },
    {
      key: "date_modified",
      label: "Date Modified",
      type: "datetime-local",
      description: "When this content was last updated",
    },
    {
      key: "theme_color",
      label: "Theme Color",
      type: "color",
      description: "Browser theme color for mobile devices",
      global: true,
    },
    {
      key: "generator",
      label: "Generator",
      type: "text",
      placeholder: "WordPress, Custom CMS, etc.",
      description: "What software generated this page",
      global: true,
    },
  ];

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
          "No pages found. The WordPress API might not be working properly.",
        );
        setPages([{ id: "global", title: "(All pages)", type: "global" }]);
      }
    } catch (error) {
      setApiError(`API Error: ${error.message}`);
      setPages([{ id: "global", title: "(All pages)", type: "global" }]);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const getFieldValue = (fieldKey) => {
    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    // Get the field definition to check for default values
    const fieldDef = metaFields.find((field) => field.key === fieldKey);
    const defaultValue = fieldDef?.defaultValue || "";

    if (selectedPage === "global") {
      // For global page, return the setting or default
      return globalSettings[fieldKey] || defaultValue;
    } else {
      // For other pages, check page-specific first, then global, then default
      if (
        pageSettings[fieldKey] !== undefined &&
        pageSettings[fieldKey] !== ""
      ) {
        return pageSettings[fieldKey]; // Page-specific value
      } else if (
        globalSettings[fieldKey] !== undefined &&
        globalSettings[fieldKey] !== ""
      ) {
        return globalSettings[fieldKey]; // Global value
      } else {
        return defaultValue; // Field default
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

    // Get field default
    const fieldDef = metaFields.find((field) => field.key === fieldKey);
    const defaultValue = fieldDef?.defaultValue || "";

    // Check if user has explicitly set a value for this page
    if (pageValue !== undefined && pageValue !== "") {
      if (pageValue === globalValue) {
        return "inherited"; // Explicitly set but same as global
      } else {
        return "unique"; // Explicitly set and different from global
      }
    }

    // No page-specific value set
    if (globalValue && globalValue !== defaultValue) {
      return "using_global"; // Will use global value
    }

    return "using_default"; // Using field default
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
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setShowSaveAlert(false), 3000);
      } else {
        throw new Error(result.message || "Save failed");
      }
    } catch (error) {
      console.error("❌ GeneralMeta: Save failed:", error);
      setApiError(`Save failed: ${error.message}`);
    }
  };

  const getPreviewUrl = () => {
    const wpData = window.seoPluginData || {};
    let siteUrl = wpData.siteUrl || window.location.origin;
    let domain = "";

    if (siteUrl) {
      try {
        const url = new URL(siteUrl);
        domain = url.hostname;
      } catch (e) {
        domain = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
      }
    } else {
      domain = "(your-domain.com)";
    }

    if (selectedPage === "global") {
      return domain;
    } else {
      const page = pages.find((p) => p.id === selectedPage);
      const pagePath = page?.url || "/page-url";
      return `${domain}${pagePath}`;
    }
  };

  const generateMetaTagsCode = () => {
    const pageSettings = settings[`page_${selectedPage}`] || {};
    const globalSettings = settings["page_global"] || {};

    const getValue = (key) => {
      // Use the same logic as getFieldValue for consistency
      const fieldDef = metaFields.find((field) => field.key === key);
      const defaultValue = fieldDef?.defaultValue || "";

      if (selectedPage === "global") {
        return globalSettings[key] || defaultValue;
      } else {
        if (pageSettings[key] !== undefined && pageSettings[key] !== "") {
          return pageSettings[key];
        } else if (
          globalSettings[key] !== undefined &&
          globalSettings[key] !== ""
        ) {
          return globalSettings[key];
        } else {
          return defaultValue;
        }
      }
    };

    let code = "";

    // Always include global settings in preview (charset, viewport)
    const charset = globalSettings["charset"] || "UTF-8";
    if (charset) {
      code += `<meta charset="${charset}">\n`;
    }

    const viewport =
      globalSettings["viewport"] || "width=device-width, initial-scale=1";
    if (viewport) {
      code += `<meta name="viewport" content="${viewport}">\n`;
    }

    const title = getValue("meta_title");
    if (title) {
      code += `<title>${title}</title>\n`;
    }

    const description = getValue("meta_description");
    if (description) {
      code += `<meta name="description" content="${description}">\n`;
    }

    const keywords = getValue("meta_keywords");
    if (keywords) {
      code += `<meta name="keywords" content="${keywords}">\n`;
    }

    const author = getValue("meta_author");
    if (author) {
      code += `<meta name="author" content="${author}">\n`;
    }

    const copyright = getValue("meta_copyright");
    if (copyright) {
      code += `<meta name="copyright" content="${copyright}">\n`;
    }

    // Always include global generator if set
    const generator = globalSettings["generator"] || "";
    if (generator) {
      code += `<meta name="generator" content="${generator}">\n`;
    }

    // FIXED: Always show robots meta tag with current values
    const robotsIndex = getValue("robots_index");
    const robotsFollow = getValue("robots_follow");
    const robotsAdvanced = getValue("robots_advanced");

    let robotsContent = [];
    robotsContent.push(robotsIndex, robotsFollow);

    if (robotsAdvanced) {
      robotsContent.push(robotsAdvanced);
    }

    // Always output robots meta tag since we have defaults
    code += `<meta name="robots" content="${robotsContent.join(", ")}">\n`;

    const canonical = getValue("canonical_url");
    if (canonical) {
      code += `<link rel="canonical" href="${canonical}">\n`;
    }

    const hreflang = getValue("hreflang");
    if (hreflang) {
      const currentUrl =
        pages.find((p) => p.id === selectedPage)?.url || "/page-url";
      code += `<link rel="alternate" hreflang="${hreflang}" href="${currentUrl}">\n`;
    }

    const refresh = getValue("refresh_redirect");
    if (refresh) {
      code += `<meta http-equiv="refresh" content="${refresh}">\n`;
    }

    // Always include global theme color if set
    const themeColor = globalSettings["theme_color"] || "";
    if (themeColor) {
      code += `<meta name="theme-color" content="${themeColor}">\n`;
    }

    const datePublished = getValue("date_published");
    if (datePublished) {
      code += `<meta property="article:published_time" content="${datePublished}">\n`;
    }

    const dateModified = getValue("date_modified");
    if (dateModified) {
      code += `<meta property="article:modified_time" content="${dateModified}">\n`;
    }

    return code || "<!-- No meta tags configured yet -->";
  };

  const renderField = (field) => {
    const currentValue = getFieldValue(field.key);
    const fieldStatus = getFieldStatus(field.key);
    const isInherited = fieldStatus === "inherited";
    const isUsingGlobal = fieldStatus === "using_global";
    const isUsingDefault = fieldStatus === "using_default";
    const isUnique = fieldStatus === "unique";

    // Hide global-only fields when not on global page
    if (field.global && selectedPage !== "global") {
      return null;
    }

    const currentPage = pages.find((p) => p.id === selectedPage);
    const pageSlug = currentPage?.title || selectedPage;

    return (
      <div key={field.key} className={styles.field}>
        <label className={styles.label}>
          {field.label}
          {field.global && (
            <span className={styles.globalBadge}>Global Only</span>
          )}
          {isInherited && (
            <span className={styles.inheritedBadge}>Inherited from Global</span>
          )}
          {isUsingGlobal && (
            <span className={styles.usingGlobalBadge}>Using Global Value</span>
          )}
          {isUsingDefault && (
            <span className={styles.usingGlobalBadge}>Using Default Value</span>
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
                isUsingGlobal || isUsingDefault ? styles.usingGlobal : ""
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
              isUsingGlobal || isUsingDefault ? styles.usingGlobal : ""
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
        ) : field.type === "color" ? (
          <div className={styles.colorWrapper}>
            <input
              type="color"
              className={styles.colorInput}
              value={currentValue || "#000000"}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            />
            <input
              type="text"
              className={`${styles.colorText} ${
                isUsingGlobal || isUsingDefault ? styles.usingGlobal : ""
              }`}
              value={currentValue}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder="#000000"
            />
          </div>
        ) : (
          <div className={styles.inputWrapper}>
            <input
              type={field.type}
              className={`${styles.input} ${
                isUsingGlobal || isUsingDefault ? styles.usingGlobal : ""
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

        {(isUsingGlobal || isUsingDefault) && (
          <div className={styles.usingGlobalNote}>
            {isUsingDefault
              ? "This page is using the recommended default value. Start typing to customize it."
              : "This page will automatically use the global value. Start typing to customize it specifically for this page."}
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
            <span className={styles.alertIcon}>Ã¢Å“â€¦</span>
            <span className={styles.alertText}>
              Changes saved successfully!
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

      {apiError && (
        <div className={styles.apiError}>
          <h4>Ã¢Å¡Â Ã¯Â¸Â API Connection Issue</h4>
          <p>{apiError}</p>
          <p>Only Global settings are available until this is resolved.</p>
          <button
            onClick={loadPagesFromWordPress}
            style={{ padding: "5px 10px", marginTop: "10px" }}
          >
            Ã°Å¸â€â€ž Retry Loading Pages
          </button>
        </div>
      )}

      <div className={styles.pageSelector}>
        <label className={styles.selectorLabel}>Configure meta tags for:</label>
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
              icon = "Ã°Å¸Å’Â";
              prefix = "Global";
            } else if (page.type === "page") {
              icon = "Ã°Å¸â€œâ€ž";
              prefix = "Page";
            } else if (page.type === "post") {
              icon = "Ã°Å¸â€œÂ";
              prefix = "Post";
            } else if (page.type === "special") {
              icon = "Ã¢Â­Â";
              prefix = "Special";
            }

            return (
              <option key={page.id} value={page.id}>
                {icon} {prefix}: {page.title.replace(/^Ã°Å¸Å’Â\s*/, "")}
                {page.url && page.url !== "/" ? ` (${page.url})` : ""}
              </option>
            );
          })}
        </select>

        {selectedPage !== "global" && (
          <div className={styles.inheritanceInfo}>
            <small>
              Ã°Å¸â€™Â¡ This page inherits settings from Global. Override any
              field to customize it specifically for this page. Global-only
              settings (Character Encoding, Viewport, Theme Color, Generator)
              are managed in the Global section.
            </small>
          </div>
        )}

        {selectedPage === "global" && (
          <div className={styles.inheritanceInfo}>
            <small>
              Ã°Å¸Å’Â These are your global default settings. Individual pages
              will inherit these values unless you override them on specific
              pages.
            </small>
          </div>
        )}
      </div>

      <div className={styles.previewSection}>
        <h4>SERP Preview</h4>
        <div className={styles.previewBox}>
          <div className={styles.previewTitle}>
            {getFieldValue("meta_title") || "Page title will appear here"}
          </div>
          <div className={styles.previewUrl}>{getPreviewUrl()}</div>
          <div className={styles.previewDescription}>
            {getFieldValue("meta_description") ||
              "Meta description will appear here"}
          </div>
        </div>

        <h4 style={{ marginTop: "1.5rem" }}>Generated Meta Tags</h4>
        <div className={styles.codePreview}>
          <pre className={styles.codeBlock}>
            <code>{generateMetaTagsCode()}</code>
          </pre>
          <button
            className={styles.copyButton}
            onClick={() => {
              navigator.clipboard.writeText(generateMetaTagsCode());
            }}
          >
            Ã°Å¸â€œâ€¹ Copy Code
          </button>
        </div>
      </div>

      <div className={styles.fieldsContainer}>
        {metaFields
          .filter((field) => {
            // Filter out global-only fields when not on global page
            if (field.global && selectedPage !== "global") {
              return false;
            }
            return true;
          })
          .map(renderField)}
      </div>

      <div className={styles.actions}>
        <ReviewPublishButton
          onSave={handleSave}
          hasChanges={hasChanges}
          isSaving={isSaving}
          onNavigate={onNavigate}
        />

        {hasChanges && (
          <span className={styles.unsavedChanges}>
            You have unsaved changes
          </span>
        )}
      </div>
    </div>
  );
};

export default GeneralMeta;
