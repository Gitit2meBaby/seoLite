<?php
class SEO_Plugin_API_Handler {
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('rest_api_init', [$this, 'register_endpoints']);
    }
    
    public function register_endpoints() {
        register_rest_route('seo-plugin/v1', '/settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_settings'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ]);
        
        register_rest_route('seo-plugin/v1', '/settings', [
            'methods' => 'POST',
            'callback' => [$this, 'save_settings'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ]);
    }
    
    public function get_settings() {
        return [
            'success' => true,
            'data' => [
                'site_title' => get_bloginfo('name'),
                'site_description' => get_bloginfo('description')
            ]
        ];
    }
    
    public function save_settings($request) {
        return [
            'success' => true,
            'message' => 'Settings saved!'
        ];
    }
}