<?php
/**
 * DEBUG VERSION - Meta Output Handler for SEO Plugin
 * Add this temporarily to see what's happening
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
        add_action('wp_head', [$this, 'debug_output'], 2);
        
        // Hook to add tracking codes to body
        add_action('wp_body_open', [$this, 'output_body_tracking_codes'], 1);
        add_action('wp_footer', [$this, 'output_body_tracking_codes_fallback'], 1);
        
        // Hook to modify page title
        add_filter('pre_get_document_title', [$this, 'filter_page_title'], 10, 1);
    }
    
    
    /**
     * UPDATE: Add this to your current output_meta_tags function
     * Replace your existing output_meta_tags function with this expanded version
     */
    public function output_meta_tags() {
        if (defined('REST_REQUEST') && REST_REQUEST) {
            return;
        }
        
        echo "<!-- SEO Plugin Meta Tags & Tracking START -->\n";
        
        $meta_settings = $this->get_current_page_meta();
        
        // ADD: Basic meta tags (charset, viewport, description, etc.)
        $this->output_basic_meta_tags($meta_settings);
        
        // ADD: Robots meta tags
        $this->output_robots_meta($meta_settings);
        
        // ADD: Other meta tags
        $this->output_other_meta_tags($meta_settings);
        
        // EXISTING: Verification meta tags
        $this->output_verification_meta_tags($meta_settings);
        
        // EXISTING: Tracking codes (head section)
        $this->output_tracking_codes_head($meta_settings);
        
        echo "<!-- SEO Plugin Meta Tags & Tracking END -->\n";
    }
    
    /**
     * Add this function to your class
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
     * ADD: New function for robots meta tags
     * Add this function to your class
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
        
        // Always output robots meta tag (so it shows in preview)
        $robots_content = implode(', ', $robots_parts);
        echo "<meta name=\"robots\" content=\"{$robots_content}\">\n";
    }
    
    /**
     * ADD: New function for other meta tags
     * Add this function to your class
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
     * Output verification meta tags
     */
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
        
        // Custom head scripts - LESS RESTRICTIVE FOR TESTING
        if (!empty($meta_settings['custom_head_scripts'])) {
            echo "<!-- Custom Head Scripts -->\n";
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