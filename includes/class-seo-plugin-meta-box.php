<?php
/**
 * Meta Box for Post/Page Edit Screens
 * Adds a lightweight SEO overview and edit button
 */

class SEO_Plugin_Meta_Box {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('add_meta_boxes', [$this, 'add_meta_box']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_meta_box_assets']);
        
        // AJAX endpoints for getting page SEO data
        add_action('wp_ajax_seo_plugin_get_page_data', [$this, 'ajax_get_page_data']);
    }
    
    /**
     * Add SEO meta box to post/page edit screens
     */
    public function add_meta_box() {
        $post_types = ['post', 'page']; // Add more post types as needed
        
        foreach ($post_types as $post_type) {
            add_meta_box(
                'seo-plugin-meta-box',
                '🔍 SEO Properties', // Simple icon + title
                [$this, 'render_meta_box'],
                $post_type,
                'side', // Right sidebar
                'high' // High priority
            );
        }
    }
    
    /**
     * Render the meta box content
     */
    public function render_meta_box($post) {
        // Get current SEO data
        $page_settings = get_option("seo_plugin_page_{$post->ID}", []);
        $global_settings = get_option('seo_plugin_page_global', []);
        $merged_settings = array_merge($global_settings, $page_settings);
        
        // Quick SEO status
        $has_title = !empty($merged_settings['meta_title']);
        $has_description = !empty($merged_settings['meta_description']);
        $has_schema = !empty($merged_settings['schemaType']);
        
        // Calculate SEO "score"
        $seo_items = [$has_title, $has_description, $has_schema];
        $seo_score = count(array_filter($seo_items));
        $seo_total = count($seo_items);
        
        ?>
        <div class="seo-plugin-meta-box">
            <!-- SEO Status Summary -->
            <div class="seo-status">
                <div class="seo-score">
                    <span class="score-number"><?php echo $seo_score; ?>/<?php echo $seo_total; ?></span>
                    <span class="score-label">SEO Items</span>
                </div>
                
                <div class="seo-checklist">
                    <div class="seo-item <?php echo $has_title ? 'complete' : 'incomplete'; ?>">
                        <?php echo $has_title ? '✅' : '❌'; ?> Meta Title
                    </div>
                    <div class="seo-item <?php echo $has_description ? 'complete' : 'incomplete'; ?>">
                        <?php echo $has_description ? '✅' : '❌'; ?> Description  
                    </div>
                    <div class="seo-item <?php echo $has_schema ? 'complete' : 'incomplete'; ?>">
                        <?php echo $has_schema ? '✅' : '❌'; ?> Schema Markup
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="seo-actions">
                <button type="button" class="button button-secondary seo-view-properties" 
                        data-post-id="<?php echo $post->ID; ?>">
                    👁️ View SEO Properties
                </button>
                
                <a href="<?php echo admin_url('admin.php?page=seo-plugin&tab=general&page_id=' . $post->ID); ?>" 
                   class="button button-primary">
                    ✏️ Edit SEO Settings
                </a>
            </div>
            
            <!-- Quick Preview -->
            <?php if ($has_title || $has_description): ?>
            <div class="seo-preview">
                <strong>Search Preview:</strong>
                <div class="serp-preview">
                    <div class="serp-title">
                        <?php echo esc_html($merged_settings['meta_title'] ?: get_the_title($post)); ?>
                    </div>
                    <div class="serp-url">
                        <?php echo esc_html(str_replace(home_url(), '', get_permalink($post))); ?>
                    </div>
                    <div class="serp-description">
                        <?php echo esc_html($merged_settings['meta_description'] ?: 'No meta description set.'); ?>
                    </div>
                </div>
            </div>
            <?php endif; ?>
        </div>
        
        <!-- Modal for detailed view (hidden by default) -->
        <div id="seo-properties-modal" class="seo-modal" style="display: none;">
            <div class="seo-modal-content">
                <div class="seo-modal-header">
                    <h3>SEO Properties for: <?php echo esc_html(get_the_title($post)); ?></h3>
                    <span class="seo-modal-close">&times;</span>
                </div>
                
                <div class="seo-modal-body">
                    <div class="seo-tabs">
                        <button class="seo-tab-button active" data-tab="preview">👁️ Preview</button>
                        <button class="seo-tab-button" data-tab="code">💻 Code</button>
                        <button class="seo-tab-button" data-tab="data">📊 Data</button>
                    </div>
                    
                    <div class="seo-tab-content">
                        <div id="seo-tab-preview" class="seo-tab-panel active">
                            Loading preview...
                        </div>
                        <div id="seo-tab-code" class="seo-tab-panel">
                            Loading code...
                        </div>
                        <div id="seo-tab-data" class="seo-tab-panel">
                            Loading data...
                        </div>
                    </div>
                </div>
                
                <div class="seo-modal-footer">
                    <a href="<?php echo admin_url('admin.php?page=seo-plugin&tab=general&page_id=' . $post->ID); ?>" 
                       class="button button-primary">
                        Edit SEO Settings
                    </a>
                    <button type="button" class="button button-secondary seo-modal-close">Close</button>
                </div>
            </div>
        </div>
        <?php
    }
    
    /**
     * AJAX handler to get SEO data for a specific page
     */
    public function ajax_get_page_data() {
        // Verify nonce and permissions
        if (!current_user_can('edit_posts')) {
            wp_die('Insufficient permissions');
        }
        
        $post_id = intval($_POST['post_id']);
        if (!$post_id) {
            wp_die('Invalid post ID');
        }
        
        // Get SEO data
        $page_settings = get_option("seo_plugin_page_{$post_id}", []);
        $global_settings = get_option('seo_plugin_page_global', []);
        $merged_settings = array_merge($global_settings, $page_settings);
        
        // Get post data
        $post = get_post($post_id);
        $permalink = get_permalink($post_id);
        
        // Generate different views
        $response = [
            'preview' => $this->generate_preview_html($merged_settings, $post),
            'code' => $this->generate_code_output($merged_settings, $post),
            'data' => $this->generate_data_json($merged_settings, $post)
        ];
        
        wp_send_json_success($response);
    }
    
    /**
     * Generate human-readable preview
     */
    private function generate_preview_html($settings, $post) {
        $html = '<div class="seo-preview-content">';
        
        // Basic Meta
        $html .= '<h4>🏷️ Basic Meta Tags</h4>';
        $html .= '<div class="seo-field">';
        $html .= '<strong>Title:</strong> ' . esc_html($settings['meta_title'] ?: get_the_title($post)) . '<br>';
        $html .= '<strong>Description:</strong> ' . esc_html($settings['meta_description'] ?: 'Not set') . '<br>';
        $html .= '<strong>Robots:</strong> ' . esc_html(($settings['robots_index'] ?: 'index') . ', ' . ($settings['robots_follow'] ?: 'follow'));
        $html .= '</div>';
        
        // Schema
        if (!empty($settings['schemaType'])) {
            $html .= '<h4>📊 Schema Markup</h4>';
            $html .= '<div class="seo-field">';
            $html .= '<strong>Type:</strong> ' . esc_html($settings['schemaType']) . '<br>';
            if (!empty($settings['name'])) {
                $html .= '<strong>Name:</strong> ' . esc_html($settings['name']) . '<br>';
            }
            $html .= '</div>';
        }
        
        // Social Media
        if (!empty($settings['og_title']) || !empty($settings['og_description'])) {
            $html .= '<h4>📱 Social Media</h4>';
            $html .= '<div class="seo-field">';
            if (!empty($settings['og_title'])) {
                $html .= '<strong>OG Title:</strong> ' . esc_html($settings['og_title']) . '<br>';
            }
            if (!empty($settings['og_description'])) {
                $html .= '<strong>OG Description:</strong> ' . esc_html($settings['og_description']) . '<br>';
            }
            $html .= '</div>';
        }
        
        // Tracking
        $tracking_count = 0;
        if (!empty($settings['google_analytics_id'])) $tracking_count++;
        if (!empty($settings['google_tag_manager_id'])) $tracking_count++;
        if (!empty($settings['facebook_pixel_id'])) $tracking_count++;
        
        if ($tracking_count > 0) {
            $html .= '<h4>📊 Tracking</h4>';
            $html .= '<div class="seo-field">';
            $html .= "<strong>{$tracking_count} tracking codes active</strong>";
            $html .= '</div>';
        }
        
        $html .= '</div>';
        return $html;
    }
    
    /**
     * Generate code output (HTML/JSON-LD)
     */
    private function generate_code_output($settings, $post) {
        $code = "<!-- Meta Tags -->\n";
        
        // Basic meta tags
        if (!empty($settings['meta_title'])) {
            $code .= '<title>' . esc_html($settings['meta_title']) . "</title>\n";
        }
        if (!empty($settings['meta_description'])) {
            $code .= '<meta name="description" content="' . esc_attr($settings['meta_description']) . "\">\n";
        }
        
        // Robots
        $robots = ($settings['robots_index'] ?: 'index') . ', ' . ($settings['robots_follow'] ?: 'follow');
        $code .= '<meta name="robots" content="' . esc_attr($robots) . "\">\n";
        
        // Schema (simplified)
        if (!empty($settings['schemaType'])) {
            $code .= "\n<!-- Schema Markup -->\n";
            $code .= '<script type="application/ld+json">' . "\n";
            $schema = [
                '@context' => 'https://schema.org',
                '@type' => $settings['schemaType'],
                'name' => $settings['name'] ?: get_the_title($post),
                'description' => $settings['description'] ?: $settings['meta_description'],
                'url' => get_permalink($post)
            ];
            $code .= json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            $code .= "\n</script>\n";
        }
        
        return '<pre><code>' . esc_html($code) . '</code></pre>';
    }
    
    /**
     * Generate clean JSON data
     */
    private function generate_data_json($settings, $post) {
        $data = [
            'post_id' => $post->ID,
            'post_title' => get_the_title($post),
            'permalink' => get_permalink($post),
            'meta_title' => $settings['meta_title'] ?: null,
            'meta_description' => $settings['meta_description'] ?: null,
            'robots_index' => $settings['robots_index'] ?: 'index',
            'robots_follow' => $settings['robots_follow'] ?: 'follow',
            'schema_type' => $settings['schemaType'] ?: null,
            'has_tracking' => [
                'google_analytics' => !empty($settings['google_analytics_id']),
                'google_tag_manager' => !empty($settings['google_tag_manager_id']),
                'facebook_pixel' => !empty($settings['facebook_pixel_id'])
            ]
        ];
        
        return '<pre><code>' . json_encode($data, JSON_PRETTY_PRINT) . '</code></pre>';
    }
    
    /**
     * Enqueue assets for the meta box
     */
    public function enqueue_meta_box_assets($hook) {
        // Only load on post/page edit screens
        if (!in_array($hook, ['post.php', 'post-new.php'])) {
            return;
        }
        
        // Enqueue CSS
        wp_add_inline_style('wp-admin', $this->get_meta_box_css());
        
        // Enqueue JS
        wp_add_inline_script('wp-admin', $this->get_meta_box_js());
    }
    
    /**
     * Get CSS for meta box styling
     */
    private function get_meta_box_css() {
        return '
        .seo-plugin-meta-box {
            padding: 0;
        }
        .seo-status {
            background: #f9f9f9;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 12px;
        }
        .seo-score {
            text-align: center;
            margin-bottom: 8px;
        }
        .score-number {
            font-size: 18px;
            font-weight: bold;
            color: #0073aa;
        }
        .score-label {
            font-size: 12px;
            color: #666;
            display: block;
        }
        .seo-checklist {
            font-size: 12px;
        }
        .seo-item {
            margin: 2px 0;
        }
        .seo-item.complete {
            color: #46b450;
        }
        .seo-item.incomplete {
            color: #dc3232;
        }
        .seo-actions {
            margin: 12px 0;
        }
        .seo-actions .button {
            width: 100%;
            margin-bottom: 6px;
            text-align: center;
        }
        .seo-preview {
            background: #fff;
            border: 1px solid #ddd;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
        }
        .serp-preview {
            margin-top: 4px;
        }
        .serp-title {
            color: #1a0dab;
            font-size: 14px;
            margin-bottom: 2px;
        }
        .serp-url {
            color: #006621;
            font-size: 12px;
            margin-bottom: 2px;
        }
        .serp-description {
            color: #545454;
            font-size: 12px;
            line-height: 1.4;
        }
        
        /* Modal Styles */
        .seo-modal {
            position: fixed;
            z-index: 999999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .seo-modal-content {
            background-color: #fff;
            margin: 5% auto;
            width: 80%;
            max-width: 800px;
            border-radius: 4px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .seo-modal-header {
            background: #0073aa;
            color: white;
            padding: 15px 20px;
            border-radius: 4px 4px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .seo-modal-header h3 {
            margin: 0;
            color: white;
        }
        .seo-modal-close {
            font-size: 24px;
            cursor: pointer;
        }
        .seo-modal-body {
            padding: 20px;
            max-height: 60vh;
            overflow-y: auto;
        }
        .seo-tabs {
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }
        .seo-tab-button {
            background: none;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            margin-right: 10px;
        }
        .seo-tab-button.active {
            border-bottom-color: #0073aa;
            color: #0073aa;
        }
        .seo-tab-panel {
            display: none;
        }
        .seo-tab-panel.active {
            display: block;
        }
        .seo-modal-footer {
            padding: 15px 20px;
            border-top: 1px solid #ddd;
            text-align: right;
        }
        .seo-modal-footer .button {
            margin-left: 10px;
        }
        .seo-preview-content h4 {
            color: #0073aa;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin: 15px 0 10px 0;
        }
        .seo-field {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        ';
    }
    
    /**
     * Get JavaScript for meta box functionality
     */
    private function get_meta_box_js() {
        return '
        document.addEventListener("DOMContentLoaded", function() {
            // View Properties button click
            document.addEventListener("click", function(e) {
                if (e.target.classList.contains("seo-view-properties")) {
                    e.preventDefault();
                    const postId = e.target.getAttribute("data-post-id");
                    openSeoModal(postId);
                }
                
                // Modal close
                if (e.target.classList.contains("seo-modal-close")) {
                    document.getElementById("seo-properties-modal").style.display = "none";
                }
                
                // Tab switching
                if (e.target.classList.contains("seo-tab-button")) {
                    const tabName = e.target.getAttribute("data-tab");
                    switchSeoTab(tabName);
                }
            });
            
            // Close modal when clicking outside
            document.addEventListener("click", function(e) {
                const modal = document.getElementById("seo-properties-modal");
                if (e.target === modal) {
                    modal.style.display = "none";
                }
            });
            
            function openSeoModal(postId) {
                const modal = document.getElementById("seo-properties-modal");
                modal.style.display = "block";
                
                // Load data via AJAX
                const data = new FormData();
                data.append("action", "seo_plugin_get_page_data");
                data.append("post_id", postId);
                
                fetch(ajaxurl, {
                    method: "POST",
                    body: data
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        document.getElementById("seo-tab-preview").innerHTML = result.data.preview;
                        document.getElementById("seo-tab-code").innerHTML = result.data.code;
                        document.getElementById("seo-tab-data").innerHTML = result.data.data;
                    } else {
                        console.error("Failed to load SEO data");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
            
            function switchSeoTab(tabName) {
                // Remove active class from all tabs and panels
                document.querySelectorAll(".seo-tab-button").forEach(btn => btn.classList.remove("active"));
                document.querySelectorAll(".seo-tab-panel").forEach(panel => panel.classList.remove("active"));
                
                // Add active class to clicked tab and corresponding panel
                document.querySelector(\'.seo-tab-button[data-tab="\' + tabName + \'"]\').classList.add("active");
                document.getElementById("seo-tab-" + tabName).classList.add("active");
            }
        });
        ';
    }
}