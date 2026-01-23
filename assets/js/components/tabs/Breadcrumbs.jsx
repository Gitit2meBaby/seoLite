// assets/js/components/tabs/Breadcrumbs.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import ReviewPublishButton from "../common/ReviewPublishButton";

import styles from "@css/components/tabs/Breadcrumbs.module.scss";

const Breadcrumbs = ({ tabId, config, onNavigate }) => {
  const {
    settings,
    updateSetting,
    loadPageSettings,
    savePageSettings,
    loadPages,
    isSaving,
  } = useSettings();

  const [pages, setPages] = useState([]);
  const [breadcrumbConfig, setBreadcrumbConfig] = useState({
    enabled: true,
    homeText: "",
    separator: "/",
    showOnHomepage: false,
    excludePages: [],
    customLabels: {},
  });
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [selectedPagePreview, setSelectedPagePreview] = useState("");
  const [breadcrumbPreview, setBreadcrumbPreview] = useState("");

  // Get WordPress data
  const wpData = window.seoPluginData || {};
  const apiUrl = wpData.apiUrl;
  const nonce = wpData.nonce;
  const siteUrl = wpData.siteUrl || window.location.origin;
  const siteName = wpData.siteName || "Your Site";

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedPagePreview && pages.length > 0) {
      generateBreadcrumbPreview(selectedPagePreview);
    }
  }, [selectedPagePreview, breadcrumbConfig, pages]);

  const loadInitialData = async () => {
    try {
      setIsLoadingPages(true);

      // Load pages
      const fetchedPages = await loadPages();
      if (fetchedPages && fetchedPages.length > 0) {
        setPages(fetchedPages);

        // Set default preview to first non-home page
        const firstPage =
          fetchedPages.find(
            (p) => p.type !== "global" && p.type !== "special",
          ) || fetchedPages[0];
        if (firstPage) {
          setSelectedPagePreview(firstPage.id);
        }
      }

      // Load existing breadcrumb settings
      const existingSettings = await loadPageSettings("global");
      const existingBreadcrumbs = existingSettings?.breadcrumb_config || {};

      setBreadcrumbConfig({
        enabled: existingBreadcrumbs.enabled !== false, // Default to true if not explicitly set to false
        homeText: existingBreadcrumbs.homeText || siteName,
        separator: existingBreadcrumbs.separator || "/",
        showOnHomepage: existingBreadcrumbs.showOnHomepage || false,
        excludePages: existingBreadcrumbs.excludePages || [],
        customLabels: existingBreadcrumbs.customLabels || {},
      });
    } catch (error) {
      console.error("Failed to load breadcrumb data:", error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const buildPageHierarchy = (pages) => {
    // Create a map of pages by ID for quick lookup
    const pageMap = {};
    pages.forEach((page) => {
      pageMap[page.id] = {
        ...page,
        children: [],
        parent: null,
        depth: 0,
      };
    });

    // Build hierarchy based on URL structure
    pages.forEach((page) => {
      if (page.url && page.url !== "/" && page.type !== "special") {
        // Find parent based on URL structure
        const urlParts = page.url.split("/").filter((part) => part);

        if (urlParts.length > 1) {
          // Look for parent page with shorter URL
          const parentUrl = "/" + urlParts.slice(0, -1).join("/") + "/";
          const parentPage = pages.find((p) => p.url === parentUrl);

          if (parentPage && pageMap[parentPage.id]) {
            pageMap[page.id].parent = parentPage.id;
            pageMap[page.id].depth = pageMap[parentPage.id].depth + 1;
            pageMap[parentPage.id].children.push(page.id);
          }
        }
      }
    });

    return pageMap;
  };

  const generateBreadcrumbPath = (pageId, pageHierarchy) => {
    const breadcrumbs = [];

    // Always start with home
    breadcrumbs.push({
      "@type": "ListItem",
      position: 1,
      name: breadcrumbConfig.homeText || siteName,
      item: siteUrl,
    });

    if (pageId === "home" || pageId === "global") {
      return breadcrumbs;
    }

    // Build path from current page to root
    const buildPath = (currentPageId, position = 2) => {
      const currentPage = pageHierarchy[currentPageId];
      if (!currentPage) return position;

      const path = [];
      let current = currentPage;

      // Trace back to root
      while (current && current.id !== "home" && current.id !== "global") {
        path.unshift(current);
        current = current.parent ? pageHierarchy[current.parent] : null;
      }

      // Add each level to breadcrumbs
      path.forEach((page, index) => {
        const customLabel = breadcrumbConfig.customLabels[page.id];
        const pageName = customLabel || page.title;
        const pageUrl = page.url === "/" ? siteUrl : `${siteUrl}${page.url}`;

        breadcrumbs.push({
          "@type": "ListItem",
          position: position + index,
          name: pageName,
          item: pageUrl,
        });
      });

      return position + path.length;
    };

    buildPath(pageId);
    return breadcrumbs;
  };

  const generateBreadcrumbPreview = (pageId) => {
    const pageHierarchy = buildPageHierarchy(pages);
    const breadcrumbData = generateBreadcrumbPath(pageId, pageHierarchy);

    // Generate JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbData,
    };

    const jsonCode = `<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`;

    setBreadcrumbPreview(jsonCode);

    // Also generate visual breadcrumb
    return breadcrumbData;
  };

  const handleConfigChange = (field, value) => {
    setBreadcrumbConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleCustomLabelChange = (pageId, label) => {
    setBreadcrumbConfig((prev) => ({
      ...prev,
      customLabels: {
        ...prev.customLabels,
        [pageId]: label,
      },
    }));
    setHasChanges(true);
  };

  const handleExcludeToggle = (pageId, excluded) => {
    setBreadcrumbConfig((prev) => ({
      ...prev,
      excludePages: excluded
        ? [...prev.excludePages, pageId]
        : prev.excludePages.filter((id) => id !== pageId),
    }));
    setHasChanges(true);
  };

  const handleAutoGenerate = async () => {
    // Set smart defaults and enable breadcrumbs
    const autoConfig = {
      enabled: true,
      homeText: siteName,
      separator: "/",
      showOnHomepage: false,
      excludePages: [],
      customLabels: {},
    };

    setBreadcrumbConfig(autoConfig);
    setHasChanges(true);

    // Auto-save the settings
    try {
      // CRITICAL: Merge with existing settings to avoid overwriting other data
      const existingSettings = settings["page_global"] || {};
      const mergedSettings = {
        ...existingSettings,
        breadcrumb_config: autoConfig,
      };

      const result = await savePageSettings("global", mergedSettings);

      if (result.success) {
        setHasChanges(false);
        setShowSaveAlert(true);
        setTimeout(() => setShowSaveAlert(false), 3000);
      } else {
        alert(`Failed to save settings: ${result.message}`);
      }
    } catch (error) {
      alert(`Error during save: ${error.message}`);
    }
  };

  const handleSave = async () => {
    try {
      // CRITICAL: Merge with existing settings to avoid overwriting other data
      const existingSettings = settings["page_global"] || {};
      const mergedSettings = {
        ...existingSettings,
        breadcrumb_config: breadcrumbConfig,
      };

      const result = await savePageSettings("global", mergedSettings);

      if (result.success) {
        setHasChanges(false);
        setShowSaveAlert(true);
        setTimeout(() => setShowSaveAlert(false), 3000);
      } else {
        throw new Error(result.message || "Save failed");
      }
    } catch (error) {
      console.error("❌ Breadcrumbs: Save failed:", error);
      alert(`Save failed: ${error.message}`);
    }
  };

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading breadcrumb data..." />;
  }

  const pageHierarchy = buildPageHierarchy(pages);
  const previewBreadcrumbs = selectedPagePreview
    ? generateBreadcrumbPath(selectedPagePreview, pageHierarchy)
    : [];

  return (
    <div className={styles.breadcrumbs}>
      {/* Success Alert */}
      {showSaveAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>✅</span>
            <span className={styles.alertText}>Breadcrumb settings saved!</span>
            <button
              className={styles.alertClose}
              onClick={() => setShowSaveAlert(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Button - Enhanced */}
      <div className={styles.quickActions}>
        <div className={styles.quickActionCard}>
          <div className={styles.quickActionContent}>
            <h3>💾 One-Click Setup</h3>
            <p>
              <strong>Enable breadcrumbs instantly with smart defaults.</strong>{" "}
              This automatically configures everything for you - no technical
              setup required! Just click the button below and breadcrumb
              structured data will be added to all your pages for immediate SEO
              benefits.
            </p>
            <div className={styles.benefitsList}>
              <div className={styles.benefit}>
                ✅ Helps search engines understand your site structure
              </div>
              <div className={styles.benefit}>
                ✅ Creates rich snippets in Google search results
              </div>
              <div className={styles.benefit}>
                ✅ Zero configuration needed - everything is done for you
              </div>
            </div>
            <button
              className={styles.autoGenerateButton}
              onClick={handleAutoGenerate}
              disabled={isSaving}
            >
              {breadcrumbConfig.enabled
                ? "✅ Breadcrumbs Are Active"
                : "🚀 Enable Breadcrumbs Now"}
            </button>
            <p className={styles.buttonSubtext}>
              {breadcrumbConfig.enabled
                ? "Breadcrumbs are working! Structured data is being added to all your pages."
                : "Click once and you're done - breadcrumbs will work automatically on all pages."}
            </p>
          </div>
        </div>
      </div>

      {/* Global Settings */}
      <div className={styles.fieldsContainer}>
        <div className={styles.sectionHeader}>
          <h3>🔧 Advanced Configuration</h3>
          <p>
            Fine-tune your breadcrumb settings. Most sites work great with the
            default settings above.
          </p>
        </div>

        <div className={styles.globalSettings}>
          <div className={styles.field}>
            <label className={styles.label}>
              Home Page Text
              <span className={styles.description}>
                Text to display for the home page link in breadcrumbs
              </span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={breadcrumbConfig.homeText}
              onChange={(e) => handleConfigChange("homeText", e.target.value)}
              placeholder={siteName}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Separator
              <span className={styles.description}>
                Character or symbol to separate breadcrumb items
              </span>
            </label>
            <select
              className={styles.select}
              value={breadcrumbConfig.separator}
              onChange={(e) => handleConfigChange("separator", e.target.value)}
            >
              <option value="/">/</option>
              <option value=">">{">"}</option>
              <option value="→">→</option>
              <option value="»">»</option>
              <option value="|">|</option>
              <option value="·">·</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={breadcrumbConfig.showOnHomepage}
                onChange={(e) =>
                  handleConfigChange("showOnHomepage", e.target.checked)
                }
              />
              Show on Homepage
              <span className={styles.description}>
                Whether to show breadcrumbs on the homepage (usually not needed)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className={styles.previewSection}>
        <h4>🔍 Live Preview</h4>

        <div className={styles.previewControls}>
          <label>Preview for page:</label>
          <select
            value={selectedPagePreview}
            onChange={(e) => setSelectedPagePreview(e.target.value)}
            className={styles.select}
          >
            {pages
              .filter((p) => p.type !== "global")
              .map((page) => (
                <option key={page.id} value={page.id}>
                  {page.type === "special"
                    ? "🏠 Home Page"
                    : page.type === "page"
                      ? `📄 ${page.title}`
                      : page.type === "post"
                        ? `📝 ${page.title}`
                        : page.title}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.codePreview}>
          <h5>Generated JSON-LD:</h5>
          <pre className={styles.codeBlock}>
            <code>{breadcrumbPreview}</code>
          </pre>
          <button
            className={styles.copyButton}
            onClick={() => navigator.clipboard.writeText(breadcrumbPreview)}
          >
            📋 Copy Code
          </button>
        </div>
      </div>

      {/* Page-specific Settings */}
      <div className={styles.fieldsContainer}>
        <div className={styles.sectionHeader}>
          <h3>📃 Page-Specific Settings</h3>
          <p>
            Customize breadcrumb labels or exclude specific pages from
            breadcrumb generation.
          </p>
        </div>

        <div className={styles.pageList}>
          {pages
            .filter((p) => p.type !== "global")
            .map((page) => (
              <div key={page.id} className={styles.pageItem}>
                <div className={styles.pageInfo}>
                  <div className={styles.pageTitle}>
                    {page.type === "special"
                      ? "🏠 Home Page"
                      : page.type === "page"
                        ? `📄 ${page.title}`
                        : page.type === "post"
                          ? `📝 ${page.title}`
                          : page.title}
                  </div>
                  <div className={styles.pageUrl}>{page.url}</div>
                </div>

                <div className={styles.pageControls}>
                  <div className={styles.customLabel}>
                    <label>Custom Label:</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={breadcrumbConfig.customLabels[page.id] || ""}
                      onChange={(e) =>
                        handleCustomLabelChange(page.id, e.target.value)
                      }
                      placeholder={page.title}
                    />
                  </div>

                  <label className={styles.excludeCheckbox}>
                    <input
                      type="checkbox"
                      checked={breadcrumbConfig.excludePages.includes(page.id)}
                      onChange={(e) =>
                        handleExcludeToggle(page.id, e.target.checked)
                      }
                    />
                    Exclude from breadcrumbs
                  </label>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {hasChanges && (
          <span className={styles.unsavedChanges}>
            You have unsaved changes
          </span>
        )}

        <ReviewPublishButton
          onSave={handleSave}
          hasChanges={hasChanges}
          isSaving={isSaving}
          onNavigate={onNavigate}
        />
      </div>

      {/* Help Section */}
      <div className={styles.helpSection}>
        <h4>ℹ️ How Breadcrumbs Work</h4>
        <ul>
          <li>
            <strong>Automatic Detection:</strong> Page hierarchy is determined
            by URL structure
          </li>
          <li>
            <strong>JSON-LD Schema:</strong> Generates proper structured data
            for search engines
          </li>
          <li>
            <strong>Custom Labels:</strong> Override default page titles in
            breadcrumbs
          </li>
          <li>
            <strong>Flexible Exclusions:</strong> Hide specific pages from
            breadcrumb trails
          </li>
        </ul>

        <div className={styles.exampleBox}>
          <strong>Example URL Structure:</strong>
          <ul>
            <li>
              <code>/</code> → Home
            </li>
            <li>
              <code>/services/</code> → Home → Services
            </li>
            <li>
              <code>/services/web-design/</code> → Home → Services → Web Design
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
