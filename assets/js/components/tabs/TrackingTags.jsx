// assets/js/components/tabs/TrackingTags.jsx
import { useState, useEffect, useRef } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import Tooltip from "../schemaTypes/Tooltip";
import styles from "@css/components/tabs/SocialMedia.module.scss";
import { trackingFields } from "./trackingFields";
import ReviewPublishButton from "../common/ReviewPublishButton";

const TrackingTags = ({ tabId, config, onNavigate }) => {
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
    "Google Services": true, // Open by default
    "Social Media Platforms": false,
    "Analytics & Heatmaps": false,
    "Search Console Verification": false,
    "Custom Tracking Codes": false,
  });

  // State to track which field's script loading options are visible
  const [expandedScriptOptions, setExpandedScriptOptions] = useState(null);

  // Ref for click-outside detection
  const scriptOptionsRef = useRef(null);

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

  // Click outside to close script options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        scriptOptionsRef.current &&
        !scriptOptionsRef.current.contains(event.target)
      ) {
        setExpandedScriptOptions(null);
      }
    };

    if (expandedScriptOptions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [expandedScriptOptions]);

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

  const toggleScriptOptions = (fieldKey) => {
    setExpandedScriptOptions(
      expandedScriptOptions === fieldKey ? null : fieldKey,
    );
  };

  const getLoadingTypeDisplay = (fieldKey) => {
    const loadingType = getFieldValue(`${fieldKey}_loading`) || "async";
    const displayMap = {
      async: { label: "async", color: "#28a745" },
      defer: { label: "defer", color: "#ffc107" },
      default: { label: "blocking", color: "#dc3545" },
    };
    return displayMap[loadingType] || displayMap.async;
  };

  const renderField = (field) => {
    const currentValue = getFieldValue(field.key);
    const fieldStatus = getFieldStatus(field.key);
    const isInherited = fieldStatus === "inherited";
    const isUsingGlobal = fieldStatus === "using_global";
    const isUnique = fieldStatus === "unique";

    const currentPage = pages.find((p) => p.id === selectedPage);
    const pageSlug = currentPage?.title || selectedPage;

    const isScriptOptionsExpanded = expandedScriptOptions === field.key;
    const loadingDisplay = getLoadingTypeDisplay(field.key);

    return (
      <div key={field.key} className={styles.field}>
        <label className={styles.label} htmlFor={field.key}>
          {field.label}
          {field.tooltip && <Tooltip text={field.tooltip} />}
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
          <textarea
            id={field.key}
            className={`${styles.textarea} ${
              isUsingGlobal ? styles.usingGlobal : ""
            } ${isInherited ? styles.inherited : ""}`}
            value={currentValue}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            onFocus={() => setExpandedScriptOptions(null)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
          />
        ) : (
          <>
            <input
              id={field.key}
              type={field.type}
              className={`${styles.input} ${
                isUsingGlobal ? styles.usingGlobal : ""
              } ${isInherited ? styles.inherited : ""}`}
              value={currentValue}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              onFocus={() => setExpandedScriptOptions(null)}
              placeholder={field.placeholder}
              pattern={field.pattern}
            />

            {/* Script Loading Control - Collapsible */}
            {field.hasScript && currentValue && (
              <div
                className={styles.scriptLoadingControl}
                ref={isScriptOptionsExpanded ? scriptOptionsRef : null}
                style={{
                  position: "relative",
                  zIndex: isScriptOptionsExpanded ? 1000 : 1,
                }}
              >
                {/* Compact Button - Shows current selection */}
                <button
                  type="button"
                  className={styles.scriptLoadingButton}
                  onClick={() => toggleScriptOptions(field.key)}
                  style={{ borderColor: loadingDisplay.color }}
                >
                  <span className={styles.buttonLabel}>Script loading:</span>
                  <span
                    className={styles.buttonValue}
                    style={{ color: loadingDisplay.color }}
                  >
                    {loadingDisplay.label}
                  </span>
                  <span className={styles.buttonIcon}>
                    {isScriptOptionsExpanded ? "close" : "change"}
                  </span>
                  {field.scriptLoadingOptions?.tooltip && (
                    <Tooltip text={field.scriptLoadingOptions.tooltip} />
                  )}
                </button>

                {/* Expanded Radio Options */}
                {isScriptOptionsExpanded && (
                  <div className={styles.radioGroup}>
                    {/* Close button */}
                    <button
                      type="button"
                      className={styles.closeButton}
                      onClick={() => setExpandedScriptOptions(null)}
                      aria-label="Close script loading options"
                    >
                      âœ•
                    </button>

                    {/* Async Option */}
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name={`${field.key}_loading`}
                        value="async"
                        checked={
                          getFieldValue(`${field.key}_loading`) === "async" ||
                          !getFieldValue(`${field.key}_loading`)
                        }
                        onChange={() => {
                          handleFieldChange(`${field.key}_loading`, "async");
                          setExpandedScriptOptions(null);
                        }}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioLabel}>
                        <span className={styles.radioText}>async</span>
                        <span className={styles.radioDescription}>
                          Recommended - Loads in parallel, executes ASAP
                        </span>
                      </span>
                      <Tooltip text="Script downloads in parallel with page parsing and executes as soon as it's available. Best for independent analytics scripts that don't rely on other scripts or DOM elements. Recommended for Google Analytics, Facebook Pixel, and most tracking codes." />
                    </label>

                    {/* Defer Option */}
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name={`${field.key}_loading`}
                        value="defer"
                        checked={
                          getFieldValue(`${field.key}_loading`) === "defer"
                        }
                        onChange={() => {
                          handleFieldChange(`${field.key}_loading`, "defer");
                          setExpandedScriptOptions(null);
                        }}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioLabel}>
                        <span className={styles.radioText}>defer</span>
                        <span className={styles.radioDescription}>
                          Loads in parallel, executes after DOM ready
                        </span>
                      </span>
                      <Tooltip text="Script downloads in parallel but waits to execute until the entire HTML document has been parsed. Use this if the script needs to access DOM elements or depends on other scripts loading in order. Good for Google Tag Manager if it manipulates the DOM." />
                    </label>

                    {/* Default/Blocking Option */}
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name={`${field.key}_loading`}
                        value="default"
                        checked={
                          getFieldValue(`${field.key}_loading`) === "default"
                        }
                        onChange={() => {
                          handleFieldChange(`${field.key}_loading`, "default");
                          setExpandedScriptOptions(null);
                        }}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioLabel}>
                        <span className={styles.radioText}>blocking</span>
                        <span className={styles.radioDescription}>
                          Not recommended - Blocks page rendering
                        </span>
                      </span>
                      <Tooltip text="Script loads and executes immediately, blocking the page from continuing to parse until it's done. This hurts page performance and Core Web Vitals scores. Only use if absolutely required for critical functionality that must execute before page render." />
                    </label>
                  </div>
                )}
              </div>
            )}
          </>
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
            <span className={styles.sectionIcon}>{isExpanded ? "▼" : "▶"}</span>
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

  /**
   * Generate preview HTML for all tracking codes
   * This mimics exactly what the PHP output_tracking_codes_head() function does
   */
  const generateTrackingPreview = () => {
    const headScripts = [];
    const bodyScripts = [];
    const footerScripts = [];

    // Helper to get script loading attribute
    const getLoadingAttr = (fieldKey) => {
      const loadingType = getFieldValue(`${fieldKey}_loading`) || "async";
      if (loadingType === "async") return " async";
      if (loadingType === "defer") return " defer";
      return ""; // blocking (no attribute)
    };

    // === HEAD SECTION ===

    // Google Analytics 4
    const ga4Id = getFieldValue("google_analytics_id");
    if (ga4Id) {
      const loadingAttr = getLoadingAttr("google_analytics_id");
      headScripts.push(`<!-- Google Analytics 4 -->
<script${loadingAttr} src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${ga4Id}');
</script>`);
    }

    // Universal Analytics (Legacy)
    const uaId = getFieldValue("google_universal_analytics_id");
    if (uaId) {
      const loadingAttr = getLoadingAttr("google_universal_analytics_id");
      headScripts.push(`<!-- Google Universal Analytics (Legacy) -->
<script${loadingAttr} src="https://www.google-analytics.com/analytics.js"></script>
<script>
  window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
  ga('create', '${uaId}', 'auto');
  ga('send', 'pageview');
</script>`);
    }

    // Google Tag Manager
    const gtmId = getFieldValue("google_tag_manager_id");
    if (gtmId) {
      const loadingAttr = getLoadingAttr("google_tag_manager_id");
      headScripts.push(`<!-- Google Tag Manager -->
<script${loadingAttr}>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>`);

      // GTM Body noscript
      bodyScripts.push(`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
    }

    // Google Ads Conversion
    const adsId = getFieldValue("google_ads_conversion_id");
    if (adsId) {
      const loadingAttr = getLoadingAttr("google_ads_conversion_id");
      headScripts.push(`<!-- Google Ads Conversion Tracking -->
<script${loadingAttr} src="https://www.googletagmanager.com/gtag/js?id=${adsId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${adsId}');
</script>`);
    }

    // Google AdSense
    const adsenseId = getFieldValue("google_adsense_id");
    if (adsenseId) {
      const loadingAttr = getLoadingAttr("google_adsense_id");
      headScripts.push(`<!-- Google AdSense -->
<script${loadingAttr} src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}"
     crossorigin="anonymous"></script>`);
    }

    // Facebook Pixel
    const fbPixelId = getFieldValue("facebook_pixel_id");
    if (fbPixelId) {
      const loadingAttr = getLoadingAttr("facebook_pixel_id");
      headScripts.push(`<!-- Facebook Pixel -->
<script${loadingAttr}>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${fbPixelId}');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1"/>
</noscript>`);
    }

    // LinkedIn Insight Tag
    const linkedinId = getFieldValue("linkedin_partner_id");
    if (linkedinId) {
      const loadingAttr = getLoadingAttr("linkedin_partner_id");
      headScripts.push(`<!-- LinkedIn Insight Tag -->
<script${loadingAttr} type="text/javascript">
_linkedin_partner_id = "${linkedinId}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script${loadingAttr} type="text/javascript">
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
</noscript>`);
    }

    // Twitter/X Pixel
    const twitterId = getFieldValue("twitter_pixel_id");
    if (twitterId) {
      const loadingAttr = getLoadingAttr("twitter_pixel_id");
      headScripts.push(`<!-- Twitter/X Pixel -->
<script${loadingAttr}>
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','${twitterId}');
</script>`);
    }

    // Pinterest Tag
    const pinterestId = getFieldValue("pinterest_tag_id");
    if (pinterestId) {
      const loadingAttr = getLoadingAttr("pinterest_tag_id");
      headScripts.push(`<!-- Pinterest Tag -->
<script${loadingAttr}>
!function(e){if(!window.pintrk){window.pintrk = function () {
window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
  n=window.pintrk;n.queue=[],n.version="3.0";var
  t=document.createElement("script");t.async=!0,t.src=e;var
  r=document.getElementsByTagName("script")[0];
  r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '${pinterestId}', {em: '<user_email_address>'});
pintrk('page');
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt=""
  src="https://ct.pinterest.com/v3/?event=init&tid=${pinterestId}&pd[em]=<hashed_email_address>&noscript=1" />
</noscript>`);
    }

    // Microsoft Clarity
    const clarityId = getFieldValue("microsoft_clarity_id");
    if (clarityId) {
      const loadingAttr = getLoadingAttr("microsoft_clarity_id");
      headScripts.push(`<!-- Microsoft Clarity -->
<script${loadingAttr} type="text/javascript">
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");
</script>`);
    }

    // Hotjar
    const hotjarId = getFieldValue("hotjar_site_id");
    if (hotjarId) {
      const loadingAttr = getLoadingAttr("hotjar_site_id");
      headScripts.push(`<!-- Hotjar Tracking Code -->
<script${loadingAttr}>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hotjarId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`);
    }

    // Mixpanel
    const mixpanelToken = getFieldValue("mixpanel_token");
    if (mixpanelToken) {
      const loadingAttr = getLoadingAttr("mixpanel_token");
      headScripts.push(`<!-- Mixpanel -->
<script${loadingAttr} type="text/javascript">
(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
mixpanel.init("${mixpanelToken}");
</script>`);
    }

    // Amplitude
    const amplitudeKey = getFieldValue("amplitude_api_key");
    if (amplitudeKey) {
      const loadingAttr = getLoadingAttr("amplitude_api_key");
      headScripts.push(`<!-- Amplitude -->
<script${loadingAttr} type="text/javascript">
(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
;r.type="text/javascript"
;r.integrity="sha384-+EO59vL/X7v6VE2s6/F4HxfHlK0nDUVWKVg8K9oUlvffAeeaShVBmbORTC2D3UF+"
;r.crossOrigin="anonymous";r.async=true
;r.src="https://cdn.amplitude.com/libs/amplitude-8.5.0-min.gz.js"
;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
console.log("[Amplitude] Error: could not load SDK")}};var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
;function s(e,t){e.prototype[t]=function(){
this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
var o=function(){this._q=[];return this}
;var a=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove"]
;for(var c=0;c<a.length;c++){s(o,a[c])}n.Identify=o;var u=function(){this._q=[]
;return this}
;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
;for(var p=0;p<l.length;p++){s(u,l[p])}n.Revenue=u
;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","enableTracking","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
;function v(e){function t(t){e[t]=function(){
e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
e=(!e||e.length===0?"$default_instance":e).toLowerCase()
;if(!Object.prototype.hasOwnProperty.call(n._iq,e)){n._iq[e]={_q:[]};v(n._iq[e])
}return n._iq[e]};e.amplitude=n})(window,document);

amplitude.getInstance().init("${amplitudeKey}");
</script>`);
    }

    // FullStory
    const fullstoryId = getFieldValue("fullstory_org_id");
    if (fullstoryId) {
      const loadingAttr = getLoadingAttr("fullstory_org_id");
      headScripts.push(`<!-- FullStory -->
<script${loadingAttr}>
window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
window['_fs_org'] = '${fullstoryId}';
window['_fs_namespace'] = 'FS';
(function(m,n,e,t,l,o,g,y){
    if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
    g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
    o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_script;
    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
    g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
    g.anonymize=function(){g.identify(!!0)};
    g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
    g.log = function(a,b){g("log",[a,b])};
    g.consent=function(a){g("consent",!arguments.length||a)};
    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
    g.clearUserCookie=function(){};
    g.setVars=function(n, p){g('setVars',[n,p]);};
    g._w={};y='XMLHttpRequest';g._w[y]=m[y];y='fetch';g._w[y]=m[y];
    if(m[y])m[y]=function(){return g._w[y].apply(this,arguments)};
    g._v="1.3.0";
})(window,document,window['_fs_namespace'],'script','user');
</script>`);
    }

    // Verification Meta Tags
    const googleVerification = getFieldValue("google_site_verification");
    if (googleVerification) {
      headScripts.push(`<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="${googleVerification}" />`);
    }

    const bingVerification = getFieldValue("bing_site_verification");
    if (bingVerification) {
      headScripts.push(`<!-- Bing Webmaster Tools Verification -->
<meta name="msvalidate.01" content="${bingVerification}" />`);
    }

    const yandexVerification = getFieldValue("yandex_verification");
    if (yandexVerification) {
      headScripts.push(`<!-- Yandex Webmaster Verification -->
<meta name="yandex-verification" content="${yandexVerification}" />`);
    }

    const pinterestVerification = getFieldValue("pinterest_verification");
    if (pinterestVerification) {
      headScripts.push(`<!-- Pinterest Site Verification -->
<meta name="p:domain_verify" content="${pinterestVerification}" />`);
    }

    // Custom Scripts
    const customHead = getFieldValue("custom_head_scripts");
    if (customHead) {
      headScripts.push(`<!-- Custom Head Scripts -->
${customHead}`);
    }

    const customBody = getFieldValue("custom_body_scripts");
    if (customBody) {
      bodyScripts.push(`<!-- Custom Body Scripts -->
${customBody}`);
    }

    const customFooter = getFieldValue("custom_footer_scripts");
    if (customFooter) {
      footerScripts.push(`<!-- Custom Footer Scripts -->
${customFooter}`);
    }

    return { headScripts, bodyScripts, footerScripts };
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
              ✕
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
          <option value="global">🌐 Global Defaults (All Pages)</option>
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
          <p>⚠️ {apiError}</p>
        </div>
      )}

      {/* Collapsible Sections */}
      <div className={styles.sectionsContainer}>
        {trackingFields.map(renderSection)}
      </div>

      {/* Save Button */}
      <div className={styles.saveSection}>
        <button
          className={`${styles.saveButton} ${hasChanges ? styles.hasChanges : ""}`}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
        </button>

        <ReviewPublishButton
          onSave={handleSave}
          hasChanges={hasChanges}
          isSaving={isSaving}
          onNavigate={onNavigate}
        />
      </div>

      {/* TRACKING CODES PREVIEW */}
      <div className={styles.pageSelector} style={{ marginTop: "2rem" }}>
        <button
          type="button"
          className={styles.saveButton}
          onClick={() => setShowPreview(!showPreview)}
          style={{ marginRight: "1rem" }}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>

        {selectedPage !== "global" && (
          <div
            className={styles.inheritanceInfo}
            style={{ marginTop: "0.5rem" }}
          >
            <small>
              This preview shows ALL tracking codes that will be output on this
              page (Global + Page-specific).
            </small>
          </div>
        )}
      </div>

      {showPreview &&
        (() => {
          const { headScripts, bodyScripts, footerScripts } =
            generateTrackingPreview();
          const hasAnyScripts =
            headScripts.length > 0 ||
            bodyScripts.length > 0 ||
            footerScripts.length > 0;

          if (!hasAnyScripts) {
            return (
              <div
                className={styles.pageSelector}
                style={{ background: "#f8f9fa" }}
              >
                <label className={styles.selectorLabel}>
                  No Tracking Codes Configured
                </label>
                <div
                  style={{
                    padding: "1rem",
                    background: "#fff3cd",
                    borderRadius: "4px",
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <strong>💡 No tracking codes will be output</strong>
                  <p style={{ margin: "0.5rem 0 0 0" }}>
                    Configure tracking codes in the sections above to see the
                    preview.
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              className={styles.pageSelector}
              style={{ background: "#f8f9fa" }}
            >
              <label className={styles.selectorLabel}>
                Complete Tracking Codes Output
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
                      ✅ <strong>Global tracking codes</strong> that apply to
                      all pages
                    </li>
                    <li>
                      ✅ <strong>Page-specific tracking codes</strong> for this
                      page
                    </li>
                    <li>All codes will be combined in the output</li>
                  </ul>
                </div>
              )}

              {/* HEAD SECTION */}
              {headScripts.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#28a745",
                      color: "white",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}
                  >
                    &lt;head&gt; Section ({headScripts.length} item
                    {headScripts.length !== 1 ? "s" : ""})
                  </div>
                  <pre
                    style={{
                      background: "#282c34",
                      color: "#abb2bf",
                      padding: "1rem",
                      borderRadius: "0 0 4px 4px",
                      overflow: "auto",
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                      maxHeight: "400px",
                      margin: 0,
                    }}
                  >
                    {headScripts.join("\n\n")}
                  </pre>
                </>
              )}

              {/* BODY SECTION */}
              {bodyScripts.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#ffc107",
                      color: "#000",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}
                  >
                    &lt;body&gt; Section (After Opening Tag) (
                    {bodyScripts.length} item
                    {bodyScripts.length !== 1 ? "s" : ""})
                  </div>
                  <pre
                    style={{
                      background: "#282c34",
                      color: "#abb2bf",
                      padding: "1rem",
                      borderRadius: "0 0 4px 4px",
                      overflow: "auto",
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                      maxHeight: "400px",
                      margin: 0,
                    }}
                  >
                    {bodyScripts.join("\n\n")}
                  </pre>
                </>
              )}

              {/* FOOTER SECTION */}
              {footerScripts.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#17a2b8",
                      color: "white",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}
                  >
                    &lt;footer&gt; Section (Before Closing &lt;/body&gt;) (
                    {footerScripts.length} item
                    {footerScripts.length !== 1 ? "s" : ""})
                  </div>
                  <pre
                    style={{
                      background: "#282c34",
                      color: "#abb2bf",
                      padding: "1rem",
                      borderRadius: "0 0 4px 4px",
                      overflow: "auto",
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                      maxHeight: "400px",
                      margin: 0,
                    }}
                  >
                    {footerScripts.join("\n\n")}
                  </pre>
                </>
              )}

              <div
                style={{
                  padding: "1rem",
                  background: "#d1ecf1",
                  borderRadius: "4px",
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                <strong>📝 Note:</strong> This is the exact HTML/JavaScript code
                that will be injected into your pages. Script loading attributes
                (async/defer) are shown in the script tags above.
              </div>
            </div>
          );
        })()}

      {/* Important Notes Section - Moved to Bottom */}
      <div className={styles.importantNotes}>
        <div className={styles.notesSection}>
          <h4>⚠️ Important Notes:</h4>
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
              (F12) â†’ Network tab to verify scripts are loading
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrackingTags;
