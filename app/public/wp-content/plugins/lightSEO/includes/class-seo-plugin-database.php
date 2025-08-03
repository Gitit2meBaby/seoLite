<!-- includes/class-seo-plugin-database.php -->
<?php
/**
 * Database operations for SEO Plugin
 * 
 * This class handles all database-related operations including:
 * - Creating custom tables for settings storage
 * - Managing schema updates
 * - Handling data migrations
 */

class SEO_Plugin_Database {
    
    /**
     * Create plugin tables on activation
     * 
     * Why we need a custom table:
     * - WordPress wp_options table gets slow with many entries
     * - We need to store settings per post/page efficiently
     * - Better performance for bulk operations
     */
    public static function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'seo_plugin_settings';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            option_name varchar(191) NOT NULL,
            option_value longtext,
            scope varchar(50) NOT NULL DEFAULT 'global',
            post_id bigint(20) DEFAULT NULL,
            post_type varchar(50) DEFAULT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY option_name (option_name),
            KEY scope_post (scope, post_id),
            KEY post_type (post_type)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        
        // Store table version for future migrations
        update_option('seo_plugin_db_version', '1.0.0');
    }
    
    /**
     * Drop tables on uninstall (called from uninstall.php)
     */
    public static function drop_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'seo_plugin_settings';
        $wpdb->query("DROP TABLE IF EXISTS $table_name");
        
        delete_option('seo_plugin_db_version');
    }
}