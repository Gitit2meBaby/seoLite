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
  const [showRobotsAdvanced, setShowRobotsAdvanced] = useState(false);
  const [showVideoSection, setShowVideoSection] = useState(false);
  const [videos, setVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

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

  // Predefined robots.txt rules that users can add
  const robotsRules = {
    searchEngines: [
      { label: "Block Googlebot", rule: "User-agent: Googlebot\nDisallow: /" },
      { label: "Block Bingbot", rule: "User-agent: Bingbot\nDisallow: /" },
      { label: "Block Yandex", rule: "User-agent: Yandex\nDisallow: /" },
      {
        label: "Block Baiduspider",
        rule: "User-agent: Baiduspider\nDisallow: /",
      },
      {
        label: "Block DuckDuckBot",
        rule: "User-agent: DuckDuckBot\nDisallow: /",
      },
      { label: "Block all crawlers", rule: "User-agent: *\nDisallow: /" },
    ],
    fileTypes: [
      { label: "Block PDF files", rule: "User-agent: *\nDisallow: /*.pdf$" },
      { label: "Block ZIP files", rule: "User-agent: *\nDisallow: /*.zip$" },
      {
        label: "Block DOC/DOCX files",
        rule: "User-agent: *\nDisallow: /*.doc$\nDisallow: /*.docx$",
      },
      {
        label: "Block Excel files",
        rule: "User-agent: *\nDisallow: /*.xls$\nDisallow: /*.xlsx$",
      },
      {
        label: "Block all downloads",
        rule: "User-agent: *\nDisallow: /downloads/",
      },
    ],
    commonPatterns: [
      {
        label: "Block search results",
        rule: "User-agent: *\nDisallow: /*?s=\nDisallow: /search/",
      },
      {
        label: "Block WordPress feeds",
        rule: "User-agent: *\nDisallow: /feed/\nDisallow: /*/feed/",
      },
      {
        label: "Block WordPress trackbacks",
        rule: "User-agent: *\nDisallow: /trackback/\nDisallow: /*/trackback/",
      },
      {
        label: "Block WordPress comments",
        rule: "User-agent: *\nDisallow: /comments/\nDisallow: /*/comments/",
      },
      {
        label: "Block author pages",
        rule: "User-agent: *\nDisallow: /author/",
      },
      {
        label: "Block category pages",
        rule: "User-agent: *\nDisallow: /category/",
      },
      { label: "Block tag pages", rule: "User-agent: *\nDisallow: /tag/" },
      {
        label: "Block WordPress cron",
        rule: "User-agent: *\nDisallow: /wp-cron.php",
      },
      {
        label: "Add crawl delay (1 second)",
        rule: "User-agent: *\nCrawl-delay: 1",
      },
      {
        label: "Add crawl delay (5 seconds)",
        rule: "User-agent: *\nCrawl-delay: 5",
      },
      { label: "Block query strings", rule: "User-agent: *\nDisallow: /*?" },
    ],
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoadingPages(true);

      // Load pages for sitemap
      const fetchedPages = await loadPages();
      if (fetchedPages && fetchedPages.length > 0) {
        console.log("Raw pages data:", fetchedPages);
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
              index === self.findIndex((p) => p.url === page.url),
          );

        console.log("Final sitemap data:", initialSitemap);
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
      page.id === pageId ? { ...page, [field]: value } : page,
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
      // Save sitemap, videos, and robots.txt settings to global
      const settings = {
        sitemap_data: sitemap,
        video_data: videos,
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

      const videoSitemapXML = generateVideoSitemapXML();

      const deployData = {
        sitemap_xml: sitemapPreview,
        video_sitemap_xml: videoSitemapXML,
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

  // Function to add a robots.txt rule
  const addRobotsRule = (rule) => {
    const newContent = `${robotsTxt}\n\n# Added rule\n${rule}`;
    setRobotsTxt(newContent);
    setHasChanges(true);
  };

  // Function to detect videos from WordPress
  const detectVideos = async () => {
    setIsLoadingVideos(true);
    try {
      // Fetch videos from WordPress media library and embeds
      const response = await fetch(`${apiUrl}detect-videos`, {
        method: "GET",
        headers: {
          "X-WP-Nonce": nonce,
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        const detectedVideos = result.data.map((video, index) => ({
          id: video.id || `video-${index}`,
          title: video.title || "",
          description: video.description || "",
          content_loc: video.url || "",
          thumbnail_loc: video.thumbnail || "",
          duration: video.duration || "",
          publication_date: video.date || new Date().toISOString(),
          included: true,
          source: video.source || "unknown", // 'media', 'youtube', 'vimeo'
        }));

        setVideos(detectedVideos);
      } else {
        console.error("Failed to detect videos:", result.message);
      }
    } catch (error) {
      console.error("Error detecting videos:", error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  // Update video data
  const handleVideoChange = (videoId, field, value) => {
    const updatedVideos = videos.map((video) =>
      video.id === videoId ? { ...video, [field]: value } : video,
    );
    setVideos(updatedVideos);
    setHasChanges(true);
  };

  // Generate video sitemap XML
  const generateVideoSitemapXML = () => {
    if (videos.length === 0) return "";

    const includedVideos = videos.filter((v) => v.included);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

    includedVideos.forEach((video) => {
      xml += `
  <url>
    <loc>${video.content_loc}</loc>
    <video:video>
      <video:thumbnail_loc>${video.thumbnail_loc}</video:thumbnail_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
      <video:content_loc>${video.content_loc}</video:content_loc>${
        video.duration
          ? `\n      <video:duration>${video.duration}</video:duration>`
          : ""
      }
      <video:publication_date>${video.publication_date}</video:publication_date>
    </video:video>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
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
            <span className={styles.alertText}>
              Settings saved successfully!
            </span>
            <button
              className={styles.alertClose}
              onClick={() => setShowSaveAlert(false)}
            >
              X
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
                <span className={styles.alertText}>Deploying files...</span>
              </>
            )}
            {deploymentStatus === "success" && (
              <>
                <span className={styles.alertText}>
                  Files deployed successfully! Your sitemap.xml and robots.txt
                  are now live.
                </span>
              </>
            )}
            {deploymentStatus === "error" && (
              <>
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
          <h3>XML Sitemap</h3>
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
              {isLoadingSitemap ? "Refreshing..." : "Refresh Pages"}
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
                    ? "Home"
                    : page.type === "page"
                      ? "Page"
                      : page.type === "post"
                        ? "Post"
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
        <h4>Generated Sitemap XML</h4>
        <div className={styles.codePreview}>
          <pre className={styles.codeBlock}>
            <code>{sitemapPreview}</code>
          </pre>
          <button
            className={styles.copyButton}
            onClick={() => navigator.clipboard.writeText(sitemapPreview)}
          >
            Copy XML
          </button>
        </div>
      </div>

      {/* Robots.txt Section */}
      <div className={styles.fieldsContainer} style={{ marginTop: "3rem" }}>
        <div className={styles.sectionHeader}>
          <h3>Robots.txt</h3>
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

        {/* Advanced Robots.txt Options */}
        <div className={styles.advancedSection}>
          <button
            className={styles.advancedToggle}
            onClick={() => setShowRobotsAdvanced(!showRobotsAdvanced)}
          >
            {showRobotsAdvanced ? "▼" : "►"} Advanced Options - Add Predefined
            Rules
          </button>

          {showRobotsAdvanced && (
            <div className={styles.advancedContent}>
              <p className={styles.advancedDescription}>
                Click any rule below to add it to your robots.txt file. You can
                then edit it in the textarea above.
              </p>

              {/* Block Search Engines */}
              <div className={styles.ruleCategory}>
                <h5>🔍 Block Search Engines</h5>
                <div className={styles.ruleButtons}>
                  {robotsRules.searchEngines.map((item, index) => (
                    <button
                      key={index}
                      className={styles.ruleButton}
                      onClick={() => addRobotsRule(item.rule)}
                      title={item.rule}
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Block File Types */}
              <div className={styles.ruleCategory}>
                <h5>📁 Block File Types</h5>
                <div className={styles.ruleButtons}>
                  {robotsRules.fileTypes.map((item, index) => (
                    <button
                      key={index}
                      className={styles.ruleButton}
                      onClick={() => addRobotsRule(item.rule)}
                      title={item.rule}
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Patterns */}
              <div className={styles.ruleCategory}>
                <h5>⚙️ Common Patterns</h5>
                <div className={styles.ruleButtons}>
                  {robotsRules.commonPatterns.map((item, index) => (
                    <button
                      key={index}
                      className={styles.ruleButton}
                      onClick={() => addRobotsRule(item.rule)}
                      title={item.rule}
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.robotsPreview}>
          <h4>Current robots.txt URL</h4>
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

      {/* Video Sitemap Section */}
      <div className={styles.fieldsContainer} style={{ marginTop: "3rem" }}>
        <div className={styles.sectionHeader}>
          <h3>🎥 Video Sitemap (Optional)</h3>
          <p>
            Add videos to your sitemap to help search engines discover and index
            video content on your site. This will create a separate video
            sitemap that complements your main sitemap.
          </p>
          <div className={styles.sectionActions}>
            <button
              className={styles.advancedToggle}
              onClick={() => setShowVideoSection(!showVideoSection)}
            >
              {showVideoSection
                ? "▼ Hide Video Sitemap"
                : "► Show Video Sitemap"}
            </button>
          </div>
        </div>

        {showVideoSection && (
          <>
            <div className={styles.videoDetection}>
              <button
                className={styles.detectButton}
                onClick={detectVideos}
                disabled={isLoadingVideos}
              >
                {isLoadingVideos
                  ? "🔍 Detecting..."
                  : "🔍 Detect Videos from Site"}
              </button>
              <p className={styles.detectDescription}>
                This will scan your WordPress media library and post content for
                YouTube/Vimeo embeds.
              </p>
            </div>

            {videos.length > 0 && (
              <>
                <div className={styles.videoStats}>
                  <strong>Detected Videos:</strong>
                  <span>Total: {videos.length}</span>
                  <span>
                    Included: {videos.filter((v) => v.included).length}
                  </span>
                  <span>
                    Media Library:{" "}
                    {videos.filter((v) => v.source === "media").length}
                  </span>
                  <span>
                    YouTube:{" "}
                    {videos.filter((v) => v.source === "youtube").length}
                  </span>
                  <span>
                    Vimeo: {videos.filter((v) => v.source === "vimeo").length}
                  </span>
                </div>

                <div className={styles.videoTable}>
                  <div className={styles.videoTableHeader}>
                    <div>Include</div>
                    <div>Title</div>
                    <div>Description</div>
                    <div>Duration (sec)</div>
                    <div>Source</div>
                  </div>

                  {videos.map((video) => (
                    <div key={video.id} className={styles.videoRow}>
                      <div>
                        <input
                          type="checkbox"
                          checked={video.included}
                          onChange={(e) =>
                            handleVideoChange(
                              video.id,
                              "included",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) =>
                            handleVideoChange(video.id, "title", e.target.value)
                          }
                          placeholder="Video title"
                          className={styles.videoInput}
                          disabled={!video.included}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={video.description}
                          onChange={(e) =>
                            handleVideoChange(
                              video.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Video description"
                          className={styles.videoInput}
                          disabled={!video.included}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={video.duration}
                          onChange={(e) =>
                            handleVideoChange(
                              video.id,
                              "duration",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. 120"
                          className={styles.videoInput}
                          disabled={!video.included}
                        />
                      </div>
                      <div>
                        <span
                          className={styles.videoSource}
                          data-source={video.source}
                        >
                          {video.source === "media"
                            ? "📹 Media"
                            : video.source === "youtube"
                              ? "▶️ YouTube"
                              : video.source === "vimeo"
                                ? "🎬 Vimeo"
                                : "❓"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.videoPreview}>
                  <h4>📄 Generated Video Sitemap XML</h4>
                  <div className={styles.codePreview}>
                    <pre className={styles.codeBlock}>
                      <code>{generateVideoSitemapXML()}</code>
                    </pre>
                    <button
                      className={styles.copyButton}
                      onClick={() =>
                        navigator.clipboard.writeText(generateVideoSitemapXML())
                      }
                    >
                      📋 Copy XML
                    </button>
                  </div>
                </div>
              </>
            )}

            {videos.length === 0 && !isLoadingVideos && (
              <div className={styles.noVideos}>
                <p>
                  No videos detected yet. Click "Detect Videos from Site" to
                  scan your content.
                </p>
              </div>
            )}
          </>
        )}
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
            ? "Deploying..."
            : "Deploy Files to Website"}
        </button>

        {hasChanges && (
          <span className={styles.unsavedChanges}>
            You have unsaved changes. Save before deploying.
          </span>
        )}
      </div>

      {/* Help Section */}
      <div className={styles.helpSection}>
        <h4>What happens when you deploy?</h4>
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
          <strong>Important Notes:</strong>
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
