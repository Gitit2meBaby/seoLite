<?php
/**
 * Simple SEO Plugin Integration
 * Adds lightweight SEO links to WordPress admin without complex UI
 */

class SEO_Plugin_Simple_Integration {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Add "SEO" link to page/post row actions
        add_filter('post_row_actions', [$this, 'add_seo_row_action'], 10, 2);
        add_filter('page_row_actions', [$this, 'add_seo_row_action'], 10, 2);
        
        // Add SEO column to posts/pages list (optional)
        add_filter('manage_posts_columns', [$this, 'add_seo_column']);
        add_filter('manage_pages_columns', [$this, 'add_seo_column']);
        add_action('manage_posts_custom_column', [$this, 'render_seo_column'], 10, 2);
        add_action('manage_pages_custom_column', [$this, 'render_seo_column'], 10, 2);
    }
    
    /**
     * Add SEO link to post/page row actions
     * This adds "SEO" next to Edit | Quick Edit | Trash | Preview
     */
    public function add_seo_row_action($actions, $post) {
        // Only add for post types we support
        if (!in_array($post->post_type, ['post', 'page'])) {
            return $actions;
        }
        
        // Only show for users who can manage options
        if (!current_user_can('manage_options')) {
            return $actions;
        }
        
        // Get quick SEO status
        $seo_status = $this->get_quick_seo_status($post->ID);
        
        // Build the link to your main plugin
        $seo_url = admin_url('admin.php?page=seo-plugin&tab=general&page_id=' . $post->ID);
        
        // Add SEO action with status indicator
        $actions['seo'] = sprintf(
            '<a href="%s" title="Configure SEO settings for this %s">SEO %s</a>',
            esc_url($seo_url),
            $post->post_type,
            $seo_status['indicator']
        );
        
        return $actions;
    }
    
    /**
     * Add SEO status column to posts/pages list
     */
    public function add_seo_column($columns) {
        // Add SEO column after the title
        $new_columns = [];
        foreach ($columns as $key => $value) {
            $new_columns[$key] = $value;
            if ($key === 'title') {
                $new_columns['seo_status'] = 'SEO';
            }
        }
        return $new_columns;
    }
    
    /**
     * Render SEO status column content
     */
    public function render_seo_column($column, $post_id) {
        if ($column !== 'seo_status') {
            return;
        }
        
        $seo_status = $this->get_quick_seo_status($post_id);
        $seo_url = admin_url('admin.php?page=seo-plugin&tab=general&page_id=' . $post_id);
        
        printf(
            '<a href="%s" title="%s" style="text-decoration: none;">%s <span style="font-size: 11px; color: %s;">%d/3</span></a>',
            esc_url($seo_url),
            esc_attr($seo_status['tooltip']),
            $seo_status['indicator'],
            $seo_status['color'],
            $seo_status['score']
        );
    }
    
    /**
     * Get quick SEO status for a post
     * Returns indicator emoji, score, and tooltip
     */
    private function get_quick_seo_status($post_id) {
        // Get SEO settings for this page
        $page_settings = get_option("seo_plugin_page_{$post_id}", []);
        $global_settings = get_option('seo_plugin_page_global', []);
        $merged_settings = array_merge($global_settings, $page_settings);
        
        // Check key SEO elements
        $has_title = !empty($merged_settings['meta_title']);
        $has_description = !empty($merged_settings['meta_description']);
        $has_schema = !empty($merged_settings['schemaType']);
        
        // Calculate score
        $checks = [$has_title, $has_description, $has_schema];
        $score = count(array_filter($checks));
        
        // Determine indicator and color
        if ($score === 3) {
            $indicator = '🟢'; // Green circle
            $color = '#46b450';
            $status = 'Complete';
        } elseif ($score === 2) {
            $indicator = '🟡'; // Yellow circle
            $color = '#ffb900';
            $status = 'Good';
        } elseif ($score === 1) {
            $indicator = '🟠'; // Orange circle
            $color = '#ff8c00';
            $status = 'Basic';
        } else {
            $indicator = '🔴'; // Red circle
            $color = '#dc3232';
            $status = 'None';
        }
        
        // Build tooltip
        $tooltip_parts = [];
        $tooltip_parts[] = $has_title ? '✅ Meta Title' : '❌ Meta Title';
        $tooltip_parts[] = $has_description ? '✅ Description' : '❌ Description';
        $tooltip_parts[] = $has_schema ? '✅ Schema' : '❌ Schema';
        
        $tooltip = "SEO Status: {$status}\n" . implode("\n", $tooltip_parts) . "\nClick to edit SEO settings";
        
        return [
            'indicator' => $indicator,
            'score' => $score,
            'color' => $color,
            'status' => $status,
            'tooltip' => $tooltip
        ];
    }
}