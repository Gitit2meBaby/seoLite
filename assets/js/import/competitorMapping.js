export const COMPETITOR_META_MAP = {
  yoast: {
    postMeta: {
      meta_title: ["_yoast_wpseo_title"],
      meta_description: ["_yoast_wpseo_metadesc"],
      meta_keywords: ["_yoast_wpseo_focuskw"],

      canonical: ["_yoast_wpseo_canonical"],

      robots_noindex: ["_yoast_wpseo_meta-robots-noindex"],
      robots_nofollow: ["_yoast_wpseo_meta-robots-nofollow"],

      breadcrumb_title: ["_yoast_wpseo_bctitle"],

      og_title: ["_yoast_wpseo_opengraph-title"],
      og_description: ["_yoast_wpseo_opengraph-description"],
      og_image: ["_yoast_wpseo_opengraph-image"],

      twitter_title: ["_yoast_wpseo_twitter-title"],
      twitter_description: ["_yoast_wpseo_twitter-description"],
      twitter_image: ["_yoast_wpseo_twitter-image"],

      schema_page_type: ["_yoast_wpseo_schema_page_type"],
      schema_article_type: ["_yoast_wpseo_schema_article_type"],
    },
    options: {
      titles: "wpseo_titles",
      social: "wpseo_social",
      schema: "wpseo_schema",
      webmaster: "wpseo_webmaster",
    },
  },
  rankmath: {
    postMeta: {
      meta_title: ["rank_math_title"],
      meta_description: ["rank_math_description"],
      meta_keywords: ["rank_math_focus_keyword"],

      canonical: ["rank_math_canonical_url"],

      robots: ["rank_math_robots"],

      og_title: ["rank_math_facebook_title"],
      og_description: ["rank_math_facebook_description"],
      og_image: ["rank_math_facebook_image"],

      twitter_title: ["rank_math_twitter_title"],
      twitter_description: ["rank_math_twitter_description"],
      twitter_image: ["rank_math_twitter_image"],

      schema_primary_type: ["rank_math_primary_category"],
    },
    options: {
      general: "rank-math-options-general",
      titles: "rank-math-options-titles",
      sitemap: "rank-math-options-sitemap",
    },
    schema: {
      Article: ["rank_math_schema_Article"],
      BlogPosting: ["rank_math_schema_BlogPosting"],
      Product: ["rank_math_schema_Product"],
      FAQPage: ["rank_math_schema_FAQPage"],
      HowTo: ["rank_math_schema_HowTo"],
    },
  },
  aioseo: {
    postMeta: {
      meta_title: ["_aioseo_title"],
      meta_description: ["_aioseo_description"],
      meta_keywords: ["_aioseo_keywords"],

      canonical: ["_aioseo_canonical_url"],

      robots_noindex: ["_aioseo_noindex"],
      robots_nofollow: ["_aioseo_nofollow"],

      og_title: ["_aioseo_og_title"],
      og_description: ["_aioseo_og_description"],
      og_image: ["_aioseo_og_image"],

      twitter_title: ["_aioseo_twitter_title"],
      twitter_description: ["_aioseo_twitter_description"],
      twitter_image: ["_aioseo_twitter_image"],
    },
    options: {
      main: "aioseo_options",
      social: "aioseo_social",
      webmaster: "aioseo_webmaster",
    },
  },
  seopress: {
    postMeta: {
      meta_title: ["_seopress_titles_title"],
      meta_description: ["_seopress_titles_desc"],

      canonical: ["_seopress_robots_canonical"],

      robots_noindex: ["_seopress_robots_index"],
      robots_nofollow: ["_seopress_robots_follow"],

      og_title: ["_seopress_social_fb_title"],
      og_description: ["_seopress_social_fb_desc"],
      og_image: ["_seopress_social_fb_img"],

      twitter_title: ["_seopress_social_twitter_title"],
      twitter_description: ["_seopress_social_twitter_desc"],
      twitter_image: ["_seopress_social_twitter_img"],
    },
    options: {
      titles: "seopress_titles_option_name",
      social: "seopress_social_option_name",
      webmaster: "seopress_google_analytics_option_name",
    },
  },
  seoFramework: {
    postMeta: {
      meta_title: ["_genesis_title"],
      meta_description: ["_genesis_description"],

      canonical: ["_genesis_canonical"],

      robots_noindex: ["_genesis_noindex"],
      robots_nofollow: ["_genesis_nofollow"],

      og_title: ["_open_graph_title"],
      og_description: ["_open_graph_description"],
      og_image: ["_open_graph_image"],
    },
    options: {
      settings: "autodescription-site-settings",
    },
  },
};
