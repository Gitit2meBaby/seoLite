<?php
/**
 * Admin Pages for SEO Plugin
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
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
    }
    
    /**
     * Add admin menu pages
     */
    public function add_admin_menu() {
        // Main SEO settings page
        add_menu_page(
            __('SEO Settings', 'seo-plugin'),
            __('SEO Plugin', 'seo-plugin'),
            'manage_options',
            'seo-plugin',
            [$this, 'admin_page_callback'],
            'dashicons-search',
            30
        );
    }
    
    /**
     * Main admin page callback - renders the React container
     */
    public function admin_page_callback() {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('SEO Plugin Settings', 'seo-plugin') . '</h1>';
        echo '<div id="seo-plugin-admin"></div>'; // React app mounts here
        echo '</div>';
    }
    
    /**
     * Enqueue admin assets (React app)
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our plugin pages
        if (!$this->is_seo_plugin_page($hook)) {
            return;
        }
        
        // Check if we're in development mode
        if ($this->is_development_mode()) {
            $this->enqueue_development_assets();
        } else {
            $this->enqueue_production_assets();
        }
        
        // Pass data to React components
        $this->localize_script_data();
    }
    
    /**
     * Check if current page is our plugin page
     */
    private function is_seo_plugin_page($hook) {
        return in_array($hook, [
            'toplevel_page_seo-plugin',
            'seo-plugin_page_seo-plugin-global'
        ]);
    }
    
    /**
     * Check if we're in development mode
     */
    private function is_development_mode() {
        return defined('WP_DEBUG') && WP_DEBUG && $this->vite_dev_server_running();
    }
    
    /**
     * Check if Vite dev server is running
     */
    private function vite_dev_server_running() {
        $context = stream_context_create([
            'http' => ['timeout' => 1]
        ]);
        
        return @file_get_contents('http://localhost:5173/@vite/client', false, $context) !== false;
    }
    
    /**
     * Enqueue development assets (from Vite dev server)
     */
    private function enqueue_development_assets() {
        // Vite client for hot reload
        wp_enqueue_script(
            'vite-client',
            'http://localhost:5173/@vite/client',
            [],
            null
        );
        wp_script_add_data('vite-client', 'type', 'module');
        
        // Main React entry point
        wp_enqueue_script(
            'seo-plugin-admin',
            'http://localhost:5173/assets/js/admin.jsx',
            [],
            null
        );
        wp_script_add_data('seo-plugin-admin', 'type', 'module');
    }
    
    /**
     * Enqueue production assets (built files)
     * This now works with standard Vite output
     */
    private function enqueue_production_assets() {
        $dist_path = SEO_PLUGIN_PATH . 'dist/';
        $dist_url = SEO_PLUGIN_URL . 'dist/';
        
        // Look for our built files
        $admin_js = $this->find_built_file($dist_path, 'admin.js');
        $admin_css = $this->find_built_file($dist_path, 'admin', '.css');
        
        if (!$admin_js) {
            // Show error to admins if assets not found
            if (current_user_can('manage_options')) {
                add_action('admin_notices', function() {
                    echo '<div class="notice notice-error"><p>' . 
                         esc_html__('SEO Plugin: Assets not found. Please run npm run build.', 'seo-plugin') . 
                         '</p></div>';
                });
            }
            return;
        }
        
        // Enqueue JavaScript
        wp_enqueue_script(
            'seo-plugin-admin',
            $dist_url . $admin_js,
            [],
            SEO_PLUGIN_VERSION,
            true
        );
        
        // Enqueue CSS if available
        if ($admin_css) {
            wp_enqueue_style(
                'seo-plugin-admin-css',
                $dist_url . $admin_css,
                [],
                SEO_PLUGIN_VERSION
            );
        }
    }
    
    /**
     * Find built files in dist directory
     * Handles both exact matches and hashed filenames
     */
    private function find_built_file($dist_path, $name, $extension = '.js') {
        if (!is_dir($dist_path)) {
            return false;
        }
        
        $files = scandir($dist_path);
        
        // First try exact match
        if (in_array($name . $extension, $files)) {
            return $name . $extension;
        }
        
        // Then try pattern match for hashed files
        foreach ($files as $file) {
            if (strpos($file, $name) === 0 && substr($file, -strlen($extension)) === $extension) {
                return $file;
            }
        }
        
        return false;
    }
    
    /**
     * Pass data to React components
     */
    private function localize_script_data() {
        $tab_manager = SEO_Plugin_Tab_Manager::get_instance();
        
        $data = [
            'apiUrl' => rest_url('seo-plugin/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'currentPost' => get_the_ID(),
            'adminUrl' => admin_url(),
            'pluginUrl' => SEO_PLUGIN_URL,
            'isDevMode' => $this->is_development_mode(),
            'tabs' => $tab_manager->get_tabs_for_frontend(),
            'strings' => [
                'save' => __('Save Changes', 'seo-plugin'),
                'saving' => __('Saving...', 'seo-plugin'),
                'saved' => __('Settings saved!', 'seo-plugin'),
                'error' => __('Error saving settings', 'seo-plugin'),
                'loading' => __('Loading...', 'seo-plugin'),
                'selectTab' => __('Select a tab to get started', 'seo-plugin')
            ]
        ];
        
        wp_localize_script('seo-plugin-admin', 'seoPluginData', $data);
    }
    
    /**
     * Add meta boxes to post edit screens
     */
    public function add_meta_boxes() {
        $post_types = get_post_types(['public' => true]);
        
        foreach ($post_types as $post_type) {
            add_meta_box(
                'seo-plugin-meta',
                __('SEO Settings', 'seo-plugin'),
                [$this, 'meta_box_callback'],
                $post_type,
                'normal',
                'high'
            );
        }
    }
    
    /**
     * Meta box callback for individual posts
     */
    public function meta_box_callback($post) {
        wp_nonce_field('seo_plugin_meta_box', 'seo_plugin_meta_nonce');
        echo '<div id="seo-plugin-meta-box"></div>';
    }
}