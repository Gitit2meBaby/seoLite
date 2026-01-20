<?php
/**
 * Admin Pages for SEO Plugin
 * This creates the admin menu and handles loading our React dashboard
 */

class SEO_Plugin_Admin_Pages {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }
    
    /**
     * Add admin menu pages
     */
    public function add_admin_menu() {
        // Main SEO settings page
        add_menu_page(
            __('SEO Settings', 'seo-plugin'),      // Page title
            __('SEO Plugin', 'seo-plugin'),        // Menu title
            'manage_options',                       // Capability required
            'seo-plugin',                          // Menu slug
            [$this, 'admin_page_callback'],       // Callback function
            'dashicons-search',                    // Icon
            30                                     // Position
        );
    }
    
    /**
     * Main admin page callback - this creates the HTML container for React
     */
    public function admin_page_callback() {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('SEO Plugin Settings', 'seo-plugin') . '</h1>';
        
        // For now, let's just show some basic content
        echo '<div id="seo-plugin-admin">';
        echo '<p>SEO Plugin is working! This is where your React dashboard will load.</p>';
        echo '<p>Current site title: <strong>' . esc_html(get_bloginfo('name')) . '</strong></p>';
        echo '<p>Current site description: <strong>' . esc_html(get_bloginfo('description')) . '</strong></p>';
        echo '</div>';
        
        echo '</div>';
    }
    
    /**
     * Enqueue admin assets (we'll add React later)
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our plugin page
        if ($hook !== 'toplevel_page_seo-plugin') {
            return;
        }
        
        // For now, just add some basic CSS
        wp_add_inline_style('wp-admin', '
            #seo-plugin-admin {
                background: #f9f9f9;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
            }
        ');
        
        // Pass basic data to JavaScript (for when we add React)
        wp_localize_script('wp-admin', 'seoPluginData', [
            'apiUrl' => rest_url('seo-plugin/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'strings' => [
                'loading' => __('Loading...', 'seo-plugin'),
            ]
        ]);
    }
}