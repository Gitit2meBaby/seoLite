<?php
/**
 * API Handler for Meta Settings
 * 
 * This class creates REST API endpoints that your React components can call
 * to save and load meta settings for different pages.
 */

class SEO_Plugin_Meta_API {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('rest_api_init', [$this, 'register_endpoints']);
    }
    
    /**
     * Register all API endpoints
     */
    public function register_endpoints() {
        
        // Get all pages/posts for the dropdown
        register_rest_route('seo-plugin/v1', '/pages', [
            'methods' => 'GET',
            'callback' => [$this, 'get_pages'],
            'permission_callback' => [$this, 'check_permissions']
        ]);
        
        // Get meta settings for a specific page
        register_rest_route('seo-plugin/v1', '/meta/(?P<page_id>[a-zA-Z0-9_-]+)', [
            'methods' => 'GET', 
            'callback' => [$this, 'get_meta_settings'],
            'permission_callback' => [$this, 'check_permissions']
        ]);
        
        // Save meta settings for a specific page
        register_rest_route('seo-plugin/v1', '/meta/(?P<page_id>[a-zA-Z0-9_-]+)', [
            'methods' => 'POST',
            'callback' => [$this, 'save_meta_settings'],
            'permission_callback' => [$this, 'check_permissions']
        ]);
        
        // Get preview of how meta tags will look
        register_rest_route('seo-plugin/v1', '/meta/(?P<page_id>[a-zA-Z0-9_-]+)/preview', [
            'methods' => 'GET',
            'callback' => [$this, 'get_meta_preview'], 
            'permission_callback' => [$this, 'check_permissions']
        ]);
    }
    
    /**
     * Check if user has permission to access these endpoints
     */
    public function check_permissions() {
        return current_user_can('manage_options');
    }
    
    /**
     * Get all pages and posts for the dropdown selector
     * This returns a list of all content that can have meta tags
     */
    public function get_pages($request) {
        $pages = [];
        
        // Add global settings option
        $pages[] = [
            'id' => 'global',
            'title' => 'Global Defaults',
            'type' => 'global',
            'url' => null
        ];
        
        // Get all published pages
        $wp_pages = get_pages([
            'post_status' => 'publish',
            'number' => 100  // Limit to avoid performance issues
        ]);
        
        foreach ($wp_pages as $page) {
            $pages[] = [
                'id' => (string) $page->ID,
                'title' => $page->post_title,
                'type' => 'page',
                'url' => str_replace(home_url(), '', get_permalink($page->ID))
            ];
        }
        
        // Get recent posts
        $wp_posts = get_posts([
            'post_status' => 'publish',
            'post_type' => 'post',
            'numberposts' => 50  // Limit to recent posts
        ]);
        
        foreach ($wp_posts as $post) {
            $pages[] = [
                'id' => (string) $post->ID,
                'title' => $post->post_title,
                'type' => 'post', 
                'url' => str_replace(home_url(), '', get_permalink($post->ID))
            ];
        }
        
        // Add special pages
        $pages[] = [
            'id' => 'home',
            'title' => 'Home Page',
            'type' => 'special',
            'url' => '/'
        ];
        
        return rest_ensure_response([
            'success' => true,
            'data' => $pages
        ]);
    }
    
    /**
     * Get meta settings for a specific page
     */
    public function get_meta_settings($request) {
        $page_id = $request['page_id'];
        
        // Get settings from WordPress options table
        $settings = get_option("seo_plugin_page_{$page_id}", []);
        
        // If no settings exist, return empty array (React will use defaults)
        return rest_ensure_response([
            'success' => true,
            'data' => $settings
        ]);
    }
    
    /**
     * Save meta settings for a specific page
     */
    public function save_meta_settings($request) {
        $page_id = $request['page_id'];
        $settings = $request->get_json_params();
        
        // Debug logging
        error_log("SEO Plugin: Saving settings for page: {$page_id}");
        error_log("SEO Plugin: Raw settings: " . print_r($settings, true));
        
        // Validate and sanitize the settings
        $clean_settings = $this->sanitize_meta_settings($settings);
        error_log("SEO Plugin: Clean settings: " . print_r($clean_settings, true));
        
        // Save to WordPress options table
        $option_name = "seo_plugin_page_{$page_id}";
        $result = update_option($option_name, $clean_settings);
        
        error_log("SEO Plugin: update_option result: " . ($result ? 'true' : 'false'));
        error_log("SEO Plugin: Option name: {$option_name}");
        
        // Note: update_option returns false if the value is the same as what's already stored
        // So we should check if the option actually exists now
        $saved_value = get_option($option_name, null);
        $actually_saved = ($saved_value !== null);
        
        error_log("SEO Plugin: Verification - option exists: " . ($actually_saved ? 'true' : 'false'));
        
        if ($actually_saved) {
            return rest_ensure_response([
                'success' => true,
                'message' => 'Meta settings saved successfully'
            ]);
        } else {
            return rest_ensure_response([
                'success' => false,
                'message' => 'Failed to save meta settings - option not created'
            ]);
        }
    }
    
    /**
     * Get a preview of how the meta tags will appear
     */
    public function get_meta_preview($request) {
        $page_id = $request['page_id'];
        
        // Get the meta settings
        $settings = get_option("seo_plugin_page_{$page_id}", []);
        
        // Generate preview data
        $preview = [
            'title' => $settings['meta_title'] ?? 'Page title will appear here',
            'description' => $settings['meta_description'] ?? 'Meta description will appear here',
            'url' => $this->get_page_url($page_id),
            'canonical' => $settings['canonical_url'] ?? null,
            'robots' => [
                'index' => $settings['robots_index'] ?? 'index',
                'follow' => $settings['robots_follow'] ?? 'follow'
            ],
            'hreflang' => $settings['hreflang'] ?? null,
            'dates' => [
                'published' => $settings['date_published'] ?? null,
                'modified' => $settings['date_modified'] ?? null
            ]
        ];
        
        return rest_ensure_response([
            'success' => true,
            'data' => $preview
        ]);
    }
    
    /**
     * Sanitize meta settings to prevent XSS and ensure data integrity
     */
    private function sanitize_meta_settings($settings) {
        $clean = [];
        
        // Text fields that should be sanitized as text
        $text_fields = ['meta_title', 'meta_description', 'meta_keywords', 'meta_author', 'meta_copyright', 'generator'];
        foreach ($text_fields as $field) {
            if (isset($settings[$field])) {
                $clean[$field] = sanitize_text_field($settings[$field]);
            }
        }
        
        // URL fields
        if (isset($settings['canonical_url'])) {
            $clean['canonical_url'] = esc_url_raw($settings['canonical_url']);
        }
        
        // Select fields with allowed values
        if (isset($settings['robots_index'])) {
            $clean['robots_index'] = in_array($settings['robots_index'], ['index', 'noindex']) 
                ? $settings['robots_index'] : 'index';
        }
        
        if (isset($settings['robots_follow'])) {
            $clean['robots_follow'] = in_array($settings['robots_follow'], ['follow', 'nofollow']) 
                ? $settings['robots_follow'] : 'follow';
        }
        
        if (isset($settings['robots_advanced'])) {
            $allowed_robots = ['', 'noarchive', 'nosnippet', 'noimageindex', 'notranslate', 'max-snippet:-1', 'max-image-preview:large'];
            $clean['robots_advanced'] = in_array($settings['robots_advanced'], $allowed_robots) 
                ? $settings['robots_advanced'] : '';
        }
        
        // Character encoding
        if (isset($settings['charset'])) {
            $allowed_charsets = ['UTF-8', 'ISO-8859-1', 'UTF-16'];
            $clean['charset'] = in_array($settings['charset'], $allowed_charsets) 
                ? $settings['charset'] : 'UTF-8';
        }
        
        // Viewport
        if (isset($settings['viewport'])) {
            $clean['viewport'] = sanitize_text_field($settings['viewport']);
        }
        
        // Language code validation
        if (isset($settings['hreflang'])) {
            $clean['hreflang'] = preg_match('/^[a-z]{2}(-[A-Z]{2})?$/', $settings['hreflang']) 
                ? $settings['hreflang'] : '';
        }
        
        // Color validation
        if (isset($settings['theme_color'])) {
            $clean['theme_color'] = preg_match('/^#[0-9A-Fa-f]{6}$/', $settings['theme_color']) 
                ? $settings['theme_color'] : '';
        }
        
        // Refresh/redirect
        if (isset($settings['refresh_redirect'])) {
            $clean['refresh_redirect'] = sanitize_text_field($settings['refresh_redirect']);
        }
        
        // Date fields
        $date_fields = ['date_published', 'date_modified'];
        foreach ($date_fields as $field) {
            if (isset($settings[$field]) && !empty($settings[$field])) {
                // Validate date format
                $date = DateTime::createFromFormat('Y-m-d\TH:i', $settings[$field]);
                if ($date !== false) {
                    $clean[$field] = $settings[$field];
                }
            }
        }
        
        return $clean;
    }
    
    /**
     * Get the URL for a specific page ID
     */
    private function get_page_url($page_id) {
        if ($page_id === 'global') {
            return 'Global settings (applies to all pages without specific settings)';
        } elseif ($page_id === 'home') {
            return home_url('/');
        } elseif (is_numeric($page_id)) {
            return get_permalink($page_id);
        }
        
        return '/page-url';
    }
}