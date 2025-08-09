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
            'number' => 100
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
            'numberposts' => 50
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
        
        // Debug logging
        error_log("SEO Plugin: Getting settings for page: {$page_id}");
        
        // Get settings from WordPress options table
        $settings = get_option("seo_plugin_page_{$page_id}", []);
        
        error_log("SEO Plugin: Raw settings from DB: " . print_r($settings, true));
        
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
        error_log("SEO Plugin: === SAVE DEBUG START ===");
        error_log("SEO Plugin: Saving settings for page: {$page_id}");
        error_log("SEO Plugin: Raw input data: " . print_r($settings, true));
        
        // Enhanced sanitization that preserves all schema fields
        $clean_settings = $this->sanitize_all_settings($settings);
        error_log("SEO Plugin: Clean settings after sanitization: " . print_r($clean_settings, true));
        
        // Save to WordPress options table
        $option_name = "seo_plugin_page_{$page_id}";
        $result = update_option($option_name, $clean_settings);
        
        error_log("SEO Plugin: update_option({$option_name}) result: " . ($result ? 'true' : 'false'));
        
        // Verify the save worked
        $saved_value = get_option($option_name, null);
        error_log("SEO Plugin: Verification - saved value: " . print_r($saved_value, true));
        
        $actually_saved = ($saved_value !== null);
        error_log("SEO Plugin: Actually saved: " . ($actually_saved ? 'true' : 'false'));
        error_log("SEO Plugin: === SAVE DEBUG END ===");
        
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
     * Enhanced sanitization that handles all field types including schema
     */
    private function sanitize_all_settings($settings) {
        if (!is_array($settings)) {
            return [];
        }
        
        $clean = [];
        
        foreach ($settings as $key => $value) {
            $clean[$key] = $this->sanitize_field($key, $value);
        }
        
        return $clean;
    }
    
    /**
     * Sanitize individual field based on its type and content
     */
    private function sanitize_field($key, $value) {
        // Handle different field types
        switch ($key) {
            // Schema fields
            case 'schemaType':
                // Allow valid schema types
                $allowed_schemas = [
                    'Organization', 'LocalBusiness', 'Restaurant', 'Store', 
                    'Article', 'NewsArticle', 'Product', 'Service', 'Person', 
                    'Event', 'Recipe', 'Book', 'Course', 'WebSite', 'WebPage'
                ];
                return in_array($value, $allowed_schemas) ? $value : '';
                
            case 'offerCatalog':
                // Handle service catalog array
                if (is_array($value)) {
                    $clean_services = [];
                    foreach ($value as $service) {
                        if (is_array($service) && !empty($service['name'])) {
                            $clean_services[] = [
                                'name' => sanitize_text_field($service['name']),
                                'description' => sanitize_textarea_field($service['description'] ?? ''),
                                'serviceType' => sanitize_text_field($service['serviceType'] ?? ''),
                                'areaServed' => sanitize_text_field($service['areaServed'] ?? '')
                            ];
                        }
                    }
                    return $clean_services;
                }
                return [];
                
            // URL fields
            case 'url':
            case 'canonical_url':
            case 'image':
            case 'logo':
                return esc_url_raw($value);
                
            // Text fields
            case 'name':
            case 'meta_title':
            case 'meta_author':
            case 'meta_copyright':
            case 'generator':
            case 'headline':
            case 'brand':
            case 'model':
            case 'sku':
            case 'jobTitle':
            case 'worksFor':
            case 'nationality':
            case 'alumniOf':
                return sanitize_text_field($value);
                
            // Textarea fields
            case 'description':
            case 'meta_description':
            case 'meta_keywords':
            case 'articleBody':
                return sanitize_textarea_field($value);
                
            // Select fields with known values
            case 'robots_index':
                return in_array($value, ['index', 'noindex']) ? $value : 'index';
                
            case 'robots_follow':
                return in_array($value, ['follow', 'nofollow']) ? $value : 'follow';
                
            case 'charset':
                return in_array($value, ['UTF-8', 'ISO-8859-1', 'UTF-16']) ? $value : 'UTF-8';
                
            // Color fields
            case 'theme_color':
                return preg_match('/^#[0-9A-Fa-f]{6}$/', $value) ? $value : '';
                
            // Date fields
            case 'date_published':
            case 'date_modified':
            case 'datePublished':
            case 'dateModified':
            case 'startDate':
            case 'endDate':
                // Basic date validation
                return sanitize_text_field($value);
                
            // Number fields
            case 'wordCount':
            case 'numberOfEmployees':
            case 'numberOfPages':
            case 'prepTime':
            case 'cookTime':
            case 'totalTime':
                return is_numeric($value) ? intval($value) : 0;
                
            // Object fields (complex data structures)
            case 'address':
            case 'author':
            case 'publisher':
            case 'organizer':
            case 'location':
            case 'offers':
            case 'aggregateRating':
            case 'review':
            case 'openingHours':
                if (is_array($value)) {
                    return $this->sanitize_object_field($value);
                }
                return [];
                
            // Array fields
            case 'sameAs':
            case 'recipeIngredient':
            case 'recipeInstructions':
            case 'paymentAccepted':
            case 'servesCuisine':
                if (is_array($value)) {
                    return array_map('sanitize_text_field', array_filter($value));
                } elseif (is_string($value)) {
                    // Handle newline-separated strings
                    $items = explode("\n", $value);
                    return array_map('sanitize_text_field', array_filter($items));
                }
                return [];
                
            // Social media fields
            case 'og_title':
            case 'og_description':
            case 'twitter_title':
            case 'twitter_description':
            case 'og_site_name':
            case 'twitter_site':
            case 'twitter_creator':
                return sanitize_text_field($value);
                
            case 'og_image':
            case 'twitter_image':
            case 'social_default_image':
            case 'social_twitter_image':
                return esc_url_raw($value);
                
            // Default: sanitize as text
            default:
                if (is_string($value)) {
                    return sanitize_text_field($value);
                } elseif (is_array($value)) {
                    return $this->sanitize_object_field($value);
                }
                return $value;
        }
    }
    
    /**
     * Sanitize object/array fields recursively
     */
    private function sanitize_object_field($data) {
        if (!is_array($data)) {
            return [];
        }
        
        $clean = [];
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $clean[sanitize_key($key)] = sanitize_text_field($value);
            } elseif (is_array($value)) {
                $clean[sanitize_key($key)] = $this->sanitize_object_field($value);
            } else {
                $clean[sanitize_key($key)] = $value;
            }
        }
        
        return $clean;
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