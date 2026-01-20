// Tracking fields configuration with tooltips
export const trackingFields = [
  // === GOOGLE SERVICES ===
  {
    section: "Google Services",
    fields: [
      {
        key: "google_analytics_id",
        label: "Google Analytics 4 ID",
        type: "text",
        placeholder: "G-XXXXXXXXXX",
        description: "Your Google Analytics 4 measurement ID (starts with G-)",
        pattern: "^G-[A-Z0-9]{10}$",
        hasTooltip: true,
        tooltipText:
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
        hasTooltip: true,
        tooltipText:
          "Universal Analytics stopped processing data in July 2023. Migrate to GA4.",
      },
      {
        key: "google_tag_manager_id",
        label: "Google Tag Manager ID",
        type: "text",
        placeholder: "GTM-XXXXXXX",
        description:
          "Google Tag Manager container ID for managing multiple tracking codes",
        pattern: "^GTM-[A-Z0-9]{7}$",
        hasTooltip: true,
        tooltipText:
          "Find this in Google Tag Manager → Admin → Container Settings",
      },
      {
        key: "google_adsense_id",
        label: "Google AdSense Publisher ID",
        type: "text",
        placeholder: "ca-pub-XXXXXXXXXXXXXXXX",
        description: "Your AdSense publisher ID for ad monetization",
        hasTooltip: true,
        tooltipText:
          "Find this in AdSense → Account → Settings → Account Information",
      },
      {
        key: "google_ads_conversion_id",
        label: "Google Ads Conversion ID",
        type: "text",
        placeholder: "AW-XXXXXXXXXX",
        description: "For tracking Google Ads conversions and remarketing",
        hasTooltip: true,
        tooltipText: "Find this in Google Ads → Tools & Settings → Conversions",
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
        description: "Facebook Pixel for conversion tracking and remarketing",
        hasTooltip: true,
        tooltipText:
          "Find this in Facebook Events Manager → Data Sources → Pixels",
      },
      {
        key: "linkedin_partner_id",
        label: "LinkedIn Insight Tag Partner ID",
        type: "text",
        placeholder: "123456",
        description:
          "LinkedIn Insight Tag for advertising and conversion tracking",
        hasTooltip: true,
        tooltipText:
          "Find this in LinkedIn Campaign Manager → Account Assets → Insight Tag",
      },
      {
        key: "twitter_pixel_id",
        label: "Twitter Pixel ID",
        type: "text",
        placeholder: "o1234",
        description: "Twitter advertising conversion tracking pixel",
        hasTooltip: true,
        tooltipText: "Find this in Twitter Ads → Tools → Conversion Tracking",
      },
      {
        key: "pinterest_tag_id",
        label: "Pinterest Tag ID",
        type: "text",
        placeholder: "2612345678901",
        description: "Pinterest Tag for advertising and conversion tracking",
        hasTooltip: true,
        tooltipText: "Find this in Pinterest Business → Ads → Conversions",
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
        description:
          "Microsoft Clarity for free user behavior analytics and heatmaps",
        hasTooltip: true,
        tooltipText: "Find this in Microsoft Clarity → Settings → Setup",
      },
      {
        key: "hotjar_site_id",
        label: "Hotjar Site ID",
        type: "text",
        placeholder: "1234567",
        description: "Hotjar site ID for heatmaps and user session recordings",
        hasTooltip: true,
        tooltipText: "Find this in Hotjar → Settings → Sites & Organizations",
      },
      {
        key: "mixpanel_token",
        label: "Mixpanel Project Token",
        type: "text",
        placeholder: "abcdef1234567890abcdef1234567890abcdef12",
        description:
          "Mixpanel project token for advanced event tracking and analytics",
        hasTooltip: true,
        tooltipText: "Find this in Mixpanel → Settings → Project Settings",
      },
      {
        key: "amplitude_api_key",
        label: "Amplitude API Key",
        type: "text",
        placeholder: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        description:
          "Amplitude API key for product analytics and user behavior tracking",
        hasTooltip: true,
        tooltipText: "Find this in Amplitude → Settings → Projects",
      },
      {
        key: "fullstory_org_id",
        label: "FullStory Organization ID",
        type: "text",
        placeholder: "XXXXX",
        description: "FullStory organization ID for user session recordings",
        hasTooltip: true,
        tooltipText: "Find this in FullStory → Settings → FS Setup",
      },
    ],
  },

  // === SEARCH CONSOLE VERIFICATION ===
  {
    section: "Search Console Verification",
    fields: [
      {
        key: "google_site_verification",
        label: "Google Search Console",
        type: "text",
        placeholder: "abcdefghijklmnopqrstuvwxyz123456789",
        description: "Google Search Console verification meta tag",
        hasTooltip: true,
        tooltipText:
          "Get this from Google Search Console → Settings → Ownership Verification",
      },
      {
        key: "bing_site_verification",
        label: "Bing Webmaster Tools",
        type: "text",
        placeholder: "ABCDEF123456789",
        description: "Bing Webmaster Tools verification meta tag",
        hasTooltip: true,
        tooltipText:
          "Get this from Bing Webmaster Tools → Settings → Verify Ownership",
      },
      {
        key: "yandex_verification",
        label: "Yandex Webmaster",
        type: "text",
        placeholder: "1234567890abcdef",
        description: "Yandex Webmaster verification meta tag",
        hasTooltip: true,
        tooltipText:
          "Get this from Yandex Webmaster → Site Settings → Ownership Verification",
      },
      {
        key: "pinterest_verification",
        label: "Pinterest Site Verification",
        type: "text",
        placeholder: "abcdef1234567890",
        description: "Pinterest Business verification meta tag",
        hasTooltip: true,
        tooltipText:
          "Get this from Pinterest Business → Settings → Claim → Website",
      },
    ],
  },

  // === CUSTOM TRACKING CODES ===
  {
    section: "Custom Tracking Codes",
    fields: [
      {
        key: "custom_head_code",
        label: "Custom Head Code",
        type: "textarea",
        placeholder: "<!-- Your custom head tracking code here -->",
        description: "Custom tracking codes to be placed in the <head> section",
        rows: 8,
      },
      {
        key: "custom_body_code",
        label: "Custom Body Code",
        type: "textarea",
        placeholder: "<!-- Your custom body tracking code here -->",
        description:
          "Custom tracking codes to be placed after opening <body> tag",
        rows: 8,
      },
      {
        key: "custom_footer_code",
        label: "Custom Footer Code",
        type: "textarea",
        placeholder: "<!-- Your custom footer tracking code here -->",
        description:
          "Custom tracking codes to be placed before closing </body> tag",
        rows: 8,
      },
    ],
  },
];
