<?php
/**
 * Meta Output Handler for SEO Plugin
 * This handles outputting meta tags and tracking codes to the frontend
 */

class SEO_Plugin_Meta_Output {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Hook into wp_head to add our meta tags and tracking codes
        add_action('wp_head', [$this, 'output_meta_tags'], 1);
        // REMOVED: debug_output hook that was causing the error
        
        // Hook to add tracking codes to body
        add_action('wp_body_open', [$this, 'output_body_tracking_codes'], 1);
        add_action('wp_footer', [$this, 'output_body_tracking_codes_fallback'], 1);
        
        // Hook to modify page title
        add_filter('pre_get_document_title', [$this, 'filter_page_title'], 10, 1);
    }
    
    /**
     * Main function that outputs all meta tags and head tracking codes
     */
    public function output_meta_tags() {
        // Don't output on REST API requests
        if (defined('REST_REQUEST') && REST_REQUEST) {
            return;
        }
        
        echo "<!-- SEO Plugin Meta Tags & Tracking START -->\n";
        
        $meta_settings = $this->get_current_page_meta();
        
        // Output different types of meta tags
        $this->output_basic_meta_tags($meta_settings);
        $this->output_robots_meta($meta_settings);
        $this->output_social_media_meta($meta_settings);
        $this->output_other_meta_tags($meta_settings);
        $this->output_verification_meta_tags($meta_settings);
        $this->output_schema_markup($meta_settings);
        $this->output_breadcrumb_schema($meta_settings);
        $this->output_tracking_codes_head($meta_settings);
        
        echo "<!-- SEO Plugin Meta Tags & Tracking END -->\n";
    }
    
    /**
     * Output basic meta tags like charset, viewport, description
     */
    private function output_basic_meta_tags($meta_settings) {
        // Character encoding (with default)
        $charset = $meta_settings['charset'] ?? 'UTF-8';
        if ($charset) {
            echo "<meta charset=\"{$charset}\">\n";
        }

        // Viewport (with default)
        $viewport = $meta_settings['viewport'] ?? 'width=device-width, initial-scale=1';
        if ($viewport) {
            echo "<meta name=\"viewport\" content=\"{$viewport}\">\n";
        }

        // Meta description
        if (!empty($meta_settings['meta_description'])) {
            $description = esc_attr($meta_settings['meta_description']);
            echo "<meta name=\"description\" content=\"{$description}\">\n";
        }
        
        // Meta keywords
        if (!empty($meta_settings['meta_keywords'])) {
            $keywords = esc_attr($meta_settings['meta_keywords']);
            echo "<meta name=\"keywords\" content=\"{$keywords}\">\n";
        }

        // Author
        if (!empty($meta_settings['meta_author'])) {
            $author = esc_attr($meta_settings['meta_author']);
            echo "<meta name=\"author\" content=\"{$author}\">\n";
        }

        // Copyright
        if (!empty($meta_settings['meta_copyright'])) {
            $copyright = esc_attr($meta_settings['meta_copyright']);
            echo "<meta name=\"copyright\" content=\"{$copyright}\">\n";
        }

        // Generator
        if (!empty($meta_settings['generator'])) {
            $generator = esc_attr($meta_settings['generator']);
            echo "<meta name=\"generator\" content=\"{$generator}\">\n";
        }

        // Theme color
        if (!empty($meta_settings['theme_color'])) {
            $theme_color = esc_attr($meta_settings['theme_color']);
            echo "<meta name=\"theme-color\" content=\"{$theme_color}\">\n";
        }
    }
    
    /**
     * Output robots meta tags (index/noindex, follow/nofollow)
     */
    private function output_robots_meta($meta_settings) {
        $robots_parts = [];
        
        // Use defaults if not set
        $robots_index = $meta_settings['robots_index'] ?? 'index';
        $robots_follow = $meta_settings['robots_follow'] ?? 'follow';
        $robots_advanced = $meta_settings['robots_advanced'] ?? '';
        
        // Always include index and follow directives
        $robots_parts[] = $robots_index;
        $robots_parts[] = $robots_follow;
        
        // Add advanced directive if set
        if (!empty($robots_advanced)) {
            $robots_parts[] = $robots_advanced;
        }
        
        // Always output robots meta tag
        $robots_content = implode(', ', $robots_parts);
        echo "<meta name=\"robots\" content=\"{$robots_content}\">\n";
    }

    /**
     * Output social media meta tags (Open Graph, Twitter Cards, Article metadata)
     */
    private function output_social_media_meta($meta_settings) {
        echo "<!-- Open Graph Meta Tags -->\n";
        
        // Get current URL
        $current_url = get_permalink();
        if (!$current_url) {
            $current_url = home_url($_SERVER['REQUEST_URI']);
        }
        
        // Open Graph basic tags
        if (!empty($meta_settings['og_title'])) {
            echo '<meta property="og:title" content="' . esc_attr($meta_settings['og_title']) . '" />' . "\n";
        } elseif (!empty($meta_settings['meta_title'])) {
            echo '<meta property="og:title" content="' . esc_attr($meta_settings['meta_title']) . '" />' . "\n";
        }
        
        if (!empty($meta_settings['og_description'])) {
            echo '<meta property="og:description" content="' . esc_attr($meta_settings['og_description']) . '" />' . "\n";
        } elseif (!empty($meta_settings['meta_description'])) {
            echo '<meta property="og:description" content="' . esc_attr($meta_settings['meta_description']) . '" />' . "\n";
        }
        
        if (!empty($meta_settings['og_image'])) {
            echo '<meta property="og:image" content="' . esc_url($meta_settings['og_image']) . '" />' . "\n";
            
            // Image dimensions
            if (!empty($meta_settings['og_image_width'])) {
                echo '<meta property="og:image:width" content="' . esc_attr($meta_settings['og_image_width']) . '" />' . "\n";
            }
            if (!empty($meta_settings['og_image_height'])) {
                echo '<meta property="og:image:height" content="' . esc_attr($meta_settings['og_image_height']) . '" />' . "\n";
            }
        }
        
        if (!empty($meta_settings['og_image_alt'])) {
            echo '<meta property="og:image:alt" content="' . esc_attr($meta_settings['og_image_alt']) . '" />' . "\n";
        }
        
        // URL
        echo '<meta property="og:url" content="' . esc_url($current_url) . '" />' . "\n";
        
        // Type
        $og_type = !empty($meta_settings['og_type']) ? $meta_settings['og_type'] : 'website';
        echo '<meta property="og:type" content="' . esc_attr($og_type) . '" />' . "\n";
        
        // Site name
        if (!empty($meta_settings['og_site_name'])) {
            echo '<meta property="og:site_name" content="' . esc_attr($meta_settings['og_site_name']) . '" />' . "\n";
        } else {
            echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '" />' . "\n";
        }
        
        // Locale
        if (!empty($meta_settings['og_locale'])) {
            echo '<meta property="og:locale" content="' . esc_attr($meta_settings['og_locale']) . '" />' . "\n";
        }
        
        // Article metadata (only for article type)
        if ($og_type === 'article') {
            if (!empty($meta_settings['article_published_time'])) {
                echo '<meta property="article:published_time" content="' . esc_attr($meta_settings['article_published_time']) . '" />' . "\n";
            }
            if (!empty($meta_settings['article_modified_time'])) {
                echo '<meta property="article:modified_time" content="' . esc_attr($meta_settings['article_modified_time']) . '" />' . "\n";
            }
            if (!empty($meta_settings['article_author'])) {
                echo '<meta property="article:author" content="' . esc_attr($meta_settings['article_author']) . '" />' . "\n";
            }
            if (!empty($meta_settings['article_section'])) {
                echo '<meta property="article:section" content="' . esc_attr($meta_settings['article_section']) . '" />' . "\n";
            }
            if (!empty($meta_settings['article_tag'])) {
                $tags = explode("\n", $meta_settings['article_tag']);
                foreach ($tags as $tag) {
                    $tag = trim($tag);
                    if (!empty($tag)) {
                        echo '<meta property="article:tag" content="' . esc_attr($tag) . '" />' . "\n";
                    }
                }
            }
        }
        
        // Facebook specific
        if (!empty($meta_settings['fb_app_id'])) {
            echo '<meta property="fb:app_id" content="' . esc_attr($meta_settings['fb_app_id']) . '" />' . "\n";
        }
        if (!empty($meta_settings['fb_admins'])) {
            echo '<meta property="fb:admins" content="' . esc_attr($meta_settings['fb_admins']) . '" />' . "\n";
        }
        
        // Twitter Card tags
        echo "\n<!-- Twitter Card Meta Tags -->\n";
        
        $twitter_card = !empty($meta_settings['twitter_card_type']) ? $meta_settings['twitter_card_type'] : 'summary_large_image';
        echo '<meta name="twitter:card" content="' . esc_attr($twitter_card) . '" />' . "\n";
        
        if (!empty($meta_settings['twitter_site'])) {
            echo '<meta name="twitter:site" content="' . esc_attr($meta_settings['twitter_site']) . '" />' . "\n";
        }
        
        if (!empty($meta_settings['twitter_creator'])) {
            echo '<meta name="twitter:creator" content="' . esc_attr($meta_settings['twitter_creator']) . '" />' . "\n";
        }
        
        if (!empty($meta_settings['twitter_title'])) {
            echo '<meta name="twitter:title" content="' . esc_attr($meta_settings['twitter_title']) . '" />' . "\n";
        } elseif (!empty($meta_settings['og_title'])) {
            echo '<meta name="twitter:title" content="' . esc_attr($meta_settings['og_title']) . '" />' . "\n";
        } elseif (!empty($meta_settings['meta_title'])) {
            echo '<meta name="twitter:title" content="' . esc_attr($meta_settings['meta_title']) . '" />' . "\n";
        }
        
        if (!empty($meta_settings['twitter_description'])) {
            echo '<meta name="twitter:description" content="' . esc_attr($meta_settings['twitter_description']) . '" />' . "\n";
        } elseif (!empty($meta_settings['og_description'])) {
            echo '<meta name="twitter:description" content="' . esc_attr($meta_settings['og_description']) . '" />' . "\n";
        } elseif (!empty($meta_settings['meta_description'])) {
            echo '<meta name="twitter:description" content="' . esc_attr($meta_settings['meta_description']) . '" />' . "\n";
        }
        
        if (!empty($meta_settings['twitter_image'])) {
            echo '<meta name="twitter:image" content="' . esc_url($meta_settings['twitter_image']) . '" />' . "\n";
        } elseif (!empty($meta_settings['og_image'])) {
            echo '<meta name="twitter:image" content="' . esc_url($meta_settings['og_image']) . '" />' . "\n";
        }
        
        if (!empty($meta_settings['twitter_image_alt'])) {
            echo '<meta name="twitter:image:alt" content="' . esc_attr($meta_settings['twitter_image_alt']) . '" />' . "\n";
        }
        
        echo "\n";
    }
    
    
    /**
     * Output other meta tags like canonical, hreflang, etc.
     */
    private function output_other_meta_tags($meta_settings) {
        // Canonical URL
        $canonical_url = '';
        if (!empty($meta_settings['canonical_url'])) {
            $canonical_url = $meta_settings['canonical_url'];
        } else {
            $canonical_url = get_permalink();
        }
        
        if ($canonical_url) {
            $canonical_url = esc_url($canonical_url);
            echo "<link rel=\"canonical\" href=\"{$canonical_url}\">\n";
        }
        
        // Hreflang
        if (!empty($meta_settings['hreflang'])) {
            $hreflang = esc_attr($meta_settings['hreflang']);
            $current_url = esc_url(get_permalink());
            echo "<link rel=\"alternate\" hreflang=\"{$hreflang}\" href=\"{$current_url}\">\n";
        }
        
        // Refresh/redirect
        if (!empty($meta_settings['refresh_redirect'])) {
            $refresh = esc_attr($meta_settings['refresh_redirect']);
            echo "<meta http-equiv=\"refresh\" content=\"{$refresh}\">\n";
        }
        
        // Date meta tags
        if (!empty($meta_settings['date_published'])) {
            $published_date = esc_attr($meta_settings['date_published']);
            echo "<meta property=\"article:published_time\" content=\"{$published_date}\">\n";
        }
        
        if (!empty($meta_settings['date_modified'])) {
            $modified_date = esc_attr($meta_settings['date_modified']);
            echo "<meta property=\"article:modified_time\" content=\"{$modified_date}\">\n";
        }
    }
    
    /**
     * Get the current page ID for meta lookup
     */
    private function get_current_page_id() {
        global $post;
        
        if (is_front_page()) {
            return 'home';
        } elseif (is_home()) {
            return 'home';
        } elseif (is_page() || is_single()) {
            if ($post) {
                return (string) $post->ID;
            } else {
                return 'global';
            }
        } else {
            return 'global';
        }
    }
    
    /**
     * Get meta settings for the current page with inheritance
     * This is the core function that handles the global > page-specific hierarchy
     */
    public function get_current_page_meta() {
        $page_id = $this->get_current_page_id();
        $page_settings = get_option("seo_plugin_page_{$page_id}", []);
        $global_settings = get_option('seo_plugin_page_global', []);
        
        // Merge settings: global first, then page-specific overrides
        $merged_settings = array_merge($global_settings, $page_settings);
        
        return $merged_settings;
    }
    
    /**
     * Output schema markup (Organization, Product, etc.)
     */
    private function output_schema_markup($meta_settings) {
        $schema_type = $meta_settings['schemaType'] ?? '';
        
        if (empty($schema_type)) {
            return;
        }
        
        // Generate schema based on type and settings
        $schema = $this->generate_schema_json($meta_settings, $schema_type);
        
        if (!empty($schema)) {
            echo "<!-- Schema Markup -->\n";
            echo "<script type=\"application/ld+json\">\n";
            echo json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            echo "\n</script>\n\n";
        }
    }
    
    /**
     * Generate schema JSON based on type and settings
     */
    private function generate_schema_json($meta_settings, $schema_type) {
        $schema = [
            "@context" => "https://schema.org",
            "@type" => $schema_type
        ];
        
        // Add basic properties that most schemas have
        if (!empty($meta_settings['name'])) {
            $schema['name'] = $meta_settings['name'];
        }
        
        if (!empty($meta_settings['description'])) {
            $schema['description'] = $meta_settings['description'];
        }
        
        if (!empty($meta_settings['url'])) {
            $schema['url'] = $meta_settings['url'];
        }
        
        if (!empty($meta_settings['image'])) {
            $schema['image'] = $meta_settings['image'];
        }
        
        // Add type-specific properties
        switch ($schema_type) {
            case 'Organization':
            case 'LocalBusiness':
                if (!empty($meta_settings['logo'])) {
                    $schema['logo'] = $meta_settings['logo'];
                }
                if (!empty($meta_settings['email'])) {
                    $schema['email'] = $meta_settings['email'];
                }
                if (!empty($meta_settings['telephone'])) {
                    $schema['telephone'] = $meta_settings['telephone'];
                }
                break;
                
            case 'Article':
            case 'NewsArticle':
                if (!empty($meta_settings['headline'])) {
                    $schema['headline'] = $meta_settings['headline'];
                }
                if (!empty($meta_settings['datePublished'])) {
                    $schema['datePublished'] = $meta_settings['datePublished'];
                }
                if (!empty($meta_settings['dateModified'])) {
                    $schema['dateModified'] = $meta_settings['dateModified'];
                }
                break;
        }
        
        return $schema;
    }
    
    /**
     * Output breadcrumb schema markup
     */
    private function output_breadcrumb_schema($meta_settings) {
        // Check if breadcrumbs are enabled
        $breadcrumb_config = $meta_settings['breadcrumb_config'] ?? [];
        
        if (empty($breadcrumb_config['enabled'])) {
            return;
        }
        
        // Don't show on homepage unless specifically enabled
        if (is_front_page() && empty($breadcrumb_config['showOnHomepage'])) {
            return;
        }
        
        $breadcrumb_data = $this->generate_breadcrumb_data($breadcrumb_config);
        
        if (!empty($breadcrumb_data)) {
            $schema = [
                "@context" => "https://schema.org",
                "@type" => "BreadcrumbList",
                "itemListElement" => $breadcrumb_data
            ];
            
            echo "<!-- Breadcrumb Schema -->\n";
            echo "<script type=\"application/ld+json\">\n";
            echo json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            echo "\n</script>\n\n";
        }
    }
    
    /**
     * Generate breadcrumb data for the current page
     */
    private function generate_breadcrumb_data($breadcrumb_config) {
        global $post;
        
        $breadcrumbs = [];
        $position = 1;
        
        // Get site URL and name
        $site_url = home_url();
        $home_text = $breadcrumb_config['homeText'] ?? get_bloginfo('name');
        
        // Always start with home
        $breadcrumbs[] = [
            "@type" => "ListItem",
            "position" => $position++,
            "name" => $home_text,
            "item" => $site_url
        ];
        
        // If we're on the homepage, just return home
        if (is_front_page()) {
            return $breadcrumbs;
        }
        
        // Handle different page types
        if (is_single() || is_page()) {
            if ($post) {
                $current_page_id = (string) $post->ID;
                
                // Check if this page is excluded
                $excluded_pages = $breadcrumb_config['excludePages'] ?? [];
                if (in_array($current_page_id, $excluded_pages)) {
                    return [];
                }
                
                // Get custom label or use post title
                $custom_labels = $breadcrumb_config['customLabels'] ?? [];
                $page_title = $custom_labels[$current_page_id] ?? $post->post_title;
                
                // Add parent pages if this is a child page
                if ($post->post_parent) {
                    $parent_breadcrumbs = $this->get_parent_breadcrumbs($post->post_parent, $breadcrumb_config, $position);
                    $breadcrumbs = array_merge($breadcrumbs, $parent_breadcrumbs);
                    $position += count($parent_breadcrumbs);
                }
                
                // Add current page
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => $position,
                    "name" => $page_title,
                    "item" => get_permalink($post->ID)
                ];
            }
        } elseif (is_category()) {
            $category = get_queried_object();
            if ($category) {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => $position,
                    "name" => $category->name,
                    "item" => get_category_link($category->term_id)
                ];
            }
        } elseif (is_tag()) {
            $tag = get_queried_object();
            if ($tag) {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => $position,
                    "name" => $tag->name,
                    "item" => get_tag_link($tag->term_id)
                ];
            }
        } elseif (is_author()) {
            $author = get_queried_object();
            if ($author) {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => $position,
                    "name" => $author->display_name,
                    "item" => get_author_posts_url($author->ID)
                ];
            }
        }
        
        return $breadcrumbs;
    }
    
    /**
     * Get breadcrumbs for parent pages (recursive)
     */
    private function get_parent_breadcrumbs($parent_id, $breadcrumb_config, $start_position) {
        $breadcrumbs = [];
        $position = $start_position;
        
        $parent_post = get_post($parent_id);
        if (!$parent_post) {
            return $breadcrumbs;
        }
        
        // If this parent has a parent, get those first (recursive)
        if ($parent_post->post_parent) {
            $grandparent_breadcrumbs = $this->get_parent_breadcrumbs($parent_post->post_parent, $breadcrumb_config, $position);
            $breadcrumbs = array_merge($breadcrumbs, $grandparent_breadcrumbs);
            $position += count($grandparent_breadcrumbs);
        }
        
        // Add this parent
        $custom_labels = $breadcrumb_config['customLabels'] ?? [];
        $parent_title = $custom_labels[$parent_id] ?? $parent_post->post_title;
        
        $breadcrumbs[] = [
            "@type" => "ListItem",
            "position" => $position,
            "name" => $parent_title,
            "item" => get_permalink($parent_id)
        ];
        
        return $breadcrumbs;
    }
    private function output_verification_meta_tags($meta_settings) {
        // Google Search Console verification
        if (!empty($meta_settings['google_site_verification'])) {
            $verification = esc_attr($meta_settings['google_site_verification']);
            echo "<meta name=\"google-site-verification\" content=\"{$verification}\" />\n";
        }
        
        // Bing Webmaster Tools verification
        if (!empty($meta_settings['bing_site_verification'])) {
            $verification = esc_attr($meta_settings['bing_site_verification']);
            echo "<meta name=\"msvalidate.01\" content=\"{$verification}\" />\n";
        }
        
        // Facebook domain verification
        if (!empty($meta_settings['facebook_domain_verification'])) {
            $verification = esc_attr($meta_settings['facebook_domain_verification']);
            echo "<meta name=\"facebook-domain-verification\" content=\"{$verification}\" />\n";
        }
        
        // Pinterest verification
        if (!empty($meta_settings['pinterest_site_verification'])) {
            $verification = esc_attr($meta_settings['pinterest_site_verification']);
            echo "<meta name=\"p:domain_verify\" content=\"{$verification}\" />\n";
        }
        
        // Yandex verification
        if (!empty($meta_settings['yandex_verification'])) {
            $verification = esc_attr($meta_settings['yandex_verification']);
            echo "<meta name=\"yandex-verification\" content=\"{$verification}\" />\n";
        }
        
        // Baidu verification
        if (!empty($meta_settings['baidu_site_verification'])) {
            $verification = esc_attr($meta_settings['baidu_site_verification']);
            echo "<meta name=\"baidu-site-verification\" content=\"{$verification}\" />\n";
        }
        
        // Ahrefs verification
        if (!empty($meta_settings['ahrefs_site_verification'])) {
            $verification = esc_attr($meta_settings['ahrefs_site_verification']);
            echo "<meta name=\"ahrefs-site-verification\" content=\"{$verification}\" />\n";
        }
    }
    
    /**
     * Output tracking codes that belong in the head section
     */
    private function output_tracking_codes_head($meta_settings) {
        // Google Analytics 4
        if (!empty($meta_settings['google_analytics_id'])) {
            $ga4_id = esc_attr($meta_settings['google_analytics_id']);
            echo "<!-- Google Analytics 4 -->\n";
            echo "<script async src=\"https://www.googletagmanager.com/gtag/js?id={$ga4_id}\"></script>\n";
            echo "<script>\n";
            echo "  window.dataLayer = window.dataLayer || [];\n";
            echo "  function gtag(){dataLayer.push(arguments);}\n";
            echo "  gtag('js', new Date());\n";
            echo "  gtag('config', '{$ga4_id}');\n";
            echo "</script>\n\n";
        }
        
        // Google Tag Manager
        if (!empty($meta_settings['google_tag_manager_id'])) {
            $gtm_id = esc_attr($meta_settings['google_tag_manager_id']);
            echo "<!-- Google Tag Manager -->\n";
            echo "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n";
            echo "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n";
            echo "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n";
            echo "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n";
            echo "})(window,document,'script','dataLayer','{$gtm_id}');</script>\n\n";
        }
        
        // Facebook Pixel
        if (!empty($meta_settings['facebook_pixel_id'])) {
            $pixel_id = esc_attr($meta_settings['facebook_pixel_id']);
            echo "<!-- Facebook Pixel -->\n";
            echo "<script>\n";
            echo "!function(f,b,e,v,n,t,s)\n";
            echo "{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n";
            echo "n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n";
            echo "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n";
            echo "n.queue=[];t=b.createElement(e);t.async=!0;\n";
            echo "t.src=v;s=b.getElementsByTagName(e)[0];\n";
            echo "s.parentNode.insertBefore(t,s)}(window,document,'script',\n";
            echo "'https://connect.facebook.net/en_US/fbevents.js');\n";
            echo "fbq('init', '{$pixel_id}');\n";
            echo "fbq('track', 'PageView');\n";
            echo "</script>\n";
            echo "<noscript>\n";
            echo "<img height=\"1\" width=\"1\" style=\"display:none\"\n";
            echo "src=\"https://www.facebook.com/tr?id={$pixel_id}&ev=PageView&noscript=1\"/>\n";
            echo "</noscript>\n\n";
        }
        
        // Microsoft Clarity
        if (!empty($meta_settings['microsoft_clarity_id'])) {
            $clarity_id = esc_attr($meta_settings['microsoft_clarity_id']);
            echo "<!-- Microsoft Clarity -->\n";
            echo "<script type=\"text/javascript\">\n";
            echo "(function(c,l,a,r,i,t,y){\n";
            echo "    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};\n";
            echo "    t=l.createElement(r);t.async=1;t.src=\"https://www.clarity.ms/tag/\"+i;\n";
            echo "    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);\n";
            echo "})(window, document, \"clarity\", \"script\", \"{$clarity_id}\");\n";
            echo "</script>\n\n";
        }
        
        // TikTok Pixel
        if (!empty($meta_settings['tiktok_pixel_id'])) {
            $tiktok_id = esc_attr($meta_settings['tiktok_pixel_id']);
            echo "<!-- TikTok Pixel Code -->\n";
            echo "<script>\n";
            echo "!function (w, d, t) {\n";
            echo "  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=[\"page\",\"track\",\"identify\",\"instances\",\"debug\",\"on\",\"off\",\"once\",\"ready\",\"alias\",\"group\",\"enableCookie\",\"disableCookie\"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i=\"https://analytics.tiktok.com/i18n/pixel/events.js\";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement(\"script\");n.type=\"text/javascript\",n.async=!0,n.src=i+\"?sdkid=\"+e+\"&lib=\"+t;e=document.getElementsByTagName(\"script\")[0];e.parentNode.insertBefore(n,e)};\n";
            echo "  ttq.load('{$tiktok_id}');\n";
            echo "  ttq.page();\n";
            echo "}(window, document, 'ttq');\n";
            echo "</script>\n\n";
        }
        
        // Custom head scripts - BE CAREFUL WITH THESE!
        if (!empty($meta_settings['custom_head_scripts'])) {
            echo "<!-- Custom Head Scripts -->\n";
            // Output custom scripts - these should already be sanitized in the API
            echo $meta_settings['custom_head_scripts'] . "\n\n";
        }
    }
    
    /**
     * Output tracking codes that belong in the body section
     */
    public function output_body_tracking_codes() {
        static $already_output = false;
        if ($already_output) {
            return;
        }
        $already_output = true;
        
        if (defined('REST_REQUEST') && REST_REQUEST) {
            return;
        }
        
        $meta_settings = $this->get_current_page_meta();
        
        echo "<!-- SEO Plugin Body Tracking START -->\n";
        
        // Google Tag Manager (noscript)
        if (!empty($meta_settings['google_tag_manager_id'])) {
            $gtm_id = esc_attr($meta_settings['google_tag_manager_id']);
            echo "<!-- Google Tag Manager (noscript) -->\n";
            echo "<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id={$gtm_id}\"\n";
            echo "height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>\n\n";
        }
        
        // Custom body scripts
        if (!empty($meta_settings['custom_body_scripts'])) {
            echo "<!-- Custom Body Scripts -->\n";
            echo $meta_settings['custom_body_scripts'] . "\n\n";
        }
        
        echo "<!-- SEO Plugin Body Tracking END -->\n";
    }
    
    /**
     * Fallback for themes that don't support wp_body_open
     */
    public function output_body_tracking_codes_fallback() {
        if (!did_action('wp_body_open')) {
            $this->output_body_tracking_codes();
        }
    }
    
    /**
     * Filter the page title
     */
    public function filter_page_title($title) {
        $meta_settings = $this->get_current_page_meta();
        
        if (!empty($meta_settings['meta_title'])) {
            return $meta_settings['meta_title'];
        }
        
        return $title;
    }
}