<?php
/**
 * Meta Output Handler for SEO Plugin
 * 
 * This class handles outputting meta tags to the website's <head> section.
 * It works by:
 * 1. Detecting what page/post we're on
 * 2. Getting the saved meta settings for that page
 * 3. Outputting the appropriate meta tags
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
        // Hook into wp_head with high priority (1) so our meta tags come first
        add_action('wp_head', [$this, 'output_meta_tags'], 1);
        
        // Hook to modify page title
        add_filter('pre_get_document_title', [$this, 'filter_page_title'], 10, 1);
    }
    
    /**
     * Main function that outputs all meta tags
     * This runs on every page load on the frontend
     */
    public function output_meta_tags() {
        // Add our plugin identifier comment
        echo "<!-- SEO Plugin Meta Tags -->\n";
        
        // Get current page settings
        $meta_settings = $this->get_current_page_meta();
        
        // Output each type of meta tag
        $this->output_basic_meta_tags($meta_settings);
        $this->output_robots_meta($meta_settings);
        $this->output_canonical_url($meta_settings);
        $this->output_hreflang($meta_settings);
        $this->output_date_meta($meta_settings);
        
        echo "<!-- /SEO Plugin Meta Tags -->\n";
    }
    
    /**
     * Get meta settings for the current page
     * This is where the magic happens - we figure out what page we're on
     * and get the appropriate settings
     */
    private function get_current_page_meta() {
        global $post;
        
        $meta_settings = [];
        
        // Get the page/post ID we're currently viewing
        $current_page_id = $this->get_current_page_id();
        
        if ($current_page_id) {
            // Try to get specific settings for this page
            $page_settings = get_option("seo_plugin_page_{$current_page_id}", []);
            $meta_settings = array_merge($meta_settings, $page_settings);
        }
        
        // If no specific settings, fall back to global defaults
        if (empty($meta_settings)) {
            $global_settings = get_option('seo_plugin_page_global', []);
            $meta_settings = array_merge($meta_settings, $global_settings);
        }
        
        return $meta_settings;
    }
    
    /**
     * Figure out what page/post we're currently viewing
     * WordPress has many different types of pages (posts, pages, archives, etc.)
     */
    private function get_current_page_id() {
        global $post;
        
        if (is_front_page()) {
            // Home page
            return 'home';
        } elseif (is_page() || is_single()) {
            // Individual page or post
            return $post->ID;
        } elseif (is_category()) {
            // Category archive
            return 'category_' . get_queried_object_id();
        } elseif (is_tag()) {
            // Tag archive  
            return 'tag_' . get_queried_object_id();
        } elseif (is_author()) {
            // Author archive
            return 'author_' . get_queried_object_id();
        } elseif (is_archive()) {
            // Other archives
            return 'archive';
        } elseif (is_search()) {
            // Search results
            return 'search';
        } elseif (is_404()) {
            // 404 page
            return '404';
        }
        
        return null;
    }
    
    /**
     * Output basic meta tags (description, keywords)
     */
    private function output_basic_meta_tags($meta_settings) {
        // Meta description
        if (!empty($meta_settings['meta_description'])) {
            $description = esc_attr($meta_settings['meta_description']);
            echo "<meta name=\"description\" content=\"{$description}\">\n";
        }
        
        // Meta keywords (even though they're mostly ignored now)
        if (!empty($meta_settings['meta_keywords'])) {
            $keywords = esc_attr($meta_settings['meta_keywords']);
            echo "<meta name=\"keywords\" content=\"{$keywords}\">\n";
        }
    }
    
    /**
     * Output robots meta tags (index/noindex, follow/nofollow)
     */
    private function output_robots_meta($meta_settings) {
        $robots_parts = [];
        
        // Index setting
        $robots_index = $meta_settings['robots_index'] ?? 'index';
        $robots_parts[] = $robots_index;
        
        // Follow setting  
        $robots_follow = $meta_settings['robots_follow'] ?? 'follow';
        $robots_parts[] = $robots_follow;
        
        // Output robots meta tag
        $robots_content = implode(', ', $robots_parts);
        echo "<meta name=\"robots\" content=\"{$robots_content}\">\n";
    }
    
    /**
     * Output canonical URL
     * This tells search engines what the "official" URL is for this content
     */
    private function output_canonical_url($meta_settings) {
        $canonical_url = '';
        
        if (!empty($meta_settings['canonical_url'])) {
            // Use custom canonical URL if set
            $canonical_url = $meta_settings['canonical_url'];
        } else {
            // Fall back to WordPress default
            $canonical_url = get_permalink();
        }
        
        if ($canonical_url) {
            $canonical_url = esc_url($canonical_url);
            echo "<link rel=\"canonical\" href=\"{$canonical_url}\">\n";
        }
    }
    
    /**
     * Output hreflang tags for international SEO
     */
    private function output_hreflang($meta_settings) {
        if (!empty($meta_settings['hreflang'])) {
            $hreflang = esc_attr($meta_settings['hreflang']);
            $current_url = esc_url(get_permalink());
            echo "<link rel=\"alternate\" hreflang=\"{$hreflang}\" href=\"{$current_url}\">\n";
        }
    }
    
    /**
     * Output date-related meta tags
     */
    private function output_date_meta($meta_settings) {
        // Published date
        if (!empty($meta_settings['date_published'])) {
            $published_date = esc_attr($meta_settings['date_published']);
            echo "<meta property=\"article:published_time\" content=\"{$published_date}\">\n";
        }
        
        // Modified date
        if (!empty($meta_settings['date_modified'])) {
            $modified_date = esc_attr($meta_settings['date_modified']);
            echo "<meta property=\"article:modified_time\" content=\"{$modified_date}\">\n";
        }
    }
    
    /**
     * Filter the page title if we have a custom one set
     * This changes what appears in the browser tab
     */
    public function filter_page_title($title) {
        $meta_settings = $this->get_current_page_meta();
        
        if (!empty($meta_settings['meta_title'])) {
            return $meta_settings['meta_title'];
        }
        
        return $title;
    }
    
    /**
     * Get a preview of what meta tags would be output for a specific page
     * This is useful for the admin interface
     */
    public function get_meta_preview($page_id) {
        // Temporarily override the current page
        $original_post = $GLOBALS['post'] ?? null;
        
        if (is_numeric($page_id)) {
            $GLOBALS['post'] = get_post($page_id);
        }
        
        // Get meta settings
        $meta_settings = $this->get_current_page_meta();
        
        // Restore original post
        $GLOBALS['post'] = $original_post;
        
        return $meta_settings;
    }
}