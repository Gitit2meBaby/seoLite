<?php
/**
 * Plugin Name: Debug Paths
 * Description: Debug plugin to show WordPress paths
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add admin menu to show paths
add_action('admin_menu', function() {
    add_menu_page(
        'Debug Paths',
        'Debug Paths', 
        'manage_options',
        'debug-paths',
        function() {
            echo '<div class="wrap">';
            echo '<h1>WordPress Path Debug</h1>';
            echo '<h2>Key Paths:</h2>';
            echo '<p><strong>ABSPATH:</strong> ' . ABSPATH . '</p>';
            echo '<p><strong>WP_CONTENT_DIR:</strong> ' . WP_CONTENT_DIR . '</p>';
            echo '<p><strong>WP_PLUGIN_DIR:</strong> ' . WP_PLUGIN_DIR . '</p>';
            echo '<p><strong>Plugins URL:</strong> ' . plugins_url() . '</p>';
            
            echo '<h2>Current Plugins:</h2>';
            $plugins = get_plugins();
            echo '<ul>';
            foreach ($plugins as $plugin_file => $plugin_data) {
                echo '<li><strong>' . $plugin_data['Name'] . '</strong> - ' . $plugin_file . '</li>';
            }
            echo '</ul>';
            
            echo '<h2>Plugin Directory Contents:</h2>';
            $plugin_dir = WP_PLUGIN_DIR;
            if (is_dir($plugin_dir)) {
                $contents = scandir($plugin_dir);
                echo '<ul>';
                foreach ($contents as $item) {
                    if ($item !== '.' && $item !== '..') {
                        $path = $plugin_dir . '/' . $item;
                        $type = is_dir($path) ? '[DIR]' : '[FILE]';
                        echo '<li>' . $type . ' ' . $item . '</li>';
                    }
                }
                echo '</ul>';
            } else {
                echo '<p>Plugin directory not found!</p>';
            }
            echo '</div>';
        },
        'dashicons-admin-tools'
    );
});
?>