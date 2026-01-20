<?php
class SEO_Plugin_Meta_Injector {
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('wp_head', [$this, 'inject_meta_tags'], 1);
    }
    
    public function inject_meta_tags() {
        echo "<!-- SEO Plugin Active -->\n";
        $title = get_the_title();
        if ($title) {
            echo "<meta property=\"og:title\" content=\"" . esc_attr($title) . "\">\n";
        }
    }
}