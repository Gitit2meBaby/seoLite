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
      },
      {
        key: "social_twitter_url",
        label: "Twitter/X Profile URL",
        type: "url",
        placeholder: "https://twitter.com/yourusername",
      },
      {
        key: "social_instagram_url",
        label: "Instagram Profile URL",
        type: "url",
        placeholder: "https://www.instagram.com/yourusername",
      },
      {
        key: "social_linkedin_url",
        label: "LinkedIn Profile/Company URL",
        type: "url",
        placeholder: "https://www.linkedin.com/company/yourcompany",
      },
      {
        key: "social_youtube_url",
        label: "YouTube Channel URL",
        type: "url",
        placeholder: "https://www.youtube.com/c/yourchannel",
      },
      {
        key: "social_tiktok_url",
        label: "TikTok Profile URL",
        type: "url",
        placeholder: "https://www.tiktok.com/@yourusername",
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
        hasMediaHelper: true,
        tooltipText:
          "Default image when content is shared (1200x630px recommended)",
      },
      {
        key: "social_twitter_image",
        label: "Twitter Card Image",
        type: "url",
        placeholder:
          "https://yoursite.com/wp-content/uploads/2024/twitter-card.jpg",
        hasMediaHelper: true,
        tooltipText:
          "Specific image for Twitter cards (1200x675px recommended)",
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
        description: "Title for social media shares (falls back to meta title)",
        maxLength: 60,
      },
      {
        key: "og_description",
        label: "Open Graph Description",
        type: "textarea",
        placeholder:
          "A compelling description that makes people want to click and share",
        description:
          "Description for social media shares (falls back to meta description)",
        maxLength: 155,
      },
      {
        key: "og_image",
        label: "Open Graph Image",
        type: "url",
        placeholder:
          "https://yoursite.com/wp-content/uploads/2024/og-image.jpg",
        hasMediaHelper: true,
        tooltipText: "Specific image for this page (1200x630px recommended)",
      },
      {
        key: "og_image_alt",
        label: "Open Graph Image Alt Text",
        type: "text",
        placeholder: "Descriptive text for the social share image",
        description:
          "Alt text for accessibility and better social media optimization",
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
        description: "Type of content for better social media categorization",
      },
      {
        key: "og_site_name",
        label: "Site Name",
        type: "text",
        placeholder: "Your Awesome Website",
        description: "Your website/brand name (usually global setting)",
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
        description: "Language and region for social media platforms",
        global: true,
      },
    ],
  },

  // === ARTICLE METADATA ===
  {
    section: "Article Metadata (for Articles/Blog Posts)",
    fields: [
      {
        key: "article_published_time",
        label: "Article Published Time",
        type: "datetime-local",
        description: "When article was first published (ISO 8601 format)",
      },
      {
        key: "article_modified_time",
        label: "Article Modified Time",
        type: "datetime-local",
        description: "When article was last updated",
      },
      {
        key: "article_author",
        label: "Article Author",
        type: "text",
        placeholder: "John Doe or https://facebook.com/johndoe",
        description: "Author name or Facebook profile URL",
      },
      {
        key: "article_section",
        label: "Article Section/Category",
        type: "text",
        placeholder: "Technology, Business, Lifestyle",
        description: "General category for the article",
      },
      {
        key: "article_tag",
        label: "Article Tags",
        type: "textarea",
        placeholder: "WordPress\nSEO\nWeb Development",
        description: "Keywords/tags for the article (one per line)",
      },
    ],
  },

  // === IMAGE DIMENSIONS ===
  {
    section: "Social Media Image Optimization",
    fields: [
      {
        key: "og_image_width",
        label: "Open Graph Image Width",
        type: "number",
        placeholder: "1200",
        description:
          "Image width in pixels (1200 recommended for best display)",
      },
      {
        key: "og_image_height",
        label: "Open Graph Image Height",
        type: "number",
        placeholder: "630",
        description:
          "Image height in pixels (630 recommended for 1.91:1 ratio)",
      },
      {
        key: "twitter_image_alt",
        label: "Twitter Image Alt Text",
        type: "text",
        placeholder: "Descriptive text for the image",
        description: "Alt text for Twitter card image (accessibility)",
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
        description: "Type of Twitter card to display",
      },
      {
        key: "twitter_site",
        label: "Twitter Site Handle",
        type: "text",
        placeholder: "@yourwebsite",
        description: "Your website's Twitter handle (include @)",
        global: true,
      },
      {
        key: "twitter_creator",
        label: "Twitter Creator Handle",
        type: "text",
        placeholder: "@contentcreator",
        description: "Content creator's Twitter handle (include @)",
      },
      {
        key: "twitter_title",
        label: "Twitter Card Title",
        type: "text",
        placeholder: "Amazing Content - Perfect for Twitter",
        description:
          "Title for Twitter cards (falls back to OG title or meta title)",
        maxLength: 70,
      },
      {
        key: "twitter_description",
        label: "Twitter Card Description",
        type: "textarea",
        placeholder:
          "A concise description optimized for Twitter's character limits",
        description:
          "Description for Twitter cards (falls back to OG description)",
        maxLength: 200,
      },
      {
        key: "twitter_image",
        label: "Twitter Card Image",
        type: "url",
        placeholder:
          "https://yoursite.com/wp-content/uploads/2024/twitter-image.jpg",
        hasMediaHelper: true,
        tooltipText:
          "Specific image for Twitter cards (1200x675px recommended)",
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
        description: "Facebook App ID for analytics and admin features",
        global: true,
      },
      {
        key: "fb_admins",
        label: "Facebook Admin IDs",
        type: "text",
        placeholder: "100001234567890,100009876543210",
        description: "Comma-separated Facebook user IDs of page admins",
        global: true,
      },
    ],
  },
];
