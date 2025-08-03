<?php
/**
 * Plugin Name: WP SEO Plugin
 * Plugin URI: https://example.com
 * Description: A simple SEO plugin for WordPress development
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
    
    public function __construct() {
        // Load our Tab Manager class if it exists
        $tab_manager_file = SEO_PLUGIN_PATH . 'includes/class-seo-plugin-tab-manager.php';
        if (file_exists($tab_manager_file)) {
            require_once $tab_manager_file;
        }
        
        add_action('init', array($this, 'init'));
        register_activation_hook(__FILE__, array($this, 'activate'));
    }
    
    public function init() {
        // Initialize the Tab Manager if class exists
        if (class_exists('SEO_Plugin_Tab_Manager')) {
            $this->tab_manager = SEO_Plugin_Tab_Manager::get_instance();
        }
        
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_head', array($this, 'add_meta_tags'), 1);
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
        // Get current timestamp to verify this is the new version
        $deployment_time = date('Y-m-d H:i:s');
        
        echo '<div class="wrap">';
        echo '<h1>SEO Plugin Dashboard</h1>';
        
        // BIG OBVIOUS BANNER to show this is the new version
        echo '<div style="background: #28a745; color: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">';
        echo '<h2>🚀 NEW VERSION LOADED!</h2>';
        echo '<p><strong>Deployment Time:</strong> ' . $deployment_time . '</p>';
        echo '<p>If you can see this green banner, the new PHP file is working!</p>';
        echo '</div>';
        
        // DEBUG: Show what files exist
        echo '<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 4px;">';
        echo '<h3>🔍 Debug Information:</h3>';
        echo '<p><strong>Plugin Path:</strong> ' . SEO_PLUGIN_PATH . '</p>';
        echo '<p><strong>Plugin URL:</strong> ' . SEO_PLUGIN_URL . '</p>';
        
        // Find actual CSS and JS files in dist directory
        $dist_path = SEO_PLUGIN_PATH . 'dist/';
        $css_files = [];
        $js_files = [];
        
        if (is_dir($dist_path)) {
            $files = scandir($dist_path);
            foreach ($files as $file) {
                if (strpos($file, 'admin') !== false && strpos($file, '.css') !== false) {
                    $css_files[] = $file;
                }
                if (strpos($file, 'admin') !== false && strpos($file, '.js') !== false) {
                    $js_files[] = $file;
                }
            }
        }
        
        echo '<h4>Found Assets:</h4>';
        echo '<p><strong>CSS files:</strong> ' . (empty($css_files) ? 'None' : implode(', ', $css_files)) . '</p>';
        echo '<p><strong>JS files:</strong> ' . (empty($js_files) ? 'None' : implode(', ', $js_files)) . '</p>';
        
        // Check if Tab Manager is loaded
        if ($this->tab_manager) {
            echo '<p>✅ Tab Manager: Loaded</p>';
            $tabs = $this->tab_manager->get_tabs_for_frontend();
            echo '<p>📊 Available tabs: ' . count($tabs) . ' tabs</p>';
            echo '<p>📋 Tab IDs: ' . implode(', ', array_keys($tabs)) . '</p>';
        } else {
            echo '<p>❌ Tab Manager: Not loaded</p>';
        }
        
        echo '</div>';
        
        echo '<div id="seo-plugin-admin" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">';
        echo '<p>🔄 Loading React dashboard...</p>';
        echo '<p><em>React should replace this content if JavaScript is working.</em></p>';
        echo '</div>';
        echo '</div>';
    }
    
    /**
     * Smart asset loading - finds CSS and JS files even with hashed names
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our plugin page
        if ($hook !== 'toplevel_page_seo-plugin') {
            return;
        }
        
        $dist_path = SEO_PLUGIN_PATH . 'dist/';
        $dist_url = SEO_PLUGIN_URL . 'dist/';
        
        // Find admin JS file (could be admin.js or admin-hash.js)
        $admin_js_file = null;
        $admin_css_file = null;
        
        if (is_dir($dist_path)) {
            $files = scandir($dist_path);
            foreach ($files as $file) {
                if (strpos($file, 'admin') !== false && strpos($file, '.js') !== false) {
                    $admin_js_file = $file;
                }
                if (strpos($file, 'admin') !== false && strpos($file, '.css') !== false) {
                    $admin_css_file = $file;
                }
            }
        }
        
        // Load JavaScript
        if ($admin_js_file && file_exists($dist_path . $admin_js_file)) {
            wp_enqueue_script(
                'seo-plugin-admin',
                $dist_url . $admin_js_file,
                array('wp-element'), // WordPress provides React
                SEO_PLUGIN_VERSION . '-' . filemtime($dist_path . $admin_js_file),
                true
            );
            
            echo '<!-- SEO Plugin: Loaded JS: ' . $admin_js_file . ' -->';
        } else {
            echo '<!-- SEO Plugin: No admin JS file found -->';
        }
        
        // Load CSS
        if ($admin_css_file && file_exists($dist_path . $admin_css_file)) {
            wp_enqueue_style(
                'seo-plugin-admin',
                $dist_url . $admin_css_file,
                array(),
                SEO_PLUGIN_VERSION . '-' . filemtime($dist_path . $admin_css_file)
            );
            
            echo '<!-- SEO Plugin: Loaded CSS: ' . $admin_css_file . ' -->';
        } else {
            echo '<!-- SEO Plugin: No admin CSS file found -->';
        }
        
        // Pass data to JavaScript
        $tab_data = $this->tab_manager ? $this->tab_manager->get_tabs_for_frontend() : [];
        
        wp_localize_script('seo-plugin-admin', 'seoPluginData', array(
            'apiUrl' => rest_url('seo-plugin/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'tabs' => $tab_data,
            'strings' => array(
                'loading' => __('Loading...', 'seo-plugin'),
                'selectTab' => __('Select a tab to get started', 'seo-plugin')
            )
        ));
        
        echo '<!-- SEO Plugin: Data passed to JS -->';
    }
    
    public function add_meta_tags() {
        echo "<!-- WP SEO Plugin Active v" . SEO_PLUGIN_VERSION . " -->\n";
    }
    
    public function activate() {
        update_option('seo_plugin_version', SEO_PLUGIN_VERSION);
        flush_rewrite_rules();
    }
}

new WP_SEO_Plugin();
?>