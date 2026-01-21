<?php
/**
 * Sitemap and Robots.txt Handler
 * 
 * This class handles:
 * - Detecting videos from WordPress media library and post content
 * - Deploying sitemap.xml and robots.txt files to WordPress root
 * - Deploying video sitemap (video-sitemap.xml) if videos exist
 * 
 * @package SEO_Plugin
 */

class SEO_Plugin_Sitemap_Handler {
    
    /**
     * Register REST API routes
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }
    
    /**
     * Register the REST API endpoints
     * 
     * Creates two endpoints:
     * - /detect-videos: GET - Scans for videos
     * - /deploy-files: POST - Writes sitemap and robots.txt files
     */
    public function register_routes() {
        // Endpoint to detect videos
        register_rest_route('seo-plugin/v1', '/detect-videos', array(
            'methods'             => 'GET',
            'callback'            => array($this, 'detect_videos'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
        
        // Endpoint to deploy files
        register_rest_route('seo-plugin/v1', '/deploy-files', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'deploy_files'),
            'permission_callback' => array($this, 'check_permissions'),
        ));
    }
    
    /**
     * Check if user has permission to manage options
     * This ensures only administrators can use these endpoints
     * 
     * @return bool True if user has permission
     */
    public function check_permissions() {
        return current_user_can('manage_options');
    }
    
    /**
     * Detect videos from WordPress
     * 
     * This function scans two sources:
     * 1. WordPress Media Library - for uploaded video files
     * 2. Post Content - for YouTube and Vimeo embeds
     * 
     * @param WP_REST_Request $request The REST request object
     * @return WP_REST_Response Response containing detected videos
     */
    public function detect_videos($request) {
        $videos = array();
        
        // 1. Get videos from WordPress Media Library
        $media_videos = $this->get_media_library_videos();
        $videos = array_merge($videos, $media_videos);
        
        // 2. Get embedded videos from posts
        $embedded_videos = $this->get_embedded_videos();
        $videos = array_merge($videos, $embedded_videos);
        
        return new WP_REST_Response(array(
            'success' => true,
            'data'    => $videos,
            'message' => sprintf('Found %d videos', count($videos))
        ), 200);
    }
    
    /**
     * Get videos from WordPress Media Library
     * 
     * Queries for attachments with video MIME types (mp4, webm, etc.)
     * 
     * @return array Array of video data
     */
    private function get_media_library_videos() {
        $videos = array();
        
        // Query for video attachments
        // get_posts() retrieves posts from WordPress database
        // 'post_type' => 'attachment' means we're looking for media files
        // 'post_mime_type' => 'video' means only video files
        $video_attachments = get_posts(array(
            'post_type'      => 'attachment',
            'post_mime_type' => 'video',
            'posts_per_page' => -1, // -1 means get all videos, no limit
            'post_status'    => 'inherit', // 'inherit' is the status for attachments
        ));
        
        foreach ($video_attachments as $attachment) {
            // wp_get_attachment_url() gets the direct URL to the video file
            $video_url = wp_get_attachment_url($attachment->ID);
            
            // wp_get_attachment_metadata() gets file info like dimensions, filesize
            $metadata = wp_get_attachment_metadata($attachment->ID);
            
            // Get duration if available (WordPress stores this for some video formats)
            $duration = isset($metadata['length_formatted']) ? $metadata['length_formatted'] : '';
            
            // Get the attachment page URL (where video is embedded on site)
            $attachment_url = get_attachment_link($attachment->ID);
            
            $videos[] = array(
                'id'          => $attachment->ID,
                'title'       => $attachment->post_title,
                'description' => $attachment->post_content,
                'url'         => $attachment_url, // Page URL for sitemap
                'thumbnail'   => wp_get_attachment_thumb_url($attachment->ID),
                'duration'    => $duration,
                'date'        => $attachment->post_date,
                'source'      => 'media',
            );
        }
        
        return $videos;
    }
    
    /**
     * Get embedded videos from post content
     * 
     * Scans all published posts and pages for YouTube and Vimeo embeds
     * Uses regex patterns to find embed codes and extract video IDs
     * 
     * @return array Array of embedded video data
     */
    private function get_embedded_videos() {
        $videos = array();
        
        // Get all published posts and pages
        // WP_Query is WordPress's main class for querying the database
        $query = new WP_Query(array(
            'post_type'      => array('post', 'page'), // Search both posts and pages
            'post_status'    => 'publish', // Only published content
            'posts_per_page' => -1, // Get all posts
        ));
        
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                
                // get_the_content() gets the post HTML content
                $content = get_the_content();
                
                // Find YouTube embeds
                // preg_match_all() is PHP's regex function to find all matches
                // This pattern looks for youtube.com/embed/ URLs or youtube.com/watch?v= URLs
                preg_match_all(
                    '/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/',
                    $content,
                    $youtube_matches
                );
                
                // $youtube_matches[1] contains the video IDs (the part after embed/ or v=)
                foreach ($youtube_matches[1] as $video_id) {
                    $videos[] = array(
                        'id'          => 'youtube_' . $video_id,
                        'title'       => get_the_title(),
                        'description' => get_the_excerpt(),
                        'url'         => get_permalink(), // Page where video is embedded
                        'thumbnail'   => "https://img.youtube.com/vi/{$video_id}/maxresdefault.jpg",
                        'duration'    => '', // Can't easily get duration without YouTube API
                        'date'        => get_the_date('c'), // 'c' format is ISO 8601
                        'source'      => 'youtube',
                    );
                }
                
                // Find Vimeo embeds
                // Similar pattern for Vimeo URLs
                preg_match_all(
                    '/vimeo\.com\/(?:video\/)?([0-9]+)/',
                    $content,
                    $vimeo_matches
                );
                
                foreach ($vimeo_matches[1] as $video_id) {
                    $videos[] = array(
                        'id'          => 'vimeo_' . $video_id,
                        'title'       => get_the_title(),
                        'description' => get_the_excerpt(),
                        'url'         => get_permalink(),
                        'thumbnail'   => '', // Would need Vimeo API for thumbnail
                        'duration'    => '',
                        'date'        => get_the_date('c'),
                        'source'      => 'vimeo',
                    );
                }
            }
            
            // wp_reset_postdata() is IMPORTANT - resets global post data after custom query
            // Without this, other parts of WordPress might get confused about which post is current
            wp_reset_postdata();
        }
        
        return $videos;
    }
    
    /**
     * Deploy sitemap and robots.txt files
     * 
     * Writes the XML sitemap, video sitemap (if exists), and robots.txt
     * to the WordPress root directory (usually public_html or www)
     * 
     * @param WP_REST_Request $request Contains the file contents to deploy
     * @return WP_REST_Response Success or error response
     */
    public function deploy_files($request) {
        // Get the data from the request
        // get_json_params() extracts the JSON body from POST request
        $params = $request->get_json_params();
        
        $sitemap_xml = isset($params['sitemap_xml']) ? $params['sitemap_xml'] : '';
        $video_sitemap_xml = isset($params['video_sitemap_xml']) ? $params['video_sitemap_xml'] : '';
        $robots_txt = isset($params['robots_txt']) ? $params['robots_txt'] : '';
        
        // ABSPATH is WordPress constant for the root directory
        // Usually something like /var/www/html/ or /home/user/public_html/
        $root_path = ABSPATH;
        
        $results = array();
        
        // Deploy sitemap.xml
        if (!empty($sitemap_xml)) {
            $sitemap_file = $root_path . 'sitemap.xml';
            
            // file_put_contents() writes content to a file
            // If file exists, it overwrites it. If not, creates new file.
            $result = file_put_contents($sitemap_file, $sitemap_xml);
            
            if ($result === false) {
                // false means write failed (usually permission issue)
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Failed to write sitemap.xml. Check file permissions.',
                ), 500);
            }
            
            $results['sitemap'] = array(
                'success' => true,
                'path'    => $sitemap_file,
                'bytes'   => $result, // Number of bytes written
            );
        }
        
        // Deploy video-sitemap.xml (only if videos exist)
        if (!empty($video_sitemap_xml)) {
            $video_sitemap_file = $root_path . 'video-sitemap.xml';
            $result = file_put_contents($video_sitemap_file, $video_sitemap_xml);
            
            if ($result === false) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Failed to write video-sitemap.xml. Check file permissions.',
                ), 500);
            }
            
            $results['video_sitemap'] = array(
                'success' => true,
                'path'    => $video_sitemap_file,
                'bytes'   => $result,
            );
        }
        
        // Deploy robots.txt
        if (!empty($robots_txt)) {
            $robots_file = $root_path . 'robots.txt';
            $result = file_put_contents($robots_file, $robots_txt);
            
            if ($result === false) {
                return new WP_REST_Response(array(
                    'success' => false,
                    'message' => 'Failed to write robots.txt. Check file permissions.',
                ), 500);
            }
            
            $results['robots'] = array(
                'success' => true,
                'path'    => $robots_file,
                'bytes'   => $result,
            );
        }
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Files deployed successfully',
            'results' => $results,
        ), 200);
    }
}

// Initialize the handler
// This creates an instance of the class which triggers __construct()
// which then registers the REST API routes
new SEO_Plugin_Sitemap_Handler();