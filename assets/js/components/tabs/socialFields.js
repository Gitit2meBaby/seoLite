// assets/js/components/tabs/socialFields.js
export const socialFields = [
  // === SOCIAL MEDIA PROFILES ===
  {
    section: "Social Media Profiles",
    fields: [
      {
        key: "social_facebook_url",
        label: "Facebook Page URL",
        type: "url",
        placeholder: "https://www.facebook.com/yourpage",
        tooltip:
          "Your Facebook business page or profile URL. Used in Organization schema and social links.",
      },
      {
        key: "social_twitter_url",
        label: "Twitter/X Profile URL",
        type: "url",
        placeholder: "https://twitter.com/yourusername",
        tooltip:
          "Your Twitter/X profile URL. Used in Organization schema and social links.",
      },
      {
        key: "social_instagram_url",
        label: "Instagram Profile URL",
        type: "url",
        placeholder: "https://www.instagram.com/yourusername",
        tooltip:
          "Your Instagram profile URL. Used in Organization schema and social links.",
      },
      {
        key: "social_linkedin_url",
        label: "LinkedIn Profile/Company URL",
        type: "url",
        placeholder: "https://www.linkedin.com/company/yourcompany",
        tooltip:
          "Your LinkedIn company page or personal profile URL. Used in Organization schema and social links.",
      },
      {
        key: "social_youtube_url",
        label: "YouTube Channel URL",
        type: "url",
        placeholder: "https://www.youtube.com/c/yourchannel",
        tooltip:
          "Your YouTube channel URL. Used in Organization schema and social links.",
      },
      {
        key: "social_tiktok_url",
        label: "TikTok Profile URL",
        type: "url",
        placeholder: "https://www.tiktok.com/@yourusername",
        tooltip:
          "Your TikTok profile URL. Used in Organization schema and social links.",
      },
    ],
  },

  // === DEFAULT SOCIAL IMAGES ===
  {
    section: "Default Social Images",
    fields: [
      {
        key: "social_default_image",
        label: "Default Social Share Image",
        type: "url",
        placeholder:
          "https://yoursite.com/wp-content/uploads/2024/social-image.jpg",
        tooltip:
          "Default image shown when your content is shared on social media. Recommended size: 1200x630px. Falls back to site logo if not set.",
      },
      {
        key: "social_twitter_image",
        label: "Twitter Card Image",
        type: "url",
        placeholder:
          "https://yoursite.com/wp-content/uploads/2024/twitter-card.jpg",
        tooltip:
          "Specific image for Twitter cards. Recommended size: 1200x675px (16:9 ratio). Falls back to default social image if not set.",
      },
    ],
  },

  // === OPEN GRAPH SETTINGS ===
  {
    section: "Open Graph Settings",
    fields: [
      {
        key: "og_title",
        label: "Open Graph Title",
        type: "text",
        placeholder: "Amazing Content Title - Your Site",
        tooltip:
          "Title shown when shared on Facebook, LinkedIn, and other platforms. Falls back to your meta title if not set. Max 60 characters recommended.",
        maxLength: 60,
      },
      {
        key: "og_description",
        label: "Open Graph Description",
        type: "textarea",
        placeholder:
          "A compelling description that makes people want to click and share",
        tooltip:
          "Description shown when shared on social media. Falls back to your meta description if not set. Max 155 characters recommended.",
        maxLength: 155,
      },
      {
        key: "og_image",
        label: "Open Graph Image",
        type: "url",
        placeholder:
          "https://yoursite.com/wp-content/uploads/2024/og-image.jpg",
        tooltip:
          "Specific image for this page when shared on social media. Recommended size: 1200x630px. Falls back to default social image if not set.",
      },
      {
        key: "og_image_alt",
        label: "Open Graph Image Alt Text",
        type: "text",
        placeholder: "Descriptive text for the social share image",
        tooltip:
          "Alt text for your Open Graph image. Important for accessibility and helps social platforms understand your image content.",
      },
      {
        key: "og_type",
        label: "Open Graph Type",
        type: "select",
        options: [
          { value: "", label: "Auto-detect" },
          { value: "website", label: "Website" },
          { value: "article", label: "Article" },
          { value: "product", label: "Product" },
          { value: "profile", label: "Profile" },
          { value: "book", label: "Book" },
          { value: "music.song", label: "Music Song" },
          { value: "music.album", label: "Music Album" },
          { value: "video.movie", label: "Video/Movie" },
          { value: "video.episode", label: "Video Episode" },
        ],
        tooltip:
          "Defines the type of content. Auto-detect works for most cases. Choose specific types for better categorization on social platforms.",
      },
      {
        key: "og_site_name",
        label: "Site Name",
        type: "text",
        placeholder: "Your Awesome Website",
        tooltip:
          "Your website or brand name. Shown alongside your content on social media. Usually set globally and consistent across all pages.",
        global: true,
      },
      {
        key: "og_locale",
        label: "Open Graph Locale",
        type: "select",
        options: [
          { value: "en_US", label: "English (US)" },
          { value: "en_GB", label: "English (UK)" },
          { value: "es_ES", label: "Spanish (Spain)" },
          { value: "es_MX", label: "Spanish (Mexico)" },
          { value: "fr_FR", label: "French (France)" },
          { value: "de_DE", label: "German (Germany)" },
          { value: "it_IT", label: "Italian (Italy)" },
          { value: "pt_BR", label: "Portuguese (Brazil)" },
          { value: "ja_JP", label: "Japanese (Japan)" },
          { value: "ko_KR", label: "Korean (Korea)" },
          { value: "zh_CN", label: "Chinese (Simplified)" },
        ],
        tooltip:
          "Language and region of your content. Helps social platforms show your content to the right audience. Usually set globally.",
        global: true,
      },
    ],
  },

  // === TWITTER CARD SETTINGS ===
  {
    section: "Twitter Card Settings",
    fields: [
      {
        key: "twitter_card_type",
        label: "Twitter Card Type",
        type: "select",
        options: [
          { value: "summary", label: "Summary Card" },
          {
            value: "summary_large_image",
            label: "Summary Card with Large Image",
          },
          { value: "app", label: "App Card" },
          { value: "player", label: "Player Card" },
        ],
        tooltip:
          "Type of Twitter card to display. 'Summary Card with Large Image' is recommended for most content with images.",
      },
      {
        key: "twitter_site",
        label: "Twitter Site Handle",
        type: "text",
        placeholder: "@yourwebsite",
        tooltip:
          "Your website's Twitter handle (include the @ symbol). Shown in Twitter cards and helps attribute content to your brand.",
        global: true,
      },
      {
        key: "twitter_creator",
        label: "Twitter Creator Handle",
        type: "text",
        placeholder: "@contentcreator",
        tooltip:
          "Twitter handle of the content creator (include the @ symbol). Attributes this specific content to an individual.",
      },
      {
        key: "twitter_title",
        label: "Twitter Card Title",
        type: "text",
        placeholder: "Amazing Content - Perfect for Twitter",
        tooltip:
          "Title shown on Twitter cards. Falls back to OG title or meta title if not set. Max 70 characters recommended.",
        maxLength: 70,
      },
      {
        key: "twitter_description",
        label: "Twitter Card Description",
        type: "textarea",
        placeholder:
          "A concise description optimized for Twitter's character limits",
        tooltip:
          "Description shown on Twitter cards. Falls back to OG description if not set. Max 200 characters recommended.",
        maxLength: 200,
      },
      {
        key: "twitter_image",
        label: "Twitter Card Image",
        type: "url",
        placeholder:
          "https://yoursite.com/wp-content/uploads/2024/twitter-image.jpg",
        tooltip:
          "Specific image for Twitter cards. Recommended size: 1200x675px (16:9 ratio). Falls back to OG image or default social image if not set.",
      },
    ],
  },

  // === FACEBOOK SPECIFIC ===
  {
    section: "Facebook Settings",
    fields: [
      {
        key: "fb_app_id",
        label: "Facebook App ID",
        type: "text",
        placeholder: "1234567890123456",
        tooltip:
          "Your Facebook App ID. Required for Facebook Insights and admin features. Find this in your Facebook Developer dashboard.",
        global: true,
      },
      {
        key: "fb_admins",
        label: "Facebook Admin IDs",
        type: "text",
        placeholder: "100001234567890,100009876543210",
        tooltip:
          "Comma-separated list of Facebook user IDs who can manage your page's social features. Find your ID at facebook.com/help.",
        global: true,
      },
    ],
  },
];
