<!-- class-seo-import-controller.php  -->

<!-- GET /wp-json/seo-plugin/v1/import

Response shape:
{
  "success": true,
  "plugins": ["yoast", "rankmath"],
  "globals": { ... },
  "pages": {
    "123": {
      "post_type": "page",
      "meta": { ... }
    }
  }
} -->

<?php
    private function detect_seo_plugins() {
    $active = get_option('active_plugins', []);
    $detected = [];

    foreach ($active as $plugin) {
        if (strpos($plugin, 'wordpress-seo') !== false) {
            $detected[] = 'yoast';
        }
        if (strpos($plugin, 'seo-by-rank-math') !== false) {
            $detected[] = 'rankmath';
        }
        if (strpos($plugin, 'all-in-one-seo-pack') !== false) {
            $detected[] = 'aioseo';
        }
        if (strpos($plugin, 'wp-seopress') !== false) {
            $detected[] = 'seopress';
        }
        if (strpos($plugin, 'autodescription') !== false) {
            $detected[] = 'seoFramework';
        }
    }

    return array_unique($detected);
}


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

    if (in_array('aioseo', $plugins)) {
        $globals['aioseo'] = [
            'options'   => get_option('aioseo_options'),
            'webmaster' => get_option('aioseo_webmaster'),
        ];
    }

    if (in_array('seopress', $plugins)) {
        $globals['seopress'] = [
            'titles' => get_option('seopress_titles_option_name'),
            'social' => get_option('seopress_social_option_name'),
        ];
    }

    if (in_array('seoFramework', $plugins)) {
        $globals['seoFramework'] = [
            'settings' => get_option('autodescription-site-settings'),
        ];
    }

    return $globals;
}

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

add_action('rest_api_init', function () {
    register_rest_route('seo-plugin/v1', '/import', [
        'methods' => 'GET',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
        'callback' => function () {

            $plugins = $this->detect_seo_plugins();

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
                'globals' => $this->extract_global_options($plugins),
                'pages'   => $pages,
            ];
        },
    ]);
});

class SEO_Import_Controller {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route('seo-plugin/v1', '/import', [
            'methods' => 'GET',
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
            'callback' => [$this, 'handle_import'],
        ]);
    }

    public function handle_import() {
        $plugins = $this->detect_seo_plugins();

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
            'globals' => $this->extract_global_options($plugins),
            'pages'   => $pages,
        ];
    }
}
