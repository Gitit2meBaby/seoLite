<!-- includes/class-seo-plugin-settings-manager  -->
<?php
/**
 * Settings Manager for SEO Plugin
 * 
 * This class handles the hierarchy of settings:
 * Global Settings -> Post Type Defaults -> Individual Post Settings
 * 
 * The hierarchy works like CSS cascading - more specific settings override general ones
 */

class SEO_Plugin_Settings_Manager {
    
    private static $instance = null;
    private $cache = [];
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Cache settings to avoid repeated database queries
        add_action('init', [$this, 'init_cache']);
    }
    
    public function init_cache() {
        // Load frequently used global settings into memory
        $this->cache['global'] = $this->get_global_settings();
    }
    
    /**
     * Get setting with hierarchy fallback
     * 
     * Order of precedence:
     * 1. Individual post setting (highest priority)
     * 2. Post type default setting
     * 3. Global setting (fallback)
     * 
     * @param string $key Setting key
     * @param int|null $post_id Post ID (null for current post)
     * @return mixed Setting value or null if not found
     */
    public function get_setting($key, $post_id = null) {
        if (null === $post_id) {
            $post_id = get_the_ID();
        }
        
        // Try individual post setting first
        if ($post_id) {
            $individual_value = $this->get_individual_setting($key, $post_id);
            if (null !== $individual_value) {
                return $individual_value;
            }
            
            // Try post type default
            $post_type = get_post_type($post_id);
            $post_type_value = $this->get_post_type_setting($key, $post_type);
            if (null !== $post_type_value) {
                return $post_type_value;
            }
        }
        
        // Fall back to global setting
        return $this->get_global_setting($key);
    }
    
    /**
     * Save setting at appropriate scope
     * 
     * @param string $key Setting key
     * @param mixed $value Setting value
     * @param string $scope 'global', 'post_type', or 'individual'
     * @param int|string $target Post ID for individual, post type for post_type
     */
    public function save_setting($key, $value, $scope = 'global', $target = null) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'seo_plugin_settings';
        
        $data = [
            'option_name' => $key,
            'option_value' => maybe_serialize($value),
            'scope' => $scope
        ];
        
        if ($scope === 'individual' && $target) {
            $data['post_id'] = intval($target);
            $data['post_type'] = get_post_type($target);
        } elseif ($scope === 'post_type' && $target) {
            $data['post_type'] = sanitize_text_field($target);
        }
        
        // Check if setting already exists
        $existing = $this->get_setting_record($key, $scope, $target);
        
        if ($existing) {
            // Update existing record
            $wpdb->update(
                $table_name,
                $data,
                ['id' => $existing->id],
                ['%s', '%s', '%s'],
                ['%d']
            );
        } else {
            // Insert new record
            $wpdb->insert($table_name, $data, ['%s', '%s', '%s']);
        }
        
        // Clear cache for this scope
        $this->clear_cache($scope, $target);
        
        return true;
    }
    
    /**
     * Get individual post setting
     */
    private function get_individual_setting($key, $post_id) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'seo_plugin_settings';
        
        $value = $wpdb->get_var($wpdb->prepare(
            "SELECT option_value FROM $table_name 
             WHERE option_name = %s AND scope = 'individual' AND post_id = %d",
            $key, $post_id
        ));
        
        return $value ? maybe_unserialize($value) : null;
    }
    
    /**
     * Get post type default setting
     */
    private function get_post_type_setting($key, $post_type) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'seo_plugin_settings';
        
        $value = $wpdb->get_var($wpdb->prepare(
            "SELECT option_value FROM $table_name 
             WHERE option_name = %s AND scope = 'post_type' AND post_type = %s",
            $key, $post_type
        ));
        
        return $value ? maybe_unserialize($value) : null;
    }
    
    /**
     * Get global setting
     */
    private function get_global_setting($key) {
        // Use WordPress options for global settings (simpler and cached by WordPress)
        return get_option('seo_plugin_' . $key, null);
    }
    
    /**
     * Get all global settings at once
     */
    private function get_global_settings() {
        // Get all plugin options from wp_options table
        global $wpdb;
        
        $results = $wpdb->get_results(
            "SELECT option_name, option_value FROM {$wpdb->options} 
             WHERE option_name LIKE 'seo_plugin_%'"
        );
        
        $settings = [];
        foreach ($results as $row) {
            $key = str_replace('seo_plugin_', '', $row->option_name);
            $settings[$key] = maybe_unserialize($row->option_value);
        }
        
        return $settings;
    }
    
    /**
     * Set default global settings on plugin activation
     */
    public static function set_default_settings() {
        $defaults = [
            'site_title' => get_bloginfo('name'),
            'site_description' => get_bloginfo('description'),
            'separator' => '|',
            'noindex_categories' => false,
            'noindex_tags' => false,
            'enable_schema' => true,
            'schema_organization_type' => 'Organization',
            'enable_analytics' => false,
            'enable_gtm' => false
        ];
        
        foreach ($defaults as $key => $value) {
            if (get_option('seo_plugin_' . $key) === false) {
                update_option('seo_plugin_' . $key, $value);
            }
        }
    }
    
    /**
     * Helper method to get existing setting record
     */
    private function get_setting_record($key, $scope, $target = null) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'seo_plugin_settings';
        
        $where = "option_name = %s AND scope = %s";
        $values = [$key, $scope];
        
        if ($scope === 'individual' && $target) {
            $where .= " AND post_id = %d";
            $values[] = intval($target);
        } elseif ($scope === 'post_type' && $target) {
            $where .= " AND post_type = %s";
            $values[] = sanitize_text_field($target);
        }
        
        return $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE $where",
            ...$values
        ));
    }
    
    /**
     * Clear cache for specific scope
     */
    private function clear_cache($scope, $target = null) {
        if ($scope === 'global') {
            unset($this->cache['global']);
        }
        // Add more cache clearing logic as needed
    }
}