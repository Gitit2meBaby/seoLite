// assets/js/components/tabs/ReviewPublish.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import { socialFields } from "./socialFields";
import { trackingFields } from "./trackingFields";
import styles from "@css/components/tabs/SocialMedia.module.scss";

const ReviewPublish = ({ tabId, config }) => {
  const {
    settings,
    loadPages,
    saveAllSettings,
    loadSettings,
    loadPageSettings,
  } = useSettings();
  const [selectedPage, setSelectedPage] = useState("global");
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showHeadSection, setShowHeadSection] = useState(true);
  const [showBodySection, setShowBodySection] = useState(false);
  const [showFooterSection, setShowFooterSection] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(true); // Assume changes until proven otherwise

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
  }, []);

  // Reload settings when component mounts or when page changes
  useEffect(() => {
    const reloadData = async () => {
      try {
        await loadSettings(); // Reload global settings
        if (selectedPage !== "global") {
          await loadPageSettings(selectedPage); // Reload page-specific settings
        }
      } catch (error) {
        console.error("Failed to reload settings:", error);
      }
    };

    reloadData();
  }, [selectedPage]); // Reload when selectedPage changes

  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setApiError(null);

    try {
      // Get WordPress data for API call
      const wpData = window.seoPluginData || {};
      const apiUrl = wpData.apiUrl;
      const nonce = wpData.nonce;

      if (!apiUrl || !nonce) {
        throw new Error("WordPress API configuration missing");
      }

      // Call a publish endpoint that will regenerate all meta tags
      const response = await fetch(`${apiUrl}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
        body: JSON.stringify({
          action: "publish_all_changes",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setPublishSuccess(true);
        setHasChanges(false);
        setTimeout(() => setPublishSuccess(false), 5000);
      } else {
        throw new Error(result.message || "Publish failed");
      }
    } catch (error) {
      console.error("Publish failed:", error);
      setApiError(`Failed to publish changes: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Get effective value (page overrides global)
  const getEffectiveValue = (fieldKey) => {
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

  // Generate all effective values for the selected page
  const getAllEffectiveValues = () => {
    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    const effectiveValues = {};

    // Get all possible field keys from all tabs
    const allFields = [
      ...socialFields.flatMap((section) => section.fields),
      ...trackingFields.flatMap((section) => section.fields),
    ];

    allFields.forEach((field) => {
      const value = getEffectiveValue(field.key);
      if (value) {
        effectiveValues[field.key] = value;

        // Also get script loading preference if this field has scripts
        const loadingValue = getEffectiveValue(`${field.key}_loading`);
        if (loadingValue) {
          effectiveValues[`${field.key}_loading`] = loadingValue;
        }
      }
    });

    // Also get meta fields - EXPANDED to include all General Meta fields
    [
      "meta_title",
      "meta_description",
      "meta_keywords",
      "canonical_url",
      "robots_meta",
      "meta_author",
      "meta_copyright",
      "charset",
      "viewport",
      "robots_index",
      "robots_follow",
      "robots_advanced",
      "hreflang",
      "refresh_redirect",
      "date_published",
      "date_modified",
      "theme_color",
      "generator",
    ].forEach((key) => {
      const value = getEffectiveValue(key);
      if (value) {
        effectiveValues[key] = value;
      }
    });

    // Get schemas
    if (pageSettings.schemas || globalSettings.schemas) {
      effectiveValues.schemas = [
        ...(globalSettings.schemas || []),
        ...(pageSettings.schemas || []),
      ];
    }

    // Get breadcrumb configuration
    if (globalSettings.breadcrumb_config) {
      effectiveValues.breadcrumb_config = globalSettings.breadcrumb_config;
    }

    return effectiveValues;
  };

  // Generate <head> section output
  const generateHeadOutput = () => {
    const values = getAllEffectiveValues();
    const output = [];

    console.log("🔍 Generating head output with values:", values);
    console.log("📊 Settings object:", settings);
    console.log("📄 Selected page:", selectedPage);

    // Helper function to generate script tag with loading attribute
    const getScriptAttr = (fieldKey) => {
      const loadingType = values[`${fieldKey}_loading`] || "async";
      if (loadingType === "default") {
        return ""; // No attribute = blocking/default behavior
      }
      return ` ${loadingType}`; // " async" or " defer"
    };

    output.push("<!-- SEO Lite Plugin Output -->");
    output.push("");

    // Check if we have any values at all
    const hasAnyValues = Object.keys(values).length > 0;

    if (!hasAnyValues) {
      output.push("<!-- No SEO settings configured yet -->");
      output.push(
        "<!-- Go to other tabs to configure meta tags, social media, tracking, and schemas -->",
      );
      return output.join("\n");
    }

    // Default WordPress/HTML5 meta tags (always present)
    output.push("<!-- Essential HTML5 Meta Tags -->");
    output.push('<meta charset="UTF-8" />');
    output.push(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    );
    output.push('<meta http-equiv="X-UA-Compatible" content="IE=edge" />');
    output.push("");

    // Basic Meta Tags
    if (values.meta_title) {
      output.push(`<title>${values.meta_title}</title>`);
    }
    if (values.meta_description) {
      output.push(
        `<meta name="description" content="${values.meta_description}" />`,
      );
    }
    if (values.meta_keywords) {
      output.push(`<meta name="keywords" content="${values.meta_keywords}" />`);
    }
    if (values.canonical_url) {
      output.push(`<link rel="canonical" href="${values.canonical_url}" />`);
    }
    if (values.robots_meta) {
      output.push(`<meta name="robots" content="${values.robots_meta}" />`);
    }
    if (values.meta_author) {
      output.push(`<meta name="author" content="${values.meta_author}" />`);
    }
    if (values.meta_copyright) {
      output.push(
        `<meta name="copyright" content="${values.meta_copyright}" />`,
      );
    }
    if (values.date_published) {
      output.push(
        `<meta name="article:published_time" content="${values.date_published}" />`,
      );
    }
    if (values.date_modified) {
      output.push(
        `<meta name="article:modified_time" content="${values.date_modified}" />`,
      );
    }
    if (values.theme_color) {
      output.push(
        `<meta name="theme-color" content="${values.theme_color}" />`,
      );
    }
    if (values.generator) {
      output.push(`<meta name="generator" content="${values.generator}" />`);
    }
    if (values.hreflang) {
      output.push(
        `<link rel="alternate" hreflang="${values.hreflang}" href="${values.canonical_url || ""}" />`,
      );
    }
    if (values.refresh_redirect) {
      output.push(
        `<meta http-equiv="refresh" content="${values.refresh_redirect}" />`,
      );
    }
    // Note: robots_index, robots_follow, robots_advanced are combined into robots_meta
    // charset and viewport are hardcoded in Essential HTML5 Meta Tags section above

    if (output.length > 2) output.push("");

    // Open Graph Tags
    const ogTags = [];
    if (values.og_title) {
      ogTags.push(`<meta property="og:title" content="${values.og_title}" />`);
    }
    if (values.og_description) {
      ogTags.push(
        `<meta property="og:description" content="${values.og_description}" />`,
      );
    }
    if (values.og_type) {
      ogTags.push(`<meta property="og:type" content="${values.og_type}" />`);
    }
    if (values.og_image) {
      ogTags.push(`<meta property="og:image" content="${values.og_image}" />`);
    }
    if (values.og_image_alt) {
      ogTags.push(
        `<meta property="og:image:alt" content="${values.og_image_alt}" />`,
      );
    }
    if (values.og_site_name) {
      ogTags.push(
        `<meta property="og:site_name" content="${values.og_site_name}" />`,
      );
    }
    if (values.og_locale) {
      ogTags.push(
        `<meta property="og:locale" content="${values.og_locale}" />`,
      );
    }

    if (ogTags.length > 0) {
      output.push("<!-- Open Graph / Facebook -->");
      output.push(...ogTags);
      output.push("");
    }

    // Twitter Card Tags
    const twitterTags = [];
    if (values.twitter_card_type) {
      twitterTags.push(
        `<meta name="twitter:card" content="${values.twitter_card_type}" />`,
      );
    }
    if (values.twitter_site) {
      twitterTags.push(
        `<meta name="twitter:site" content="${values.twitter_site}" />`,
      );
    }
    if (values.twitter_creator) {
      twitterTags.push(
        `<meta name="twitter:creator" content="${values.twitter_creator}" />`,
      );
    }
    if (values.twitter_title) {
      twitterTags.push(
        `<meta name="twitter:title" content="${values.twitter_title}" />`,
      );
    }
    if (values.twitter_description) {
      twitterTags.push(
        `<meta name="twitter:description" content="${values.twitter_description}" />`,
      );
    }
    if (values.twitter_image) {
      twitterTags.push(
        `<meta name="twitter:image" content="${values.twitter_image}" />`,
      );
    }

    if (twitterTags.length > 0) {
      output.push("<!-- Twitter -->");
      output.push(...twitterTags);
      output.push("");
    }

    // Facebook Specific
    if (values.fb_app_id) {
      output.push("<!-- Facebook -->");
      output.push(
        `<meta property="fb:app_id" content="${values.fb_app_id}" />`,
      );
      if (values.fb_admins) {
        output.push(
          `<meta property="fb:admins" content="${values.fb_admins}" />`,
        );
      }
      output.push("");
    }

    // Social profile URLs (these go in Organization schema, shown as comments for reference)
    const socialProfiles = [];
    if (values.social_facebook_url) {
      socialProfiles.push(
        `<!-- Facebook Profile: ${values.social_facebook_url} -->`,
      );
    }
    if (values.social_twitter_url) {
      socialProfiles.push(
        `<!-- Twitter Profile: ${values.social_twitter_url} -->`,
      );
    }
    if (values.social_instagram_url) {
      socialProfiles.push(
        `<!-- Instagram Profile: ${values.social_instagram_url} -->`,
      );
    }
    if (values.social_linkedin_url) {
      socialProfiles.push(
        `<!-- LinkedIn Profile: ${values.social_linkedin_url} -->`,
      );
    }
    if (values.social_youtube_url) {
      socialProfiles.push(
        `<!-- YouTube Profile: ${values.social_youtube_url} -->`,
      );
    }
    if (values.social_tiktok_url) {
      socialProfiles.push(
        `<!-- TikTok Profile: ${values.social_tiktok_url} -->`,
      );
    }

    if (socialProfiles.length > 0) {
      output.push("<!-- Social Media Profiles (used in schema) -->");
      output.push(...socialProfiles);
      output.push("");
    }

    // Default social images (used as fallbacks, shown as comments)
    if (values.social_default_image) {
      output.push(
        `<!-- Default Social Image: ${values.social_default_image} -->`,
      );
    }
    if (values.social_twitter_image) {
      output.push(
        `<!-- Twitter Default Image: ${values.social_twitter_image} -->`,
      );
      output.push("");
    }

    // Google Analytics 4
    if (values.google_analytics_id) {
      const scriptAttr = getScriptAttr("google_analytics_id");

      output.push("<!-- Google Analytics 4 -->");
      output.push(
        `<script${scriptAttr} src="https://www.googletagmanager.com/gtag/js?id=${values.google_analytics_id}"></script>`,
      );
      output.push("<script>");
      output.push("  window.dataLayer = window.dataLayer || [];");
      output.push("  function gtag(){dataLayer.push(arguments);}");
      output.push("  gtag('js', new Date());");
      output.push(`  gtag('config', '${values.google_analytics_id}');`);
      output.push("</script>");
      output.push("");
    }

    // Google Tag Manager (Head)
    if (values.google_tag_manager_id) {
      const scriptAttr = getScriptAttr("google_tag_manager_id");
      output.push("<!-- Google Tag Manager -->");

      output.push(
        `<script${scriptAttr}>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
      );
      output.push(
        "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],",
      );
      output.push(
        "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=",
      );
      output.push(
        `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
      );
      output.push(
        `})(window,document,'script','dataLayer','${values.google_tag_manager_id}');</script>`,
      );
      output.push("<!-- End Google Tag Manager -->");
      output.push("");
    }

    // Facebook Pixel
    if (values.facebook_pixel_id) {
      const scriptAttr = getScriptAttr("facebook_pixel_id");

      output.push("<!-- Facebook Pixel Code -->");
      output.push(`<script${scriptAttr}>`);
      output.push("!function(f,b,e,v,n,t,s)");
      output.push("{if(f.fbq)return;n=f.fbq=function(){n.callMethod?");
      output.push("n.callMethod.apply(n,arguments):n.queue.push(arguments)};");
      output.push("if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';");
      output.push("n.queue=[];t=b.createElement(e);t.async=!0;");
      output.push("t.src=v;s=b.getElementsByTagName(e)[0];");
      output.push("s.parentNode.insertBefore(t,s)}(window, document,'script',");
      output.push("'https://connect.facebook.net/en_US/fbevents.js');");
      output.push(`fbq('init', '${values.facebook_pixel_id}');`);
      output.push("fbq('track', 'PageView');");
      output.push("</script>");
      output.push(
        `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${values.facebook_pixel_id}&ev=PageView&noscript=1" /></noscript>`,
      );
      output.push("<!-- End Facebook Pixel Code -->");
      output.push("");
    }

    // Microsoft Clarity
    if (values.microsoft_clarity_id) {
      const scriptAttr = getScriptAttr("microsoft_clarity_id");

      output.push("<!-- Microsoft Clarity -->");
      output.push(`<script${scriptAttr} type="text/javascript">`);
      output.push("  (function(c,l,a,r,i,t,y){");
      output.push(
        "    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};",
      );
      output.push(
        '    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;',
      );
      output.push(
        "    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);",
      );
      output.push(
        `  })(window, document, "clarity", "script", "${values.microsoft_clarity_id}");`,
      );
      output.push("</script$>");
      output.push("<!-- End Microsoft Clarity -->");
      output.push("");
    }

    // LinkedIn Insight Tag
    if (values.linkedin_partner_id) {
      const scriptAttr = getScriptAttr("linkedin_partner_id");

      output.push("<!-- LinkedIn Insight Tag -->");
      output.push(`<script${scriptAttr} type="text/javascript">`);
      output.push(
        '_linkedin_partner_id = "' + values.linkedin_partner_id + '";',
      );
      output.push(
        "window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];",
      );
      output.push(
        "window._linkedin_data_partner_ids.push(_linkedin_partner_id);",
      );
      output.push('</script><script type="text/javascript">');
      output.push("(function(l) {");
      output.push(
        "if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};",
      );
      output.push("window.lintrk.q=[]}");
      output.push('var s = document.getElementsByTagName("script")[0];');
      output.push('var b = document.createElement("script");');
      output.push('b.type = "text/javascript";b.async = true;');
      output.push(
        'b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";',
      );
      output.push("s.parentNode.insertBefore(b, s);})(window.lintrk);");
      output.push("</script>");
      output.push("<noscript>");
      output.push(
        `<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=${values.linkedin_partner_id}&fmt=gif" />`,
      );
      output.push("</noscript>");
      output.push("<!-- End LinkedIn Insight Tag -->");
      output.push("");
    }

    // JSON-LD Schemas
    if (values.schemas && values.schemas.length > 0) {
      output.push("<!-- Structured Data (JSON-LD) -->");
      output.push('<script async type="application/ld+json">');

      // Import schema builders to generate proper JSON with @type
      const builtSchemas = values.schemas
        .map((schema) => {
          // Each schema has: { id, type, data }
          // We need to build the proper JSON using the type
          // For now, just ensure we have @type in the data
          if (schema.data && !schema.data["@type"] && schema.type) {
            // Add @type based on schema type
            return {
              "@type": schema.type,
              ...schema.data,
            };
          }
          return schema.data;
        })
        .filter(Boolean);

      output.push(
        JSON.stringify(
          {
            "@context": "https://schema.org",
            "@graph": builtSchemas,
          },
          null,
          2,
        ),
      );
      output.push("</script>");
      output.push("");
    }

    // Breadcrumbs JSON-LD
    if (values.breadcrumb_config && values.breadcrumb_config.enabled) {
      const wpData = window.seoPluginData || {};
      const siteUrl = wpData.siteUrl || window.location.origin;
      const siteName = wpData.siteName || "Home";

      // Generate breadcrumb path for the selected page
      const breadcrumbItems = [];

      // Always start with home
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 1,
        name: values.breadcrumb_config.homeText || siteName,
        item: siteUrl,
      });

      // If not on global/home, add the current page
      if (selectedPage !== "global") {
        const currentPage = pages.find((p) => p.id === selectedPage);
        if (currentPage) {
          breadcrumbItems.push({
            "@type": "ListItem",
            position: 2,
            name: currentPage.title,
            item: currentPage.url || `${siteUrl}/${currentPage.slug || ""}`,
          });
        }
      }

      if (breadcrumbItems.length > 1) {
        output.push("<!-- Breadcrumb Navigation (JSON-LD) -->");
        output.push('<script async type="application/ld+json">');
        output.push(
          JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbItems,
            },
            null,
            2,
          ),
        );
        output.push("</script>");
        output.push("");
      }
    }

    return output.join("\n");
  };

  // Generate <body> section output (opening body tag content)
  const generateBodyOutput = () => {
    const values = getAllEffectiveValues();
    const output = [];

    // Google Tag Manager (Body - noscript)
    if (values.google_tag_manager_id) {
      output.push("<!-- Google Tag Manager (noscript) -->");
      output.push(
        `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${values.google_tag_manager_id}"`,
      );
      output.push(
        'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>',
      );
      output.push("<!-- End Google Tag Manager (noscript) -->");
    }

    return output.join("\n");
  };

  // Generate footer section output
  const generateFooterOutput = () => {
    const values = getAllEffectiveValues();
    const output = [];

    // Custom footer scripts
    if (values.custom_footer_code) {
      output.push("<!-- Custom Footer Code -->");
      output.push(values.custom_footer_code);
      output.push("");
    }

    // Breadcrumb visual HTML (if you want to show the actual visible breadcrumbs)
    if (values.breadcrumb_config && values.breadcrumb_config.enabled) {
      const separator = values.breadcrumb_config.separator || "/";
      const wpData = window.seoPluginData || {};
      const siteUrl = wpData.siteUrl || window.location.origin;
      const siteName = wpData.siteName || "Home";

      if (selectedPage !== "global") {
        const currentPage = pages.find((p) => p.id === selectedPage);
        if (currentPage) {
          output.push(
            "<!-- Breadcrumb Navigation HTML (optional visible breadcrumbs) -->",
          );
          output.push(
            '<nav aria-label="Breadcrumb" class="breadcrumb-navigation">',
          );
          output.push("  <ol>");
          output.push(
            `    <li><a href="${siteUrl}">${values.breadcrumb_config.homeText || siteName}</a></li>`,
          );
          output.push(
            `    <li aria-current="page">${separator} ${currentPage.title}</li>`,
          );
          output.push("  </ol>");
          output.push("</nav>");
        }
      }
    }

    return output.join("\n");
  };

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading preview..." />;
  }

  const currentPageInfo = pages.find((p) => p.id === selectedPage);

  return (
    <div className={styles.socialMedia}>
      {/* Info Section */}
      <div
        className={styles.pageSelector}
        style={{
          background: "#e3f2fd",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem" }}>
          📋 Review & Publish Your SEO Configuration
        </h3>
        <p style={{ margin: "0 0 0.75rem 0", lineHeight: "1.6" }}>
          This page shows exactly what will be added to your website's HTML.
          Review the output below to verify everything is configured correctly,
          then click <strong>Publish All Changes</strong> at the bottom to make
          it live.
        </p>
        <p style={{ margin: 0, lineHeight: "1.6", fontWeight: 500 }}>
          💡 The preview combines all your settings: meta tags, social media,
          tracking codes, and schemas. Page-specific settings override global
          settings.
        </p>
      </div>

      {/* Page Selector */}
      <div className={styles.pageSelector}>
        <label className={styles.selectorLabel}>Preview output for:</label>
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

        {selectedPage !== "global" && currentPageInfo && (
          <div
            className={styles.inheritanceInfo}
            style={{ marginTop: "0.75rem" }}
          >
            <small>
              🔗 <strong>Viewing:</strong> {currentPageInfo.title}
              {currentPageInfo.url && ` (${currentPageInfo.url})`}
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

      {/* HEAD Section */}
      <div style={{ marginTop: "2rem" }}>
        <div className={styles.section}>
          <button
            className={`${styles.sectionHeader} ${
              showHeadSection ? styles.expanded : ""
            }`}
            onClick={() => setShowHeadSection(!showHeadSection)}
            type="button"
          >
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>
                {showHeadSection ? "▼" : "▶"}
              </span>
              <h3>&lt;head&gt; Section Output</h3>
            </div>
            <div className={styles.sectionCount}>
              Meta tags, scripts, schemas
            </div>
          </button>

          {showHeadSection && (
            <div className={styles.sectionContent}>
              <label className={styles.selectorLabel}>
                Code injected in &lt;head&gt; section:
              </label>
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
                {generateHeadOutput() ||
                  "<!-- No head content configured yet -->"}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* BODY Section */}
      <div style={{ marginTop: "1rem" }}>
        <div className={styles.section}>
          <button
            className={`${styles.sectionHeader} ${
              showBodySection ? styles.expanded : ""
            }`}
            onClick={() => setShowBodySection(!showBodySection)}
            type="button"
          >
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>
                {showBodySection ? "▼" : "▶"}
              </span>
              <h3>&lt;body&gt; Section Output</h3>
            </div>
            <div className={styles.sectionCount}>
              Scripts that run after body opens
            </div>
          </button>

          {showBodySection && (
            <div className={styles.sectionContent}>
              <label className={styles.selectorLabel}>
                Code injected at start of &lt;body&gt;:
              </label>
              <pre
                style={{
                  background: "#282c34",
                  color: "#abb2bf",
                  padding: "1rem",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  maxHeight: "400px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {generateBodyOutput() ||
                  "<!-- No body content configured yet -->"}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER Section */}
      <div style={{ marginTop: "1rem" }}>
        <div className={styles.section}>
          <button
            className={`${styles.sectionHeader} ${
              showFooterSection ? styles.expanded : ""
            }`}
            onClick={() => setShowFooterSection(!showFooterSection)}
            type="button"
          >
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>
                {showFooterSection ? "▼" : "▶"}
              </span>
              <h3>Footer Section Output</h3>
            </div>
            <div className={styles.sectionCount}>
              Scripts before closing &lt;/body&gt;
            </div>
          </button>

          {showFooterSection && (
            <div className={styles.sectionContent}>
              <label className={styles.selectorLabel}>
                Code injected before &lt;/body&gt; closes:
              </label>
              <pre
                style={{
                  background: "#282c34",
                  color: "#abb2bf",
                  padding: "1rem",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "0.85rem",
                  lineHeight: "1.4",
                  maxHeight: "400px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {generateFooterOutput() ||
                  "<!-- No footer content configured yet -->"}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Publish Section */}
      <div
        className={styles.saveSection}
        style={{
          marginTop: "2rem",
          paddingTop: "2rem",
          borderTop: "2px solid #ddd",
        }}
      >
        {/* Success Alert */}
        {publishSuccess && (
          <div
            style={{
              padding: "1rem",
              background: "#d4edda",
              borderRadius: "4px",
              marginBottom: "1.5rem",
              border: "2px solid #28a745",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "1.1rem",
                color: "#155724",
                textAlign: "center",
              }}
            >
              ✅ <strong>Changes Published Successfully!</strong> Your SEO
              updates are now live on your website.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {apiError && (
          <div
            style={{
              padding: "1rem",
              background: "#f8d7da",
              borderRadius: "4px",
              marginBottom: "1.5rem",
              border: "2px solid #dc3545",
            }}
          >
            <p style={{ margin: 0, fontSize: "1rem", color: "#721c24" }}>
              ❌ {apiError}
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          {hasChanges ? (
            <div
              style={{
                padding: "1rem",
                background: "#fff3cd",
                borderRadius: "4px",
                marginBottom: "1.5rem",
                border: "1px solid #ffc107",
              }}
            >
              <p style={{ margin: 0, fontSize: "1rem", color: "#856404" }}>
                ⚠️ <strong>Review your changes above</strong>
              </p>
              <p
                style={{
                  margin: "0.5rem 0 0 0",
                  fontSize: "0.9rem",
                  color: "#856404",
                }}
              >
                When you're ready, click the Publish button below to make all
                changes live on your website.
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: "1rem",
                background: "#d4edda",
                borderRadius: "4px",
                marginBottom: "1.5rem",
                border: "1px solid #28a745",
              }}
            >
              <p style={{ margin: 0, fontSize: "1rem", color: "#155724" }}>
                ✅ <strong>All changes are live</strong> - Your website is up to
                date
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            className={`${styles.saveButton} ${hasChanges ? styles.hasChanges : ""}`}
            onClick={handlePublish}
            disabled={isPublishing || !hasChanges}
            style={{
              fontSize: "1.1rem",
              padding: "1rem 3rem",
              background: hasChanges ? "#28a745" : "#6c757d",
              cursor: hasChanges ? "pointer" : "not-allowed",
            }}
          >
            {isPublishing
              ? "🔄 Publishing..."
              : hasChanges
                ? "🚀 Publish All Changes"
                : "✅ Everything Published"}
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: "0.9rem",
            margin: "1rem 0 0 0",
          }}
        >
          Publishing will apply all saved settings from Essential Meta Tags,
          Social Media, Analytics & Tracking, and Schema Markup tabs to your
          live website.
        </p>
      </div>
    </div>
  );
};

export default ReviewPublish;
