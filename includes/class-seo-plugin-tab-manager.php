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
            'label' => __('Essential Meta Tags', 'seo-plugin'),
            'description' => __('These settings control the core information Google and other search engines see for your pages. A well-crafted title and description can significantly increase the click-through rate from search results.', 'seo-plugin'),
            'icon' => 'dashicons-admin-generic',
            'component' => 'GeneralMeta'
        ]);
        
        $this->register_tab('social', [
            'label' => __('Social Media', 'seo-plugin'),
            'description' => __('Control how your content appears when shared on social media platforms like Facebook and Twitter. Using Open Graph and Twitter Cards ensures your links have attractive images, titles, and descriptions, leading to more engagement.', 'seo-plugin'),
            'icon' => 'dashicons-share',
            'component' => 'SocialMedia'
        ]);
        
        $this->register_tab('schema', [
            'label' => __('Schema Markup', 'seo-plugin'),
            'description' => __('Add structured data to help search engines understand the context of your content. Schema can power rich results like star ratings, product information, and event details directly in Google search, making your content stand out.', 'seo-plugin'),
            'icon' => 'dashicons-code-standards',
            'component' => 'SchemaMarkup'
        ]);
        
        $this->register_tab('analytics', [
            'label' => __('Analytics', 'seo-plugin'),
            'description' => __('Connect your site to tools that measure visitor behavior. Google Analytics tracks who comes to your site and what they do, while Google Tag Manager helps you manage tracking scripts without needing to edit code.', 'seo-plugin'),
            'icon' => 'dashicons-chart-line',
            'component' => 'Analytics'
        ]);
        
        $this->register_tab('technical', [
            'label' => __('Technical SEO', 'seo-plugin'),
            'description' => __('Manage the technical aspects that affect how search engines crawl and index your site. These settings help prevent duplicate content issues, define your site structure, and provide important signals to Google for better indexing.', 'seo-plugin'),
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