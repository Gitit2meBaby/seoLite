// assets/js/components/tabs/TrackingTags.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import styles from "@css/components/tabs/GeneralMeta.module.scss";

const TrackingTags = ({ tabId, config }) => {
  console.log("🎯 TrackingTags component loading!", { tabId, config });

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

  // Tracking fields configuration
  const trackingFields = [
    // === GOOGLE SERVICES ===
    {
      section: "Google Services",
      fields: [
        {
          key: "google_analytics_id",
          label: "Google Analytics 4 ID",
          type: "text",
          placeholder: "G-XXXXXXXXXX",
          description:
            "Your Google Analytics 4 measurement ID (starts with G-)",
          pattern: "^G-[A-Z0-9]{10}$",
          helpText:
            "Find this in Google Analytics → Admin → Data Streams → Web → Measurement ID",
        },
        {
          key: "google_universal_analytics_id",
          label: "Universal Analytics ID (Legacy)",
          type: "text",
          placeholder: "UA-XXXXXXXX-X",
          description:
            "Legacy Universal Analytics tracking ID (deprecated July 2023)",
          pattern: "^UA-[0-9]+-[0-9]+$",
          helpText:
            "Universal Analytics stopped processing data in July 2023. Migrate to GA4.",
        },
        {
          key: "google_tag_manager_id",
          label: "Google Tag Manager ID",
          type: "text",
          placeholder: "GTM-XXXXXXX",
          description: "Google Tag Manager container ID",
          pattern: "^GTM-[A-Z0-9]{7}$",
          helpText:
            "Find this in Google Tag Manager → Admin → Container Settings",
        },
        {
          key: "google_site_verification",
          label: "Google Search Console Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz1234567890ABCD",
          description: "Google Search Console verification meta tag content",
          helpText:
            "Get this from Google Search Console → Settings → Ownership verification → HTML tag method",
        },
        {
          key: "google_adsense_id",
          label: "Google AdSense ID",
          type: "text",
          placeholder: "ca-pub-XXXXXXXXXXXXXXXX",
          description: "Google AdSense publisher ID",
          pattern: "^ca-pub-[0-9]{16}$",
          helpText:
            "Find this in Google AdSense → Account → Settings → Account information",
        },
        {
          key: "google_ads_conversion_id",
          label: "Google Ads Conversion ID",
          type: "text",
          placeholder: "AW-XXXXXXXXXX",
          description: "Google Ads conversion tracking ID",
          pattern: "^AW-[0-9]{10}$",
          helpText: "Find this in Google Ads → Tools & Settings → Conversions",
        },
      ],
    },

    // === MICROSOFT SERVICES ===
    {
      section: "Microsoft Services",
      fields: [
        {
          key: "bing_site_verification",
          label: "Bing Webmaster Tools Verification",
          type: "text",
          placeholder: "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456",
          description: "Bing Webmaster Tools verification meta tag content",
          helpText:
            "Get this from Bing Webmaster Tools → Settings → Verify your site → Meta tag option",
        },
        {
          key: "microsoft_clarity_id",
          label: "Microsoft Clarity ID",
          type: "text",
          placeholder: "abcdefghij",
          description:
            "Microsoft Clarity project ID for user behavior analytics",
          helpText:
            "Find this in Microsoft Clarity → Settings → Setup → Tracking code",
        },
        {
          key: "microsoft_ads_uet_id",
          label: "Microsoft Ads UET Tag ID",
          type: "text",
          placeholder: "12345678",
          description: "Microsoft Ads Universal Event Tracking tag ID",
          helpText: "Find this in Microsoft Ads → Tools → UET tags",
        },
      ],
    },

    // === SOCIAL MEDIA PLATFORMS ===
    {
      section: "Social Media Platforms",
      fields: [
        {
          key: "facebook_domain_verification",
          label: "Facebook Domain Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz1234567890",
          description: "Facebook domain verification meta tag content",
          helpText:
            "Get this from Facebook Business Manager → Brand Safety → Domains",
        },
        {
          key: "facebook_pixel_id",
          label: "Facebook Pixel ID",
          type: "text",
          placeholder: "123456789012345",
          description: "Facebook Pixel ID for conversion tracking",
          pattern: "^[0-9]{15}$",
          helpText:
            "Find this in Facebook Events Manager → Data Sources → Pixels",
        },
        {
          key: "twitter_site_verification",
          label: "Twitter/X Domain Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz1234567890",
          description: "Twitter/X domain verification meta tag content",
          helpText:
            "Used for Twitter/X domain verification and brand protection",
        },
        {
          key: "pinterest_site_verification",
          label: "Pinterest Domain Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz1234567890",
          description: "Pinterest domain verification meta tag content",
          helpText:
            "Get this from Pinterest Business → Settings → Claim website",
        },
        {
          key: "linkedin_partner_id",
          label: "LinkedIn Insight Tag Partner ID",
          type: "text",
          placeholder: "1234567",
          description:
            "LinkedIn Insight Tag partner ID for conversion tracking",
          helpText:
            "Find this in LinkedIn Campaign Manager → Account Assets → Insight Tag",
        },
        {
          key: "tiktok_pixel_id",
          label: "TikTok Pixel ID",
          type: "text",
          placeholder: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          description: "TikTok Pixel ID for advertising and analytics",
          helpText: "Find this in TikTok Ads Manager → Assets → Events",
        },
      ],
    },

    // === ANALYTICS & HEAT MAPPING ===
    {
      section: "Analytics & User Behavior",
      fields: [
        {
          key: "hotjar_site_id",
          label: "Hotjar Site ID",
          type: "text",
          placeholder: "1234567",
          description: "Hotjar site ID for heatmaps and user recordings",
          pattern: "^[0-9]+$",
          helpText: "Find this in Hotjar → Settings → Sites & Organizations",
        },
        {
          key: "mixpanel_token",
          label: "Mixpanel Project Token",
          type: "text",
          placeholder: "abcdef1234567890abcdef1234567890",
          description: "Mixpanel project token for event analytics",
          helpText: "Find this in Mixpanel → Settings → Project Settings",
        },
        {
          key: "segment_write_key",
          label: "Segment Write Key",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz1234567890ABCD",
          description: "Segment write key for customer data platform",
          helpText: "Find this in Segment → Settings → API Keys",
        },
        {
          key: "amplitude_api_key",
          label: "Amplitude API Key",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz123456",
          description: "Amplitude API key for product analytics",
          helpText: "Find this in Amplitude → Settings → Projects",
        },
        {
          key: "fullstory_org_id",
          label: "FullStory Organization ID",
          type: "text",
          placeholder: "XXXXX",
          description: "FullStory organization ID for user session recordings",
          helpText: "Find this in FullStory → Settings → FullStory Setup",
        },
      ],
    },

    // === OTHER VERIFICATION & TRACKING ===
    {
      section: "Other Platforms",
      fields: [
        {
          key: "yandex_verification",
          label: "Yandex Webmaster Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz123456",
          description: "Yandex Webmaster verification meta tag content",
          helpText: "Get this from Yandex Webmaster → Site verification",
        },
        {
          key: "baidu_site_verification",
          label: "Baidu Site Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz123456",
          description: "Baidu site verification meta tag content",
          helpText: "Used for Baidu search engine verification (China)",
        },
        {
          key: "alexa_verification",
          label: "Alexa Site Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz123456",
          description:
            "Alexa site verification (legacy - service discontinued)",
          helpText: "Alexa site verification service was discontinued in 2022",
        },
        {
          key: "ahrefs_site_verification",
          label: "Ahrefs Site Verification",
          type: "text",
          placeholder: "abcdefghijklmnopqrstuvwxyz123456",
          description: "Ahrefs Webmaster Tools verification",
          helpText: "Get this from Ahrefs Webmaster Tools → Site verification",
        },
      ],
    },

    // === CUSTOM SCRIPTS ===
    {
      section: "Custom Scripts",
      fields: [
        {
          key: "custom_head_scripts",
          label: "Custom Head Scripts",
          type: "textarea",
          placeholder: `<!-- Example: Custom tracking code -->
<script>
  // Your custom JavaScript here
  console.log('Custom tracking loaded');
</script>

<!-- Example: Third-party service -->
<script src="https://example.com/tracking.js"></script>`,
          description: "Custom scripts to inject into the <head> section",
          helpText:
            "Add any custom tracking codes, third-party scripts, or verification tags here. Be careful with untrusted code!",
          rows: 8,
          global: true, // Usually you want custom scripts to be global
        },
        {
          key: "custom_body_scripts",
          label: "Custom Body Scripts",
          type: "textarea",
          placeholder: `<!-- Example: Chat widget -->
<script>
  window.addEventListener('load', function() {
    // Scripts that should load after page content
  });
</script>`,
          description: "Custom scripts to inject at the end of <body> section",
          helpText:
            "Scripts here load after page content. Good for chat widgets, analytics that don't need to be in head, etc.",
          rows: 6,
          global: true,
        },
      ],
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

  const generateTrackingCode = () => {
    const pageSettings = settings[`page_${selectedPage}`] || {};
    const globalSettings = settings["page_global"] || {};

    const getValue = (key) => {
      if (pageSettings[key] !== undefined && pageSettings[key] !== "") {
        return pageSettings[key];
      }
      return globalSettings[key] || "";
    };

    let headCode = "";
    let bodyCode = "";

    // Google Analytics 4
    const ga4Id = getValue("google_analytics_id");
    if (ga4Id) {
      headCode += `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${ga4Id}');
</script>

`;
    }

    // Universal Analytics (Legacy)
    const uaId = getValue("google_universal_analytics_id");
    if (uaId) {
      headCode += `<!-- Universal Analytics (Legacy) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${uaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${uaId}');
</script>

`;
    }

    // Google Tag Manager
    const gtmId = getValue("google_tag_manager_id");
    if (gtmId) {
      headCode += `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>

`;

      bodyCode += `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

`;
    }

    // Verification Meta Tags
    const googleVerification = getValue("google_site_verification");
    if (googleVerification) {
      headCode += `<meta name="google-site-verification" content="${googleVerification}" />
`;
    }

    const bingVerification = getValue("bing_site_verification");
    if (bingVerification) {
      headCode += `<meta name="msvalidate.01" content="${bingVerification}" />
`;
    }

    const facebookVerification = getValue("facebook_domain_verification");
    if (facebookVerification) {
      headCode += `<meta name="facebook-domain-verification" content="${facebookVerification}" />
`;
    }

    const pinterestVerification = getValue("pinterest_site_verification");
    if (pinterestVerification) {
      headCode += `<meta name="p:domain_verify" content="${pinterestVerification}" />
`;
    }

    const yandexVerification = getValue("yandex_verification");
    if (yandexVerification) {
      headCode += `<meta name="yandex-verification" content="${yandexVerification}" />
`;
    }

    const baiduVerification = getValue("baidu_site_verification");
    if (baiduVerification) {
      headCode += `<meta name="baidu-site-verification" content="${baiduVerification}" />
`;
    }

    const ahrefsVerification = getValue("ahrefs_site_verification");
    if (ahrefsVerification) {
      headCode += `<meta name="ahrefs-site-verification" content="${ahrefsVerification}" />
`;
    }

    // Facebook Pixel
    const facebookPixel = getValue("facebook_pixel_id");
    if (facebookPixel) {
      headCode += `<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${facebookPixel}');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${facebookPixel}&ev=PageView&noscript=1"/>
</noscript>

`;
    }

    // Microsoft Clarity
    const clarityId = getValue("microsoft_clarity_id");
    if (clarityId) {
      headCode += `<!-- Microsoft Clarity -->
<script type="text/javascript">
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");
</script>

`;
    }

    // Hotjar
    const hotjarId = getValue("hotjar_site_id");
    if (hotjarId) {
      headCode += `<!-- Hotjar Tracking Code -->
<script>
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:${hotjarId},hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>

`;
    }

    // LinkedIn Insight Tag
    const linkedinId = getValue("linkedin_partner_id");
    if (linkedinId) {
      headCode += `<!-- LinkedIn Insight Tag -->
<script type="text/javascript">
_linkedin_partner_id = "${linkedinId}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script><script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=${linkedinId}&fmt=gif" />
</noscript>

`;
    }

    // Custom head scripts
    const customHead = getValue("custom_head_scripts");
    if (customHead) {
      headCode += `<!-- Custom Head Scripts -->
${customHead}

`;
    }

    // Custom body scripts
    const customBody = getValue("custom_body_scripts");
    if (customBody) {
      bodyCode += `<!-- Custom Body Scripts -->
${customBody}

`;
    }

    return {
      head: headCode || "<!-- No head tracking codes configured -->",
      body: bodyCode || "<!-- No body tracking codes configured -->",
    };
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
          {field.helpText && (
            <div
              style={{
                marginTop: "4px",
                padding: "8px",
                background: "#e7f3ff",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#0073aa",
              }}
            >
              💡 {field.helpText}
            </div>
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
              rows={field.rows || 3}
              style={{ fontFamily: "monospace", fontSize: "13px" }}
            />
          </div>
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
              pattern={field.pattern}
            />
          </div>
        )}

        {isUsingGlobal && (
          <div className={styles.usingGlobalNote}>
            This page will automatically use the global tracking code. Start
            typing to customize it specifically for this page.
          </div>
        )}

        {isUnique && (
          <div className={styles.uniqueNote}>
            This tracking code is customized specifically for this page.
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
          Configure tracking codes for:
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
              💡 This page inherits tracking codes from Global. Override any
              field to customize it specifically for this page. Most tracking
              codes should stay global unless you need different tracking for
              specific pages.
            </small>
          </div>
        )}
      </div>

      {/* Code Preview */}
      <div className={styles.previewSection}>
        <h4>Generated Tracking Code</h4>

        <div style={{ marginBottom: "1.5rem" }}>
          <h5 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
            📄 Head Section Code:
          </h5>
          <div className={styles.codePreview}>
            <pre className={styles.codeBlock}>
              <code>{generateTrackingCode().head}</code>
            </pre>
            <button
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(generateTrackingCode().head);
              }}
            >
              📋 Copy Head Code
            </button>
          </div>
        </div>

        <div>
          <h5 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
            🦶 Body Section Code:
          </h5>
          <div className={styles.codePreview}>
            <pre className={styles.codeBlock}>
              <code>{generateTrackingCode().body}</code>
            </pre>
            <button
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(generateTrackingCode().body);
              }}
            >
              📋 Copy Body Code
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#fff3cd",
            borderRadius: "4px",
          }}
        >
          <strong>⚠️ Important Notes:</strong>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
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

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#e7f3ff",
            borderRadius: "4px",
          }}
        >
          <strong>🔍 Testing Your Tracking Codes:</strong>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
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

      {/* Tracking Fields */}
      <div className={styles.fieldsContainer}>
        {trackingFields.map((section, sectionIndex) => (
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
          {isSaving ? "Saving..." : "Save Tracking Settings"}
        </button>

        {hasChanges && (
          <span className={styles.unsavedChanges}>
            You have unsaved changes
          </span>
        )}
      </div>

      {/* Tracking Summary */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: "4px",
          border: "1px solid #dee2e6",
        }}
      >
        <h4 style={{ margin: "0 0 1rem 0", color: "#495057" }}>
          📊 Current Tracking Summary
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {[
            { key: "google_analytics_id", label: "Google Analytics 4" },
            { key: "google_tag_manager_id", label: "Google Tag Manager" },
            { key: "facebook_pixel_id", label: "Facebook Pixel" },
            { key: "microsoft_clarity_id", label: "Microsoft Clarity" },
            { key: "hotjar_site_id", label: "Hotjar" },
            { key: "linkedin_partner_id", label: "LinkedIn Insight" },
          ].map(({ key, label }) => {
            const value = getFieldValue(key);
            const status = getFieldStatus(key);
            return (
              <div
                key={key}
                style={{
                  padding: "0.5rem",
                  background: value ? "#d4edda" : "#f8d7da",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <strong>{label}:</strong>{" "}
                {value ? (
                  <span style={{ color: "#155724" }}>
                    ✅ Active
                    {status === "using_global" && " (Global)"}
                    {status === "inherited" && " (Inherited)"}
                    {status === "unique" && " (Custom)"}
                  </span>
                ) : (
                  <span style={{ color: "#721c24" }}>❌ Not configured</span>
                )}
              </div>
            );
          })}
        </div>

        {getFieldValue("custom_head_scripts") && (
          <div
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem",
              background: "#fff3cd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <strong>Custom Head Scripts:</strong>{" "}
            <span style={{ color: "#856404" }}>
              ⚠️ Active (Review periodically)
            </span>
          </div>
        )}

        {getFieldValue("custom_body_scripts") && (
          <div
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem",
              background: "#fff3cd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <strong>Custom Body Scripts:</strong>{" "}
            <span style={{ color: "#856404" }}>
              ⚠️ Active (Review periodically)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingTags;
