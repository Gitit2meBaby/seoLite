<?php
/**
 * Homepage Admin Page for SEO Plugin
 * 
 * This class creates a separate homepage/welcome screen that appears
 * as a submenu item under the main SEOLite menu in WordPress admin.
 * 
 * HOW IT WORKS:
 * 1. WordPress calls add_admin_menu() when building the admin menu
 * 2. We use add_submenu_page() to add "Home" under the SEOLite menu
 * 3. When clicked, WordPress calls homepage_callback() to render the page
 * 4. The callback outputs a <div id="seo-plugin-homepage"> container
 * 5. React takes over this container to render the homepage component
 */

class SEO_Plugin_Homepage {
    
    /**
     * Singleton instance
     * This ensures only one instance of this class exists
     */
    private static $instance = null;
    
    /**
     * Get singleton instance
     * If instance doesn't exist, create it. Otherwise return existing one.
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor - private to enforce singleton pattern
     * 
     * HOOKS EXPLAINED:
     * - admin_menu: Fires when WordPress builds the admin menu
     * - admin_enqueue_scripts: Fires when WordPress loads admin page assets
     */
    private function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_homepage_assets']);
    }
    
    /**
     * Add homepage to admin menu
     * 
     * WORDPRESS MENU SYSTEM:
     * WordPress has parent menus (add_menu_page) and child submenus (add_submenu_page)
     * Our main menu is 'seo-plugin', and we're adding a submenu under it.
     * 
     * PARAMETERS EXPLAINED:
     * 1. parent_slug: 'seo-plugin' - must match the slug of the parent menu
     * 2. page_title: Shows in browser tab/title bar
     * 3. menu_title: Shows in the WordPress sidebar menu
     * 4. capability: 'manage_options' means only admins can see this
     * 5. menu_slug: Unique identifier for this page (used in URL)
     * 6. callback: Function to call when rendering this page
     */
    public function add_admin_menu() {
        add_submenu_page(
            'seo-plugin',                           // Parent menu slug
            __('SEOLite Home', 'seolite'),         // Page title
            __('Home', 'seolite'),                 // Menu title (what users see)
            'manage_options',                       // Capability required
            'seo-plugin-home',                     // This page's unique slug
            [$this, 'homepage_callback'],          // Function to render the page
            0                                       // Position (0 = first)
        );
    }
    
    /**
     * Render the homepage
     * 
     * This function outputs HTML that WordPress will display.
     * The <div id="seo-plugin-homepage"> is important - React will
     * find this element and mount the homepage component inside it.
     * 
     * WORDPRESS FUNCTIONS USED:
     * - esc_html__(): Translates and escapes text for safe HTML output
     * - get_bloginfo(): Gets WordPress site settings
     */
    public function homepage_callback() {
        // Wrap everything in .wrap for WordPress admin styling
        echo '<div class="wrap">';
        
        // Simple heading while React loads
        echo '<h1>' . esc_html__('SEOLite', 'seolite') . '</h1>';
        
        // THIS IS THE IMPORTANT PART:
        // React will find this div by ID and render the homepage inside it
        echo '<div id="seo-plugin-homepage">';
        
        // Show a loading message while React initializes
        echo '<div style="padding: 2rem; text-align: center;">';
        echo '<div class="spinner is-active" style="float: none; margin: 0 auto;"></div>';
        echo '<p style="margin-top: 1rem;">' . esc_html__('Loading...', 'seolite') . '</p>';
        echo '</div>';
        
        echo '</div>'; // #seo-plugin-homepage
        echo '</div>'; // .wrap
    }
    
    /**
     * Load JavaScript and CSS for this page
     * 
     * WORDPRESS ASSET LOADING:
     * WordPress uses wp_enqueue_script() and wp_enqueue_style() to load assets.
     * This prevents duplicate loading and manages dependencies.
     * 
     * $hook PARAMETER:
     * WordPress passes a string identifying which admin page is loading.
     * We check this to only load our assets on our homepage, not everywhere.
     * 
     * Example $hook values:
     * - 'seolite_page_seo-plugin-home' = our homepage
     * - 'toplevel_page_seo-plugin' = main dashboard
     * - 'post.php' = post editor (we don't need our assets there)
     */
    public function enqueue_homepage_assets($hook) {
        // IMPORTANT: Only load on our homepage
        // The $hook for submenus follows the pattern: {parent}_page_{child-slug}
        if ($hook !== 'seolite_page_seo-plugin-home') {
            return; // Exit early if not our page
        }
        
        // Define paths to built assets
        $dist_path = SEO_PLUGIN_PATH . 'dist/';
        $dist_url = SEO_PLUGIN_URL . 'dist/';
        
        // Find the compiled JavaScript and CSS files
        // These will be named like 'homepage.abc123.js' after build
        $homepage_js = $this->find_asset_file($dist_path, 'homepage', '.js');
        $homepage_css = $this->find_asset_file($dist_path, 'homepage', '.css');
        
        /**
         * ENQUEUE JAVASCRIPT
         * 
         * wp_enqueue_script() parameters:
         * 1. handle: Unique identifier for this script
         * 2. src: URL to the script file
         * 3. deps: Array of dependencies (wp-element = React from WordPress)
         * 4. ver: Version number for cache busting
         * 5. in_footer: true = load at end of page (better performance)
         */
        if ($homepage_js) {
            wp_enqueue_script(
                'seo-plugin-homepage',                              // handle
                $dist_url . $homepage_js,                          // src
                array('wp-element'),                               // deps - WordPress's React
                SEO_PLUGIN_VERSION . '-' . filemtime($dist_path . $homepage_js),  // version + file timestamp
                true                                               // load in footer
            );
        }
        
        /**
         * ENQUEUE CSS
         * 
         * Similar to wp_enqueue_script but for stylesheets
         */
        if ($homepage_css) {
            wp_enqueue_style(
                'seo-plugin-homepage',
                $dist_url . $homepage_css,
                array(),                                           // no CSS dependencies
                SEO_PLUGIN_VERSION . '-' . filemtime($dist_path . $homepage_css)
            );
        }

        /**
         * PASS DATA TO JAVASCRIPT
         * 
         * wp_localize_script() creates a JavaScript object that React can access.
         * This is how we pass PHP data (like URLs, settings) to our React app.
         * 
         * The object will be available as: window.seoPluginHomepageData
         */
        wp_localize_script('seo-plugin-homepage', 'seoPluginHomepageData', array(
            'dashboardUrl' => admin_url('admin.php?page=seo-plugin'),  // URL to main dashboard
            'apiUrl' => rest_url('seo-plugin/v1/'),                    // REST API base URL
            'nonce' => wp_create_nonce('wp_rest'),                     // Security token
            'siteName' => get_bloginfo('name'),                        // Site name
            'siteUrl' => home_url(),                                   // Site URL
            'strings' => array(
                'welcome' => __('Welcome to SEOLite', 'seolite'),
                'getStarted' => __('Get Started', 'seolite'),
                'importMeta' => __('Import Meta Data', 'seolite'),
            )
        ));
    }
    
    /**
     * Find asset files with hashed names
     * 
     * Build tools like Vite add hashes to filenames for cache busting:
     * homepage.js becomes homepage.abc123.js
     * 
     * This function searches the dist folder for files matching our pattern.
     * 
     * PARAMETERS:
     * - $dist_path: Directory to search (e.g., /path/to/plugin/dist/)
     * - $name: Filename to look for (e.g., 'homepage')
     * - $extension: File extension (e.g., '.js' or '.css')
     * 
     * RETURNS:
     * - Filename if found (e.g., 'homepage.abc123.js')
     * - null if not found
     */
    private function find_asset_file($dist_path, $name, $extension) {
        // Check if dist directory exists
        if (!is_dir($dist_path)) {
            return null;
        }
        
        // Get all files in the directory
        $files = scandir($dist_path);
        
        // Loop through files to find a match
        foreach ($files as $file) {
            // Check if filename contains our search term and extension
            if (strpos($file, $name) !== false && strpos($file, $extension) !== false) {
                return $file; // Found it!
            }
        }
        
        return null; // Not found
    }
}