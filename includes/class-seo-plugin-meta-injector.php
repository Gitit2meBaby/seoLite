<?php
/**
 * Meta Injector for SEO Plugin
 * This adds meta tags to the frontend of your website
 */

class SEO_Plugin_Meta_Injector {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Hook into wp_head to add our meta tags
        add_action('wp_head', [$this, 'inject_meta_tags'], 1);
    }
    
    /**
     * Inject meta tags into the page head
     */
    public function inject_meta_tags() {
        // Add a comment so we know our plugin is working
        echo "<!-- SEO Plugin Active -->\n";
        
        // Get current page title
        $title = get_the_title();
        if ($title && !is_home()) {
            echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
        }
        
        // Add site name
        $site_name = get_bloginfo('name');
        if ($site_name) {
            echo '<meta property="og:site_name" content="' . esc_attr($site_name) . '">' . "\n";
        }
        
        // Add description if available
        $description = get_bloginfo('description');
        if ($description && is_home()) {
            echo '<meta name="description" content="' . esc_attr($description) . '">' . "\n";
            echo '<meta property="og:description" content="' . esc_attr($description) . '">' . "\n";
        }
    }
}