<?php
/**
 * Tab Manager for SEO Plugin
 * 
 * This class handles:
 * - Registering all available tabs
 * - Providing tab data to React components
 */

class SEO_Plugin_Tab_Manager {
    
    private static $instance = null;
    private $tabs = [];
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->register_default_tabs();
    }
    
    /**
     * Register default plugin tabs
     * Each tab has:
     * - label: What shows in the navigation
     * - description: Tooltip text
     * - icon: WordPress dashicon class
     * - component: React component name to load
     */
    private function register_default_tabs() {
        
        $this->register_tab('general', [
            'label' => __('General Meta', 'seo-plugin'),
            'description' => __('Basic meta tags, titles, descriptions', 'seo-plugin'),
            'icon' => 'dashicons-admin-generic',
            'component' => 'GeneralMeta'
        ]);
        
        $this->register_tab('social', [
            'label' => __('Social Media', 'seo-plugin'),
            'description' => __('Twitter Cards and Open Graph tags', 'seo-plugin'),
            'icon' => 'dashicons-share',
            'component' => 'SocialMedia'
        ]);
        
        $this->register_tab('schema', [
            'label' => __('Schema Markup', 'seo-plugin'),
            'description' => __('Structured data for search engines', 'seo-plugin'),
            'icon' => 'dashicons-code-standards',
            'component' => 'SchemaMarkup'
        ]);
        
        $this->register_tab('analytics', [
            'label' => __('Analytics', 'seo-plugin'),
            'description' => __('Google Analytics and Tag Manager', 'seo-plugin'),
            'icon' => 'dashicons-chart-line',
            'component' => 'Analytics'
        ]);
        
        $this->register_tab('technical', [
            'label' => __('Technical SEO', 'seo-plugin'),
            'description' => __('Canonicals, robots, technical settings', 'seo-plugin'),
            'icon' => 'dashicons-admin-tools',
            'component' => 'TechnicalSEO'
        ]);
    }
    
    /**
     * Register a new tab
     * 
     * @param string $id Unique tab identifier
     * @param array $args Tab configuration
     */
    public function register_tab($id, $args) {
        $defaults = [
            'label' => '',
            'description' => '',
            'icon' => 'dashicons-admin-generic',
            'component' => '',
            'enabled' => true
        ];
        
        $this->tabs[$id] = wp_parse_args($args, $defaults);
    }
    
    /**
     * Get all tabs for the frontend
     * This formats the data that React will receive
     */
    public function get_tabs_for_frontend() {
        $frontend_tabs = [];
        
        foreach ($this->tabs as $id => $tab) {
            if ($tab['enabled']) {
                $frontend_tabs[$id] = [
                    'id' => $id,
                    'label' => $tab['label'],
                    'description' => $tab['description'],
                    'icon' => $tab['icon'],
                    'component' => $tab['component']
                ];
            }
        }
        
        return $frontend_tabs;
    }
}