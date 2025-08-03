<!-- includes/class-seo-plugin-tab-manager.php  -->
<?php
/**
 * Tab Manager for SEO Plugin
 * 
 * This class handles:
 * - Registering all available tabs
 * - Managing tab permissions
 * - Providing tab data to React components
 * - Future-proofing for adding new tabs
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
        
        // Allow other plugins/themes to register tabs
        add_action('init', [$this, 'allow_external_tab_registration'], 20);
    }
    
    /**
     * Register default plugin tabs
     */
    private function register_default_tabs() {
        
        $this->register_tab('general', [
            'label' => __('General Meta', 'seo-plugin'),
            'description' => __('Basic meta tags, titles, descriptions', 'seo-plugin'),
            'icon' => 'dashicons-admin-generic',
            'capability' => 'manage_options',
            'priority' => 10,
            'component' => 'GeneralMeta',
            'php_handler' => 'SEO_Plugin_Tab_General',
            'fields' => [
                'meta_title',
                'meta_description', 
                'meta_keywords',
                'robots_index',
                'robots_follow'
            ]
        ]);
        
        $this->register_tab('social', [
            'label' => __('Social Media', 'seo-plugin'),
            'description' => __('Twitter Cards and Open Graph tags', 'seo-plugin'),
            'icon' => 'dashicons-share',
            'capability' => 'manage_options',
            'priority' => 20,
            'component' => 'SocialMedia',
            'php_handler' => 'SEO_Plugin_Tab_Social',
            'fields' => [
                'og_title',
                'og_description',
                'og_image',
                'twitter_card_type',
                'twitter_username'
            ]
        ]);
        
        $this->register_tab('schema', [
            'label' => __('Schema Markup', 'seo-plugin'),
            'description' => __('Structured data for search engines', 'seo-plugin'),
            'icon' => 'dashicons-code-standards',
            'capability' => 'manage_options',
            'priority' => 30,
            'component' => 'SchemaMarkup',
            'php_handler' => 'SEO_Plugin_Tab_Schema',
            'fields' => [
                'schema_type',
                'schema_data',
                'enable_schema'
            ]
        ]);
        
        $this->register_tab('analytics', [
            'label' => __('Analytics', 'seo-plugin'),
            'description' => __('Google Analytics and Tag Manager', 'seo-plugin'),
            'icon' => 'dashicons-chart-line',
            'capability' => 'manage_options',
            'priority' => 40,
            'component' => 'Analytics',
            'php_handler' => 'SEO_Plugin_Tab_Analytics',
            'fields' => [
                'ga_measurement_id',
                'gtm_container_id',
                'enable_analytics'
            ]
        ]);
        
        $this->register_tab('technical', [
            'label' => __('Technical SEO', 'seo-plugin'),
            'description' => __('Canonicals, ownership, modification dates', 'seo-plugin'),
            'icon' => 'dashicons-admin-tools',
            'capability' => 'manage_options',
            'priority' => 50,
            'component' => 'TechnicalSEO',
            'php_handler' => 'SEO_Plugin_Tab_Technical',
            'fields' => [
                'canonical_url',
                'author_name',
                'date_modified',
                'hreflang'
            ]
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
            'capability' => 'manage_options',
            'priority' => 50,
            'component' => '',
            'php_handler' => '',
            'fields' => [],
            'enabled' => true
        ];
        
        $this->tabs[$id] = wp_parse_args($args, $defaults);
    }
    
    /**
     * Get all registered tabs
     * 
     * @param bool $check_permissions Whether to filter by user capabilities
     * @return array Sorted array of tabs
     */
    public function get_tabs($check_permissions = true) {
        $tabs = $this->tabs;
        
        if ($check_permissions) {
            $tabs = array_filter($tabs, function($tab) {
                return current_user_can($tab['capability']) && $tab['enabled'];
            });
        }
        
        // Sort by priority
        uasort($tabs, function($a, $b) {
            return $a['priority'] - $b['priority'];
        });
        
        return $tabs;
    }
    
    /**
     * Get specific tab configuration
     * 
     * @param string $tab_id
     * @return array|null Tab configuration or null if not found
     */
    public function get_tab($tab_id) {
        return isset($this->tabs[$tab_id]) ? $this->tabs[$tab_id] : null;
    }
    
    /**
     * Check if tab exists and user can access it
     * 
     * @param string $tab_id
     * @return bool
     */
    public function can_access_tab($tab_id) {
        $tab = $this->get_tab($tab_id);
        return $tab && current_user_can($tab['capability']) && $tab['enabled'];
    }
    
    /**
     * Get tab data for React components
     * 
     * @return array Prepared data for frontend
     */
    public function get_tabs_for_frontend() {
        $tabs = $this->get_tabs(true);
        $frontend_tabs = [];
        
        foreach ($tabs as $id => $tab) {
            $frontend_tabs[$id] = [
                'id' => $id,
                'label' => $tab['label'],
                'description' => $tab['description'],
                'icon' => $tab['icon'],
                'component' => $tab['component'],
                'fields' => $tab['fields']
            ];
        }
        
        return $frontend_tabs;
    }
    
    /**
     * Allow external tab registration after init
     */
    public function allow_external_tab_registration() {
        /**
         * Allow other plugins to register SEO tabs
         * 
         * @param SEO_Plugin_Tab_Manager $tab_manager
         */
        do_action('seo_plugin_register_tabs', $this);
    }
    
    /**
     * Remove a tab (useful for customization)
     * 
     * @param string $tab_id
     */
    public function remove_tab($tab_id) {
        unset($this->tabs[$tab_id]);
    }
    
    /**
     * Disable a tab without removing it
     * 
     * @param string $tab_id
     */
    public function disable_tab($tab_id) {
        if (isset($this->tabs[$tab_id])) {
            $this->tabs[$tab_id]['enabled'] = false;
        }
    }
}