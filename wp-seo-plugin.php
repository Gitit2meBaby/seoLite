<?php
/**
 * Plugin Name: SEOLite
 * Plugin URI: https://github.com/danielthomas/seolite
 * Description: The lightning-fast SEO plugin that's 40x smaller than the competition. Complete SEO toolkit with schema markup, social media optimization, analytics integration, and custom scripts - without the bloat.
 * Version: 1.0.0
 * Author: Daniel Thomas
 * Author URI: https://danielthomas.dev
 * Text Domain: seolite
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.7
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Network: false
 * 
 * SEOLite - Lightweight. Powerful. Fast.
 * 
 * Unlike bloated SEO plugins that slow down your site, SEOLite delivers enterprise-level
 * SEO features in a tiny package. Our entire plugin is smaller than most plugins' CSS files!
 * 
 * Features:
 * Essential meta tags & Open Graph optimization
 * Schema markup for rich snippets 
 * Analytics & tracking code management
 * Custom script injection points
 * Modern React-powered admin interface
 * No premium upsells or feature limitations
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
    private $simple_integration;
    
    public function __construct() {
        // Load all our classes
        $this->load_includes();
        
        add_action('init', array($this, 'init'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        
        // Add settings link in plugins list
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), array($this, 'add_settings_link'));
    }

    /**
     * Add settings link to plugins page
     */
    public function add_settings_link($links) {
        $settings_link = '<a href="' . admin_url('admin.php?page=seo-plugin') . '">' . __('Settings', 'seolite') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
    }

    /**
     * Schema injection method - kept for compatibility but handled by meta_output class
     */
    public function inject_schema_into_head() {
        // Don't output schema in admin area
        if (is_admin()) {
            return;
        }
        
        // The meta_output class handles this automatically via wp_head hook
        // This method is kept for backward compatibility
        return;
    }
    
    /**
     * Load all the PHP classes our plugin needs
     */
    private function load_includes() {
        $includes = [
            'includes/class-seo-plugin-tab-manager.php',
            'includes/class-seo-plugin-meta-output.php', 
            'includes/class-seo-plugin-meta-api.php',
            'includes/class-seo-plugin-simple-integration.php',
            'includes/class-seo-plugin-sitemap-handler.php'
        ];
        
        foreach ($includes as $file) {
            $filepath = SEO_PLUGIN_PATH . $file;
            if (file_exists($filepath)) {
                require_once $filepath;
            }
        }
    }
    
    /**
     * Initialize plugin components
     */
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
        
        if (class_exists('SEO_Plugin_Simple_Integration')) {
            $this->simple_integration = SEO_Plugin_Simple_Integration::get_instance();
        }
        
        // WordPress admin hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        
        // Load text domain for translations
        add_action('plugins_loaded', array($this, 'load_textdomain'));
    }

    /**
     * Load plugin text domain for translations
     */
    public function load_textdomain() {
        load_plugin_textdomain('seolite', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    /**
     * Add admin menu page
     */
    public function add_admin_menu() {
        add_menu_page(
            __('SEOLite Settings', 'seolite'),
            __('SEOLite', 'seolite'), 
            'manage_options',
            'seo-plugin',
            array($this, 'admin_page'),
            'dashicons-search',
            30
        );
    }
    
    /**
     * Render admin page
     */
    public function admin_page() {
        echo '<div class="wrap">';
        echo '<div style="display: flex; align-items: center; margin-bottom: 1rem;">';
        echo '<h1 style="margin: 0; margin-right: 1rem;">' . __('SEOLite Dashboard', 'seolite') . '</h1>';
        echo '</div>';
        echo '<p style="color: #666; margin-bottom: 2rem; font-size: 1.1rem;">' . __('Technical SEO covered... Metadata, tracking tags, custom script injection and schema creation all stripped bare to speed up your site.', 'seolite') . '</p>';
        
        // React container
        echo '<div id="seo-plugin-admin">';
        echo '<div style="padding: 2rem; text-align: center; background: #f9f9f9; border-radius: 8px;">';
        echo '<div class="spinner is-active" style="float: none; margin: 0 auto;"></div>';
        echo '<p style="margin-top: 1rem;">' . __('Loading SEOLite dashboard...', 'seolite') . '</p>';
        echo '</div>';
        echo '</div>';
        
        echo '</div>';
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_seo-plugin') {
            return;
        }
        
        $dist_path = SEO_PLUGIN_PATH . 'dist/';
        $dist_url = SEO_PLUGIN_URL . 'dist/';
        
        // Find and load JS and CSS files (supports hashed filenames)
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
            'pluginUrl' => SEO_PLUGIN_URL,
            'tabs' => $tab_data,
            'strings' => array(
                'loading' => __('Loading...', 'seolite'),
                'selectTab' => __('Select a tab to get started', 'seolite'),
                'saveSuccess' => __('Settings saved successfully!', 'seolite'),
                'saveError' => __('Failed to save settings. Please try again.', 'seolite')
            )
        ));
    }
    
    /**
     * Helper function to find asset files (handles hashed filenames from build process)
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
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Set default settings
        $this->set_default_settings();
        
        // Store plugin version
        update_option('seo_plugin_version', SEO_PLUGIN_VERSION);
        
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Set activation flag for welcome message
        set_transient('seolite_activation_notice', true, 60);
    }
    
    /**
     * Set up default global settings with sensible defaults
     */
    private function set_default_settings() {
        $defaults = [
            // Basic meta defaults
            'meta_title' => get_bloginfo('name'),
            'meta_description' => get_bloginfo('description'),
            
            // Essential technical defaults
            'charset' => 'UTF-8',
            'viewport' => 'width=device-width, initial-scale=1',
            
            // Robots defaults (SEO-friendly)
            'robots_index' => 'index',
            'robots_follow' => 'follow',
            'robots_advanced' => '',
            
            // Social media defaults
            'og_site_name' => get_bloginfo('name'),
            'og_locale' => get_locale(),
            'twitter_card_type' => 'summary_large_image',
            
            // Schema defaults
            'organization_name' => get_bloginfo('name'),
            'organization_url' => home_url(),
            
            // Other defaults
            'hreflang' => '',
            'canonical_url' => '',
            'author' => get_bloginfo('name'),
            'publisher' => get_bloginfo('name'),
        ];
        
        // Only set defaults if they don't exist
        $existing_settings = get_option('seo_plugin_page_global', []);
        if (empty($existing_settings)) {
            update_option('seo_plugin_page_global', $defaults);
        }
    }
}

// Initialize the plugin
new WP_SEO_Plugin();