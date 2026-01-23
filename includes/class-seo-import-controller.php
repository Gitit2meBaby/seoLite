<?php
if (!defined('ABSPATH')) exit;

class SEO_Import_Controller {

    public function __construct() {
        // Register REST API routes
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register the /import endpoint
     */
    public function register_routes() {
        register_rest_route('seo-plugin/v1', '/import', [
            'methods' => 'GET',
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
            'callback' => [$this, 'handle_import'],
        ]);
    }

    /**
     * Callback that returns plugin/page meta
     */
    public function handle_import() {
        $plugins = $this->detect_seo_plugins();
        $globals = $this->extract_global_options($plugins);

        $posts = get_posts([
            'post_type'   => 'any',
            'post_status' => 'any',
            'numberposts' => -1,
        ]);

        $pages = [];
        foreach ($posts as $post) {
            $pages[$post->ID] = [
                'post_type' => $post->post_type,
                'meta'      => $this->extract_post_meta($post->ID),
            ];
        }

        return [
            'success' => true,
            'plugins' => $plugins,
            'globals' => $globals,
            'pages'   => $pages,
        ];
    }

    /**
     * Detect active SEO plugins
     */
    private function detect_seo_plugins() {
        $active = get_option('active_plugins', []);
        $detected = [];

        foreach ($active as $plugin) {
            if (strpos($plugin, 'wordpress-seo') !== false) $detected[] = 'yoast';
            if (strpos($plugin, 'seo-by-rank-math') !== false) $detected[] = 'rankmath';
            if (strpos($plugin, 'all-in-one-seo-pack') !== false) $detected[] = 'aioseo';
            if (strpos($plugin, 'wp-seopress') !== false) $detected[] = 'seopress';
            if (strpos($plugin, 'autodescription') !== false) $detected[] = 'seoFramework';
        }

        return array_unique($detected);
    }

    /**
     * Extract global plugin options
     */
    private function extract_global_options($plugins) {
        $globals = [];

        if (in_array('yoast', $plugins)) {
            $globals['yoast'] = [
                'wpseo_titles'     => get_option('wpseo_titles'),
                'wpseo_social'     => get_option('wpseo_social'),
                'wpseo_webmaster'  => get_option('wpseo_webmaster'),
            ];
        }

        if (in_array('rankmath', $plugins)) {
            $globals['rankmath'] = [
                'general' => get_option('rank-math-options-general'),
                'titles'  => get_option('rank-math-options-titles'),
            ];
        }

        // Repeat for aioseo, seopress, seoFramework if needed

        return $globals;
    }

    /**
     * Extract post meta
     */
    private function extract_post_meta($post_id) {
        global $wpdb;

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d",
                $post_id
            ),
            ARRAY_A
        );

        $meta = [];
        foreach ($rows as $row) {
            $meta[$row['meta_key']] = maybe_unserialize($row['meta_value']);
        }

        return $meta;
    }
}

// Instantiate the class immediately
new SEO_Import_Controller();
