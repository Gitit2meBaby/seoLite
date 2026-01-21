// Tracking fields configuration with tooltips
export const trackingFields = [
  // === GOOGLE SERVICES ===
  {
    section: "Google Services",
    fields: [
      {
        key: "google_analytics_id",
        label: "Google Analytics 4 Measurement ID",
        type: "text",
        placeholder: "G-XXXXXXXXXX",
        tooltip:
          "Your GA4 measurement ID (format: G-XXXXXXXXXX). Find this in Google Analytics → Admin → Data Streams → Web → Measurement ID. The plugin automatically includes the gtag.js script.",
        pattern: "^G-[A-Z0-9]{10}$",
      },
      {
        key: "google_universal_analytics_id",
        label: "Universal Analytics ID (Legacy)",
        type: "text",
        placeholder: "UA-XXXXXXXX-X",
        tooltip:
          "Universal Analytics stopped processing data in July 2023. This field is only for legacy support. Please migrate to Google Analytics 4 (GA4) above.",
        pattern: "^UA-[0-9]+-[0-9]+$",
      },
      {
        key: "google_tag_manager_id",
        label: "Google Tag Manager Container ID",
        type: "text",
        placeholder: "GTM-XXXXXXX",
        tooltip:
          "Your GTM container ID (format: GTM-XXXXXXX). Find this in Google Tag Manager → Admin → Container Settings. GTM lets you manage all tracking codes from one place. The plugin includes both head and body (noscript) implementations.",
        pattern: "^GTM-[A-Z0-9]{7}$",
      },
      {
        key: "google_ads_conversion_id",
        label: "Google Ads Conversion ID",
        type: "text",
        placeholder: "AW-XXXXXXXXXX",
        tooltip:
          "Your Google Ads conversion tracking ID (format: AW-XXXXXXXXXX). Find this in Google Ads → Tools & Settings → Conversions. Used for tracking conversions and remarketing.",
      },
      {
        key: "google_adsense_id",
        label: "Google AdSense Publisher ID",
        type: "text",
        placeholder: "ca-pub-XXXXXXXXXXXXXXXX",
        tooltip:
          "Your AdSense publisher ID (format: ca-pub-XXXXXXXXXXXXXXXX). Find this in AdSense → Account → Settings → Account Information. Used for ad monetization.",
      },
    ],
  },

  // === SOCIAL MEDIA PLATFORMS ===
  {
    section: "Social Media Platforms",
    fields: [
      {
        key: "facebook_pixel_id",
        label: "Facebook Pixel ID",
        type: "text",
        placeholder: "123456789012345",
        tooltip:
          "Your Facebook Pixel ID (15-16 digit number). Find this in Facebook Events Manager → Data Sources → Pixels. The plugin includes the full fbq() initialization code and noscript fallback for conversion tracking and remarketing.",
        pattern: "^[0-9]{15,16}$",
      },
      {
        key: "linkedin_partner_id",
        label: "LinkedIn Insight Tag Partner ID",
        type: "text",
        placeholder: "123456",
        tooltip:
          "Your LinkedIn Insight Tag partner ID (6-7 digits). Find this in LinkedIn Campaign Manager → Account Assets → Insight Tag. Used for conversion tracking and website demographics.",
        pattern: "^[0-9]{6,7}$",
      },
      {
        key: "twitter_pixel_id",
        label: "Twitter/X Pixel ID",
        type: "text",
        placeholder: "o1234",
        tooltip:
          "Your Twitter/X pixel ID (starts with 'o' followed by numbers). Find this in Twitter Ads → Tools → Conversion Tracking. Used for advertising conversion tracking.",
      },
      {
        key: "pinterest_tag_id",
        label: "Pinterest Tag ID",
        type: "text",
        placeholder: "2612345678901",
        tooltip:
          "Your Pinterest Tag ID (13 digits). Find this in Pinterest Business → Ads → Conversions. Used for conversion tracking and audience building.",
        pattern: "^[0-9]{13}$",
      },
    ],
  },

  // === ANALYTICS & HEATMAPS ===
  {
    section: "Analytics & Heatmaps",
    fields: [
      {
        key: "microsoft_clarity_id",
        label: "Microsoft Clarity Project ID",
        type: "text",
        placeholder: "abcdefghij",
        tooltip:
          "Your Microsoft Clarity project ID (10 alphanumeric characters). Find this in Microsoft Clarity → Settings → Setup. Free tool for heatmaps, session recordings, and user behavior analytics.",
      },
      {
        key: "hotjar_site_id",
        label: "Hotjar Site ID",
        type: "text",
        placeholder: "1234567",
        tooltip:
          "Your Hotjar site ID (7 digits). Find this in Hotjar → Settings → Sites & Organizations. Used for heatmaps, session recordings, and user feedback.",
        pattern: "^[0-9]{7}$",
      },
      {
        key: "mixpanel_token",
        label: "Mixpanel Project Token",
        type: "text",
        placeholder: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        tooltip:
          "Your Mixpanel project token (32 character alphanumeric string). Find this in Mixpanel → Settings → Project Settings. Used for advanced event tracking and product analytics.",
      },
      {
        key: "amplitude_api_key",
        label: "Amplitude API Key",
        type: "text",
        placeholder: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        tooltip:
          "Your Amplitude API key (32 character alphanumeric string). Find this in Amplitude → Settings → Projects. Used for product analytics and user behavior tracking.",
      },
      {
        key: "fullstory_org_id",
        label: "FullStory Organization ID",
        type: "text",
        placeholder: "XXXXX",
        tooltip:
          "Your FullStory organization ID (5-6 characters). Find this in FullStory → Settings → FS Setup. Used for session replay and user experience analytics.",
      },
    ],
  },

  // === SEARCH CONSOLE VERIFICATION ===
  {
    section: "Search Console Verification",
    fields: [
      {
        key: "google_site_verification",
        label: "Google Search Console Verification",
        type: "text",
        placeholder: "abcdefghijklmnopqrstuvwxyz123456789ABC",
        tooltip:
          'Google Search Console verification code (just the content value, not the full meta tag). Get this from Google Search Console → Settings → Ownership Verification → HTML tag method. The plugin outputs: <meta name="google-site-verification" content="YOUR_CODE" />',
      },
      {
        key: "bing_site_verification",
        label: "Bing Webmaster Tools Verification",
        type: "text",
        placeholder: "ABCDEF123456789",
        tooltip:
          'Bing Webmaster verification code (just the content value). Get this from Bing Webmaster Tools → Settings → Verify Ownership → Meta tag option. The plugin outputs: <meta name="msvalidate.01" content="YOUR_CODE" />',
      },
      {
        key: "yandex_verification",
        label: "Yandex Webmaster Verification",
        type: "text",
        placeholder: "1234567890abcdef",
        tooltip:
          'Yandex Webmaster verification code (16 character hexadecimal). Get this from Yandex Webmaster → Site Settings → Ownership Verification. The plugin outputs: <meta name="yandex-verification" content="YOUR_CODE" />',
      },
      {
        key: "pinterest_verification",
        label: "Pinterest Site Verification",
        type: "text",
        placeholder: "abcdef1234567890abcdef1234567890",
        tooltip:
          'Pinterest business verification code (32 character hexadecimal). Get this from Pinterest Business → Settings → Claim → Website → Meta tag option. The plugin outputs: <meta name="p:domain_verify" content="YOUR_CODE" />',
      },
    ],
  },

  // === CUSTOM TRACKING CODES ===
  {
    section: "Custom Tracking Codes",
    fields: [
      {
        key: "custom_head_scripts",
        label: "Custom Head Code",
        type: "textarea",
        placeholder:
          "<!-- Your custom tracking code here -->\n<script>\n  // Custom analytics or tracking\n</script>",
        tooltip:
          "Custom tracking codes placed in the <head> section. Use this for custom analytics, third-party scripts, or tracking codes not covered above. Scripts are output before </head>. Be careful - incorrect code can break your site.",
        rows: 8,
      },
      {
        key: "custom_body_scripts",
        label: "Custom Body Code (After Opening Tag)",
        type: "textarea",
        placeholder:
          "<!-- Your custom body tracking code here -->\n<script>\n  // Body tracking code\n</script>",
        tooltip:
          "Custom tracking codes placed immediately after the opening <body> tag (via wp_body_open hook). Some tracking tools (like GTM noscript) require placement here. Scripts execute early in page load.",
        rows: 8,
      },
      {
        key: "custom_footer_scripts",
        label: "Custom Footer Code",
        type: "textarea",
        placeholder:
          "<!-- Your custom footer tracking code here -->\n<script>\n  // Footer scripts\n</script>",
        tooltip:
          "Custom tracking codes placed in the footer before </body>. Best for non-critical scripts that can load after page content. Improves perceived page speed as these load last.",
        rows: 8,
      },
    ],
  },
];
