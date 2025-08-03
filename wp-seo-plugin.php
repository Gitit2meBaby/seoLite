<?php
/**
 * Plugin Name: WP SEO Plugin
 * Plugin URI: https://example.com
 * Description: A comprehensive SEO plugin for WordPress with React-powered admin interface
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit('Direct access forbidden.');
}

define('SEO_PLUGIN_VERSION', '1.0.0');
define('SEO_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('SEO_PLUGIN_URL', plugin_dir_url(__FILE__));

class WP_SEO_Plugin {
    
    private $tab_manager;
    private $meta_output;
    private $meta_api;
    
    public function __construct() {
        // Load all our classes
        $this->load_includes();
        
        add_action('init', array($this, 'init'));
        register_activation_hook(__FILE__, array($this, 'activate'));
    }
    
    /**
     * Load all the PHP classes our plugin needs
     */
    private function load_includes() {
        $includes = [
            'includes/class-seo-plugin-tab-manager.php',
            'includes/class-seo-plugin-meta-output.php', 
            'includes/class-seo-plugin-meta-api.php'
        ];
        
        foreach ($includes as $file) {
            $filepath = SEO_PLUGIN_PATH . $file;
            if (file_exists($filepath)) {
                require_once $filepath;
                // Removed debug echo to prevent JSON interference
            }
        }
    }
    
    public function init() {
        // Initialize all our classes
        if (class_exists('SEO_Plugin_Tab_Manager')) {
            $this->tab_manager = SEO_Plugin_Tab_Manager::get_instance();
        }
        
        if (class_exists('SEO_Plugin_Meta_Output')) {
            $this->meta_output = SEO_Plugin_Meta_Output::get_instance();
        }
        
        if (class_exists('SEO_Plugin_Meta_API')) {
            $this->meta_api = SEO_Plugin_Meta_API::get_instance();
        }
        
        // WordPress hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'SEO Settings',
            'SEO Plugin', 
            'manage_options',
            'seo-plugin',
            array($this, 'admin_page'),
            'dashicons-search',
            30
        );
    }
    
    public function admin_page() {
        echo '<div class="wrap">';
        echo '<h1>SEO Plugin Dashboard</h1>';
        
        // Success indicator
        echo '<div style="background: #28a745; color: white; padding: 15px; margin: 15px 0; border-radius: 6px;">';
        echo '<h3>✅ SEO Plugin Active</h3>';
        echo '<p>Meta output system: ' . (class_exists('SEO_Plugin_Meta_Output') ? 'Loaded' : 'Not loaded') . '</p>';
        echo '<p>API endpoints: ' . (class_exists('SEO_Plugin_Meta_API') ? 'Loaded' : 'Not loaded') . '</p>';
        echo '<p>Deployment time: ' . date('Y-m-d H:i:s') . '</p>';
        echo '</div>';
        
        // React container
        echo '<div id="seo-plugin-admin">';
        echo '<p>Loading React dashboard...</p>';
        echo '</div>';
        
        echo '</div>';
    }
    
    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_seo-plugin') {
            return;
        }
        
        $dist_path = SEO_PLUGIN_PATH . 'dist/';
        $dist_url = SEO_PLUGIN_URL . 'dist/';
        
        // Find and load JS file
        $admin_js_file = $this->find_asset_file($dist_path, 'admin', '.js');
        $admin_css_file = $this->find_asset_file($dist_path, 'admin', '.css');
        
        if ($admin_js_file) {
            wp_enqueue_script(
                'seo-plugin-admin',
                $dist_url . $admin_js_file,
                array('wp-element'),
                SEO_PLUGIN_VERSION . '-' . filemtime($dist_path . $admin_js_file),
                true
            );
        }
        
        if ($admin_css_file) {
            wp_enqueue_style(
                'seo-plugin-admin',
                $dist_url . $admin_css_file,
                array(),
                SEO_PLUGIN_VERSION . '-' . filemtime($dist_path . $admin_css_file)
            );
        }
        
        // Pass data to JavaScript
        $tab_data = $this->tab_manager ? $this->tab_manager->get_tabs_for_frontend() : [];
        
        wp_localize_script('seo-plugin-admin', 'seoPluginData', array(
            'apiUrl' => rest_url('seo-plugin/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'siteUrl' => home_url(),
            'siteName' => get_bloginfo('name'),
            'tabs' => $tab_data,
            'strings' => array(
                'loading' => __('Loading...', 'seo-plugin'),
                'selectTab' => __('Select a tab to get started', 'seo-plugin')
            )
        ));
    }
    
    /**
     * Helper function to find asset files (handles hashed filenames)
     */
    private function find_asset_file($dist_path, $name, $extension) {
        if (!is_dir($dist_path)) {
            return null;
        }
        
        $files = scandir($dist_path);
        foreach ($files as $file) {
            if (strpos($file, $name) !== false && strpos($file, $extension) !== false) {
                return $file;
            }
        }
        
        return null;
    }
    
    public function activate() {
        // Set default settings
        $this->set_default_settings();
        
        update_option('seo_plugin_version', SEO_PLUGIN_VERSION);
        flush_rewrite_rules();
    }
    
    /**
     * Set up default global settings
     */
    private function set_default_settings() {
        $defaults = [
            'meta_title' => get_bloginfo('name'),
            'meta_description' => get_bloginfo('description'),
            'robots_index' => 'index',
            'robots_follow' => 'follow',
            'hreflang' => '',
            'canonical_url' => '',
            'meta_keywords' => '',
            'date_published' => '',
            'date_modified' => ''
        ];
        
        // Only set if not already exists
        if (!get_option('seo_plugin_page_global')) {
            update_option('seo_plugin_page_global', $defaults);
        }
    }
}

// Initialize the plugin
new WP_SEO_Plugin();