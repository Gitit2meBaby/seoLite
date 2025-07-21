<?php
/**
 * Admin Pages for SEO Plugin
 * 
 * This class handles:
 * - Creating admin menu pages
 * - Enqueuing React assets
 * - Providing data to React components
 * - Managing asset loading (development vs production)
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
        
        // Add submenu pages if needed
        add_submenu_page(
            'seo-plugin',
            __('Global Settings', 'seo-plugin'),
            __('Global Settings', 'seo-plugin'),
            'manage_options',
            'seo-plugin',
            [$this, 'admin_page_callback']
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
     * 
     * This handles both development and production asset loading:
     * - Development: Load from Vite dev server with hot reload
     * - Production: Load built and optimized assets
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
     */
    private function enqueue_production_assets() {
        $manifest = $this->get_vite_manifest();
        
        if (empty($manifest)) {
            // Fallback error message for admins
            if (current_user_can('manage_options')) {
                add_action('admin_notices', function() {
                    echo '<div class="notice notice-error"><p>' . 
                         esc_html__('SEO Plugin: Assets not found. Please run npm run build.', 'seo-plugin') . 
                         '</p></div>';
                });
            }
            return;
        }
        
        // Get main entry point from manifest
        $admin_entry = $manifest['assets/js/admin.jsx'] ?? null;
        
        if ($admin_entry) {
            // Enqueue JavaScript
            wp_enqueue_script(
                'seo-plugin-admin',
                SEO_PLUGIN_URL . 'dist/' . $admin_entry['file'],
                [],
                SEO_PLUGIN_VERSION,
                true
            );
            
            // Enqueue CSS if available
            if (!empty($admin_entry['css'])) {
                foreach ($admin_entry['css'] as $css_file) {
                    wp_enqueue_style(
                        'seo-plugin-admin-css',
                        SEO_PLUGIN_URL . 'dist/' . $css_file,
                        [],
                        SEO_PLUGIN_VERSION
                    );
                }
            }
        }
    }
    
    /**
     * Get Vite manifest for production builds
     */
    private function get_vite_manifest() {
        static $manifest = null;
        
        if (null === $manifest) {
            $manifest_path = SEO_PLUGIN_PATH . 'dist/manifest.json';
            
            if (file_exists($manifest_path)) {
                $manifest_content = file_get_contents($manifest_path);
                $manifest = json_decode($manifest_content, true) ?: [];
            } else {
                $manifest = [];
            }
        }
        
        return $manifest;
    }
    
    private function localize_script_data() {
        $tab_manager = SEO_Plugin_Tab_Manager::get_instance();
        
        $data = [
            'apiUrl' => rest_url('seo-plugin/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'currentPost' => get_the_ID(),
            'adminUrl' => admin_url(),
            'pluginUrl' => SEO_PLUGIN_URL,
            'isDevMode' => $this->is_development_mode(),
            'tabs' => $tab_manager->get_tabs_for_frontend(), // Add tab data
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
        // Add nonce for security
        wp_nonce_field('seo_plugin_meta_box', 'seo_plugin_meta_nonce');
        
        echo '<div id="seo-plugin-meta-box"></div>'; // React component will mount here
        
        // Enqueue assets for meta box (lighter version)
        $this->enqueue_meta_box_assets();
    }
    
    /**
     * Enqueue assets specifically for meta boxes
     */
    private function enqueue_meta_box_assets() {
        // This would be a lighter React component for the post edit screen
        // We'll implement this in the next phase
    }
}