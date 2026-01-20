// assets/js/components/tabs/SitemapRobots.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import styles from "@css/components/tabs/SitemapRobots.module.scss";

const SitemapRobots = ({ tabId, config }) => {
  const {
    settings,
    updateSetting,
    loadPageSettings,
    savePageSettings,
    loadPages,
    isSaving,
  } = useSettings();

  const [pages, setPages] = useState([]);
  const [sitemap, setSitemap] = useState([]);
  const [robotsTxt, setRobotsTxt] = useState("");
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [isLoadingSitemap, setIsLoadingSitemap] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [sitemapPreview, setSitemapPreview] = useState("");

  // Get WordPress data
  const wpData = window.seoPluginData || {};
  const apiUrl = wpData.apiUrl;
  const nonce = wpData.nonce;
  const siteUrl = wpData.siteUrl || window.location.origin;

  // Standard robots.txt template
  const defaultRobotsTxt = `User-agent: *
Allow: /

# Disallow WordPress admin and include directories
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /wp-content/plugins/
Disallow: /wp-content/themes/

# Allow access to CSS, JS, and images
Allow: /wp-content/uploads/
Allow: /wp-includes/js/
Allow: /wp-includes/css/

# Disallow common WordPress files
Disallow: /xmlrpc.php
Disallow: /wp-login.php
Disallow: /wp-register.php

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml`;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoadingPages(true);

      // Load pages for sitemap
      const fetchedPages = await loadPages();
      if (fetchedPages && fetchedPages.length > 0) {
        console.log("🔍 Raw pages data:", fetchedPages);
        setPages(fetchedPages);

        // Create initial sitemap data
        const initialSitemap = fetchedPages
          .filter((page) => page.url && page.url !== null) // Filter out pages with no URL
          .map((page) => {
            // Clean URL generation
            let cleanUrl;
            if (
              page.url === "/" ||
              page.id === "home" ||
              page.id === "global"
            ) {
              cleanUrl = siteUrl; // Homepage
            } else {
              // Ensure URL starts with / and doesn't duplicate domain
              const pagePath = page.url.startsWith("/")
                ? page.url
                : `/${page.url}`;
              cleanUrl = `${siteUrl}${pagePath}`;
            }

            return {
              id: page.id,
              title: page.title,
              url: cleanUrl,
              type: page.type,
              included: true, // Include by default
              priority: getPriorityByType(page.type),
              changefreq: "weekly",
              lastmod: new Date().toISOString().split("T")[0], // Today's date as fallback
            };
          })
          .filter(
            (page, index, self) =>
              // Remove duplicates based on URL
              index === self.findIndex((p) => p.url === page.url)
          );

        console.log("🗺️ Final sitemap data:", initialSitemap);
        setSitemap(initialSitemap);
        generateSitemapXML(initialSitemap);
      }

      // Load existing robots.txt or use default
      const existingSettings = await loadPageSettings("global");
      const existingRobots = existingSettings?.robots_txt || defaultRobotsTxt;
      setRobotsTxt(existingRobots);
    } catch (error) {
      console.error("Failed to load initial data:", error);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const getPriorityByType = (type) => {
    switch (type) {
      case "special":
        return "1.0"; // Home page
      case "page":
        return "0.8"; // Important pages
      case "post":
        return "0.6"; // Blog posts
      case "global":
        return "1.0"; // Global/homepage
      default:
        return "0.5";
    }
  };

  const generateSitemapXML = (sitemapData) => {
    const includedPages = sitemapData.filter((page) => page.included);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    includedPages.forEach((page) => {
      xml += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    setSitemapPreview(xml);
    return xml;
  };

  const handleSitemapChange = (pageId, field, value) => {
    const updatedSitemap = sitemap.map((page) =>
      page.id === pageId ? { ...page, [field]: value } : page
    );
    setSitemap(updatedSitemap);
    generateSitemapXML(updatedSitemap);
    setHasChanges(true);
  };

  const handleRobotsTxtChange = (value) => {
    setRobotsTxt(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // Save sitemap and robots.txt settings to global
      const settings = {
        sitemap_data: sitemap,
        robots_txt: robotsTxt,
      };

      const result = await savePageSettings("global", settings);

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

  const deployFiles = async () => {
    if (!apiUrl) {
      alert("Cannot deploy files: API not available");
      return;
    }

    try {
      setDeploymentStatus("deploying");

      const deployData = {
        sitemap_xml: sitemapPreview,
        robots_txt: robotsTxt,
      };

      const response = await fetch(`${apiUrl}deploy-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
        body: JSON.stringify(deployData),
      });

      const result = await response.json();

      if (result.success) {
        setDeploymentStatus("success");
        setTimeout(() => setDeploymentStatus(null), 5000);
      } else {
        setDeploymentStatus("error");
        console.error("Deployment failed:", result.message);
      }
    } catch (error) {
      setDeploymentStatus("error");
      console.error("Deployment error:", error);
    }
  };

  const refreshSitemap = async () => {
    setIsLoadingSitemap(true);
    await loadInitialData();
    setIsLoadingSitemap(false);
  };

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading sitemap data..." />;
  }

  return (
    <div className={styles.sitemapRobots}>
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

      {/* Deployment Status */}
      {deploymentStatus && (
        <div
          className={`${styles.deploymentAlert} ${styles[deploymentStatus]}`}
        >
          <div className={styles.alertContent}>
            {deploymentStatus === "deploying" && (
              <>
                <span className={styles.alertIcon}>⏳</span>
                <span className={styles.alertText}>Deploying files...</span>
              </>
            )}
            {deploymentStatus === "success" && (
              <>
                <span className={styles.alertIcon}>🎉</span>
                <span className={styles.alertText}>
                  Files deployed successfully! Your sitemap.xml and robots.txt
                  are now live.
                </span>
              </>
            )}
            {deploymentStatus === "error" && (
              <>
                <span className={styles.alertIcon}>❌</span>
                <span className={styles.alertText}>
                  Deployment failed. Check file permissions.
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* XML Sitemap Section */}
      <div className={styles.fieldsContainer}>
        <div className={styles.sectionHeader}>
          <h3>🗺️ XML Sitemap</h3>
          <p>
            An XML sitemap helps search engines discover and understand all the
            pages on your website. Configure which pages to include and set
            their priority and update frequency.
          </p>
          <div className={styles.sectionActions}>
            <button
              onClick={refreshSitemap}
              disabled={isLoadingSitemap}
              className={styles.refreshButton}
            >
              {isLoadingSitemap ? "🔄 Refreshing..." : "🔄 Refresh Pages"}
            </button>
          </div>
        </div>

        <div className={styles.sitemapTable}>
          <div className={styles.tableHeader}>
            <div>Include</div>
            <div>Page</div>
            <div>Type</div>
            <div>Priority</div>
            <div>Change Freq</div>
            <div>URL</div>
          </div>

          {sitemap.map((page) => (
            <div key={page.id} className={styles.tableRow}>
              <div>
                <input
                  type="checkbox"
                  checked={page.included}
                  onChange={(e) =>
                    handleSitemapChange(page.id, "included", e.target.checked)
                  }
                />
              </div>
              <div>
                <div className={styles.pageTitle} title={page.title}>
                  {page.title}
                </div>
              </div>
              <div>
                <span className={styles.pageType} data-type={page.type}>
                  {page.type === "special"
                    ? "⭐ Home"
                    : page.type === "page"
                    ? "📄 Page"
                    : page.type === "post"
                    ? "📝 Post"
                    : page.type}
                </span>
              </div>
              <div>
                <select
                  value={page.priority}
                  onChange={(e) =>
                    handleSitemapChange(page.id, "priority", e.target.value)
                  }
                  disabled={!page.included}
                  className={styles.prioritySelect}
                  title={`Priority: ${page.priority}`}
                >
                  <option value="1.0">1.0</option>
                  <option value="0.9">0.9</option>
                  <option value="0.8">0.8</option>
                  <option value="0.7">0.7</option>
                  <option value="0.6">0.6</option>
                  <option value="0.5">0.5</option>
                  <option value="0.4">0.4</option>
                  <option value="0.3">0.3</option>
                  <option value="0.2">0.2</option>
                  <option value="0.1">0.1</option>
                </select>
              </div>
              <div>
                <select
                  value={page.changefreq}
                  onChange={(e) =>
                    handleSitemapChange(page.id, "changefreq", e.target.value)
                  }
                  disabled={!page.included}
                  className={styles.freqSelect}
                  title={`Change frequency: ${page.changefreq}`}
                >
                  <option value="always">Always</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="never">Never</option>
                </select>
              </div>
              <div>
                <div className={styles.pageUrl} title={page.url}>
                  <a href={page.url} target="_blank" rel="noopener noreferrer">
                    {page.url.replace(siteUrl, "") || "/"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sitemapStats}>
          <strong>Sitemap Statistics:</strong>
          <span>Total Pages: {sitemap.length}</span>
          <span>Included: {sitemap.filter((p) => p.included).length}</span>
          <span>Excluded: {sitemap.filter((p) => !p.included).length}</span>
        </div>
      </div>

      {/* Sitemap Preview */}
      <div className={styles.previewSection}>
        <h4>🔍 Generated Sitemap XML</h4>
        <div className={styles.codePreview}>
          <pre className={styles.codeBlock}>
            <code>{sitemapPreview}</code>
          </pre>
          <button
            className={styles.copyButton}
            onClick={() => navigator.clipboard.writeText(sitemapPreview)}
          >
            📋 Copy XML
          </button>
        </div>
      </div>

      {/* Robots.txt Section */}
      <div className={styles.fieldsContainer} style={{ marginTop: "3rem" }}>
        <div className={styles.sectionHeader}>
          <h3>🤖 Robots.txt</h3>
          <p>
            The robots.txt file tells search engines which parts of your site
            they can and cannot crawl. This is automatically pre-filled with
            sensible defaults for WordPress sites.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Robots.txt Content
            <span className={styles.description}>
              Edit the robots.txt content below. Be careful with these
              directives as they control what search engines can access.
            </span>
          </label>
          <textarea
            className={styles.textarea}
            value={robotsTxt}
            onChange={(e) => handleRobotsTxtChange(e.target.value)}
            rows={15}
            style={{ fontFamily: "monospace", fontSize: "14px" }}
          />
        </div>

        <div className={styles.robotsPreview}>
          <h4>🔗 Current robots.txt URL</h4>
          <p>
            After deployment, your robots.txt will be available at:
            <a
              href={`${siteUrl}/robots.txt`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteUrl}/robots.txt
            </a>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>

        <button
          className={styles.deployButton}
          onClick={deployFiles}
          disabled={deploymentStatus === "deploying" || hasChanges}
        >
          {deploymentStatus === "deploying"
            ? "⏳ Deploying..."
            : "🚀 Deploy Files to Website"}
        </button>

        {hasChanges && (
          <span className={styles.unsavedChanges}>
            You have unsaved changes. Save before deploying.
          </span>
        )}
      </div>

      {/* Help Section */}
      <div className={styles.helpSection}>
        <h4>ℹ️ What happens when you deploy?</h4>
        <ul>
          <li>
            <strong>sitemap.xml</strong> - Created at {siteUrl}/sitemap.xml
          </li>
          <li>
            <strong>robots.txt</strong> - Created at {siteUrl}/robots.txt
          </li>
          <li>Files are written directly to your WordPress root directory</li>
          <li>No FTP access required - everything is handled automatically</li>
          <li>Existing files will be overwritten</li>
        </ul>

        <div className={styles.warningBox}>
          <strong>⚠️ Important Notes:</strong>
          <ul>
            <li>
              Make sure your WordPress installation has write permissions to the
              root directory
            </li>
            <li>Always save your settings before deploying</li>
            <li>
              You can test the files after deployment by visiting the URLs above
            </li>
            <li>
              Some hosting providers may cache these files - changes might take
              a few minutes to appear
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SitemapRobots;
