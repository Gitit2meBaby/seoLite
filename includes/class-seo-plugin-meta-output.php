<?php
/**
 * Meta Output Handler for SEO Plugin
 * 
 * This class handles outputting meta tags AND schema markup to the website's <head> section.
 * It works by:
 * 1. Detecting what page/post we're on
 * 2. Getting the saved meta settings for that page
 * 3. Outputting the appropriate meta tags AND schema JSON-LD
 */

class SEO_Plugin_Meta_Output {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Hook into wp_head with high priority (1) so our meta tags come first
        add_action('wp_head', [$this, 'output_meta_tags'], 1);
        
        // Hook to modify page title
        add_filter('pre_get_document_title', [$this, 'filter_page_title'], 10, 1);
    }
    
    /**
     * Main function that outputs all meta tags AND schema markup
     * This runs on every page load on the frontend
     */
    public function output_meta_tags() {
        // Don't output meta tags during REST API requests
        if (defined('REST_REQUEST') && REST_REQUEST) {
            return;
        }
        
        // Add our plugin identifier comment
        echo "<!-- SEO Plugin Meta Tags -->\n";
        
        // Get current page settings WITH DEBUG
        $meta_settings = $this->debug_current_page_meta();
        
        // Output each type of meta tag
        $this->output_basic_meta_tags($meta_settings);
        $this->output_robots_meta($meta_settings);
        $this->output_canonical_url($meta_settings);
        $this->output_hreflang($meta_settings);
        $this->output_date_meta($meta_settings);
        $this->output_social_media_meta($meta_settings);
        
        // 🌟 Schema Markup with debug
        $this->output_schema_markup($meta_settings);
        
        echo "<!-- /SEO Plugin Meta Tags -->\n";
    }
    
    /**
     * 🆕 Output Schema Markup JSON-LD
     * This automatically generates and injects schema based on user settings
     */
   // Replace the output_schema_markup method in your class-seo-plugin-meta-output.php file
// Find this method and replace it entirely with this debug version:

// Replace the output_schema_markup method in class-seo-plugin-meta-output.php with this debug version:

// Replace ONLY the output_schema_markup method in class-seo-plugin-meta-output.php
// Don't add the other debug methods I mentioned - just replace this one method:

public function output_schema_markup($meta_settings) {
    echo "<!-- SEO Plugin: === SIMPLE SCHEMA DEBUG === -->\n";
    
    // 1. Check what we received
    if (!is_array($meta_settings)) {
        echo "<!-- 1. Meta settings is not an array: " . gettype($meta_settings) . " -->\n";
        $meta_settings = [];
    } else {
        echo "<!-- 1. Meta settings keys: " . implode(', ', array_keys($meta_settings)) . " -->\n";
    }
    
    // 2. Check database directly for ANY saved schema data
    global $wpdb;
    $all_options = $wpdb->get_results(
        "SELECT option_name, option_value FROM {$wpdb->options} 
         WHERE option_name LIKE 'seo_plugin_page_%' 
         ORDER BY option_name"
    );
    
    echo "<!-- 2. Found " . count($all_options) . " seo_plugin_page options in database -->\n";
    
    foreach ($all_options as $option) {
        $value = maybe_unserialize($option->option_value);
        if (is_array($value)) {
            $has_schema = false;
            foreach (array_keys($value) as $key) {
                if (strpos(strtolower($key), 'schema') !== false) {
                    $has_schema = true;
                    break;
                }
            }
            echo "<!-- 2. {$option->option_name}: " . count($value) . " fields" . ($has_schema ? " (HAS SCHEMA)" : "") . " -->\n";
        }
    }
    
    // 3. Try to find schema data in ANY of these options
    $schema_found = false;
    $schema_type = '';
    $schema_data = [];
    
    foreach ($all_options as $option) {
        $value = maybe_unserialize($option->option_value);
        if (is_array($value) && !empty($value['schemaType'])) {
            $schema_type = $value['schemaType'];
            $schema_data = $value;
            $schema_found = true;
            echo "<!-- 3. FOUND SCHEMA in {$option->option_name}: type = {$schema_type} -->\n";
            break;
        }
    }
    
    if (!$schema_found) {
        echo "<!-- 3. NO SCHEMA DATA found in any database option -->\n";
    }
    
    // 4. ALWAYS output a test schema so we can verify the mechanism works
    echo "<!-- 4. Force outputting test schema -->\n";
    
    $test_schema = [
        '@context' => 'https://schema.org',
        '@type' => 'WebSite',
        'name' => get_bloginfo('name'),
        'url' => home_url(),
        'description' => get_bloginfo('description'),
        'dateModified' => current_time('c'),
        'debug_info' => [
            'schema_found_in_db' => $schema_found,
            'schema_type_if_found' => $schema_type,
            'timestamp' => current_time('c')
        ]
    ];
    
    echo "<script type=\"application/ld+json\">\n";
    echo wp_json_encode($test_schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    echo "\n</script>\n";
    
    // 5. If we found real schema data, try to output that too
    if ($schema_found && !empty($schema_data)) {
        echo "<!-- 5. Attempting to generate real schema -->\n";
        $real_schema = $this->generate_schema_json($schema_data, $schema_type);
        
        if (!empty($real_schema)) {
            echo "<script type=\"application/ld+json\">\n";
            echo wp_json_encode($real_schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            echo "\n</script>\n";
            echo "<!-- 5. Real schema generated successfully -->\n";
        } else {
            echo "<!-- 5. Real schema generation failed -->\n";
        }
    }
    
    echo "<!-- SEO Plugin: === END SIMPLE SCHEMA DEBUG === -->\n";
}

    /**
     * 🆕 Generate Schema JSON from user settings
     * This converts the form data into proper Schema.org structure
     */
    private function generate_schema_json($meta_settings, $schema_type) {
        // Schema type definitions with their available fields
        $schema_types = [
            'Organization' => [
                'fields' => ['name', 'url', 'logo', 'description', 'email', 'telephone', 'address', 'sameAs', 'foundingDate', 'numberOfEmployees', 'areaServed', 'openingHours', 'hasOfferCatalog', 'paymentAccepted', 'priceRange']
            ],
            'LocalBusiness' => [
                'extends' => 'Organization',
                'fields' => ['name', 'url', 'logo', 'description', 'email', 'telephone', 'address', 'sameAs', 'openingHours', 'hasOfferCatalog', 'paymentAccepted', 'priceRange', 'servesCuisine', 'acceptsReservations', 'menuUrl']
            ],
            'Restaurant' => [
                'extends' => 'LocalBusiness', 
                'fields' => ['name', 'url', 'logo', 'description', 'email', 'telephone', 'address', 'sameAs', 'openingHours', 'servesCuisine', 'acceptsReservations', 'menuUrl', 'paymentAccepted', 'priceRange']
            ],
            'Store' => [
                'extends' => 'LocalBusiness',
                'fields' => ['name', 'url', 'logo', 'description', 'email', 'telephone', 'address', 'sameAs', 'openingHours', 'hasOfferCatalog', 'paymentAccepted', 'priceRange']
            ],
            'Article' => [
                'fields' => ['headline', 'description', 'author', 'publisher', 'datePublished', 'dateModified', 'image', 'articleSection', 'wordCount', 'articleBody']
            ],
            'NewsArticle' => [
                'extends' => 'Article',
                'fields' => ['headline', 'description', 'author', 'publisher', 'datePublished', 'dateModified', 'image', 'articleSection', 'wordCount', 'dateline']
            ],
            'Product' => [
                'fields' => ['name', 'description', 'image', 'brand', 'manufacturer', 'model', 'sku', 'gtin', 'offers', 'aggregateRating', 'review']
            ],
            'Service' => [
                'fields' => ['name', 'description', 'provider', 'serviceType', 'areaServed', 'hasOfferCatalog', 'offers', 'aggregateRating', 'review']
            ],
            'Person' => [
                'fields' => ['name', 'url', 'image', 'description', 'email', 'jobTitle', 'worksFor', 'sameAs', 'birthDate', 'nationality', 'alumniOf']
            ],
            'Event' => [
                'fields' => ['name', 'description', 'startDate', 'endDate', 'location', 'organizer', 'performer', 'offers', 'eventStatus', 'eventAttendanceMode', 'image']
            ],
            'Recipe' => [
                'fields' => ['name', 'description', 'image', 'author', 'datePublished', 'prepTime', 'cookTime', 'totalTime', 'recipeYield', 'recipeCategory', 'recipeCuisine', 'recipeIngredient', 'recipeInstructions', 'nutrition', 'aggregateRating']
            ],
            'Book' => [
                'fields' => ['name', 'description', 'author', 'publisher', 'datePublished', 'isbn', 'numberOfPages', 'bookFormat', 'genre', 'image', 'aggregateRating']
            ],
            'Course' => [
                'fields' => ['name', 'description', 'provider', 'courseCode', 'educationalLevel', 'timeRequired', 'coursePrerequisites', 'competencyRequired', 'offers']
            ],
            'WebSite' => [
                'fields' => ['name', 'url', 'description', 'publisher', 'potentialAction', 'sameAs']
            ],
            'WebPage' => [
                'fields' => ['name', 'description', 'url', 'isPartOf', 'primaryImageOfPage', 'datePublished', 'dateModified', 'author']
            ]
        ];
        
        // Start building the schema
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => $schema_type
        ];
        
        // Get the field configuration for this schema type
        $type_config = $schema_types[$schema_type] ?? null;
        if (!$type_config) {
            return $schema; // Return basic schema if type not found
        }
        
        $fields_to_include = $type_config['fields'] ?? [];
        
        // Process each field
        foreach ($fields_to_include as $field_key) {
            $value = $meta_settings[$field_key] ?? null;
            
            if (empty($value)) {
                continue; // Skip empty values
            }
            
            // Handle different field types and convert them to proper schema format
            $schema_value = $this->convert_field_to_schema($field_key, $value, $meta_settings);
            
            if ($schema_value !== null) {
                $schema[$field_key] = $schema_value;
            }
        }
        
        // Add computed fields and special cases
        $schema = $this->add_computed_schema_fields($schema, $schema_type, $meta_settings);
        
        return $schema;
    }
    
    /**
     * 🆕 Convert individual field values to proper schema format
     */
    private function convert_field_to_schema($field_key, $value, $meta_settings) {
        // Handle different field types
        switch ($field_key) {
            case 'address':
                // Convert address object to PostalAddress schema
                if (is_array($value) || is_object($value)) {
                    $address_array = (array) $value;
                    $address_schema = ['@type' => 'PostalAddress'];
                    
                    $address_mapping = [
                        'streetAddress' => 'streetAddress',
                        'addressLocality' => 'addressLocality', 
                        'addressRegion' => 'addressRegion',
                        'postalCode' => 'postalCode',
                        'addressCountry' => 'addressCountry'
                    ];
                    
                    foreach ($address_mapping as $key => $schema_key) {
                        if (!empty($address_array[$key])) {
                            $address_schema[$schema_key] = $address_array[$key];
                        }
                    }
                    
                    return count($address_schema) > 1 ? $address_schema : null;
                }
                break;
                
            case 'author':
            case 'publisher':
                // Convert author/publisher object to Person/Organization schema
                if (is_array($value) || is_object($value)) {
                    $obj_array = (array) $value;
                    $obj_schema = ['@type' => $field_key === 'publisher' ? 'Organization' : 'Person'];
                    
                    if (!empty($obj_array['name'])) {
                        $obj_schema['name'] = $obj_array['name'];
                    }
                    if (!empty($obj_array['url'])) {
                        $obj_schema['url'] = $obj_array['url'];
                    }
                    if (!empty($obj_array['logo']) && $field_key === 'publisher') {
                        $obj_schema['logo'] = $obj_array['logo'];
                    }
                    if (!empty($obj_array['image']) && $field_key === 'author') {
                        $obj_schema['image'] = $obj_array['image'];
                    }
                    
                    return count($obj_schema) > 1 ? $obj_schema : null;
                }
                break;
                
            case 'location':
                // Convert location object to Place schema
                if (is_array($value) || is_object($value)) {
                    $loc_array = (array) $value;
                    $loc_schema = ['@type' => 'Place'];
                    
                    if (!empty($loc_array['name'])) {
                        $loc_schema['name'] = $loc_array['name'];
                    }
                    if (!empty($loc_array['address'])) {
                        $loc_schema['address'] = $loc_array['address'];
                    }
                    
                    return count($loc_schema) > 1 ? $loc_schema : null;
                }
                break;
                
            case 'offers':
                // Convert offers object to Offer schema
                if (is_array($value) || is_object($value)) {
                    $offer_array = (array) $value;
                    $offer_schema = ['@type' => 'Offer'];
                    
                    if (!empty($offer_array['price'])) {
                        $offer_schema['price'] = $offer_array['price'];
                    }
                    if (!empty($offer_array['priceCurrency'])) {
                        $offer_schema['priceCurrency'] = $offer_array['priceCurrency'];
                    }
                    if (!empty($offer_array['availability'])) {
                        $offer_schema['availability'] = 'https://schema.org/' . $offer_array['availability'];
                    }
                    if (!empty($offer_array['validFrom'])) {
                        $offer_schema['validFrom'] = $offer_array['validFrom'];
                    }
                    if (!empty($offer_array['validThrough'])) {
                        $offer_schema['validThrough'] = $offer_array['validThrough'];
                    }
                    
                    return count($offer_schema) > 1 ? $offer_schema : null;
                }
                break;
                
            case 'aggregateRating':
                // Convert rating object to AggregateRating schema
                if (is_array($value) || is_object($value)) {
                    $rating_array = (array) $value;
                    $rating_schema = ['@type' => 'AggregateRating'];
                    
                    if (!empty($rating_array['ratingValue'])) {
                        $rating_schema['ratingValue'] = $rating_array['ratingValue'];
                    }
                    if (!empty($rating_array['reviewCount'])) {
                        $rating_schema['reviewCount'] = $rating_array['reviewCount'];
                    }
                    if (!empty($rating_array['bestRating'])) {
                        $rating_schema['bestRating'] = $rating_array['bestRating'];
                    }
                    if (!empty($rating_array['worstRating'])) {
                        $rating_schema['worstRating'] = $rating_array['worstRating'];
                    }
                    
                    return count($rating_schema) > 1 ? $rating_schema : null;
                }
                break;
                
            case 'openingHours':
                // Convert opening hours object to proper format
                if (is_array($value) || is_object($value)) {
                    $hours_array = (array) $value;
                    $opening_hours = [];
                    
                    $day_mapping = [
                        'monday' => 'Mo',
                        'tuesday' => 'Tu', 
                        'wednesday' => 'We',
                        'thursday' => 'Th',
                        'friday' => 'Fr',
                        'saturday' => 'Sa',
                        'sunday' => 'Su'
                    ];
                    
                    foreach ($day_mapping as $day => $abbrev) {
                        if (!empty($hours_array[$day]) && strtolower($hours_array[$day]) !== 'closed') {
                            $opening_hours[] = $abbrev . ' ' . $hours_array[$day];
                        }
                    }
                    
                    return !empty($opening_hours) ? $opening_hours : null;
                }
                break;
                
            case 'sameAs':
            case 'recipeIngredient':
            case 'recipeInstructions':
            case 'paymentAccepted':
            case 'servesCuisine':
                // Handle arrays - could be stored as JSON string or actual array
                if (is_string($value)) {
                    // Try to decode JSON first
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        return array_filter($decoded); // Remove empty values
                    }
                    // If not JSON, split by newlines
                    $array_value = array_filter(array_map('trim', explode("\n", $value)));
                    return !empty($array_value) ? $array_value : null;
                } elseif (is_array($value)) {
                    return array_filter($value); // Remove empty values
                }
                break;
                
            case 'prepTime':
            case 'cookTime': 
            case 'totalTime':
                // Convert minutes to ISO 8601 duration format (PT15M)
                if (is_numeric($value)) {
                    return 'PT' . intval($value) . 'M';
                }
                break;
                
            case 'acceptsReservations':
            case 'hasOfferCatalog':
                // Convert string boolean to actual boolean
                if ($value === 'true') {
                    return true;
                } elseif ($value === 'false') {
                    return false;
                }
                break;
                
            default:
                // For simple fields, return as-is if not empty
                if (is_string($value)) {
                    return trim($value) !== '' ? trim($value) : null;
                }
                return $value;
        }
        
        return $value;
    }
    
    /**
     * 🆕 Add computed fields and special schema enhancements
     */
    private function add_computed_schema_fields($schema, $schema_type, $meta_settings) {
        // Add current page URL
        $schema['url'] = $this->get_current_page_url();
        
        // Add specific enhancements based on schema type
        switch ($schema_type) {
            case 'WebSite':
                // Add search action for websites
                if (!empty($schema['url'])) {
                    $schema['potentialAction'] = [
                        '@type' => 'SearchAction',
                        'target' => [
                            '@type' => 'EntryPoint',
                            'urlTemplate' => $schema['url'] . '?s={search_term_string}'
                        ],
                        'query-input' => 'required name=search_term_string'
                    ];
                }
                break;
                
            case 'Article':
            case 'NewsArticle':
                // Auto-fill article data from WordPress post if available
                global $post;
                if ($post) {
                    if (empty($schema['headline'])) {
                        $schema['headline'] = get_the_title($post);
                    }
                    if (empty($schema['datePublished'])) {
                        $schema['datePublished'] = get_the_date('c', $post);
                    }
                    if (empty($schema['dateModified'])) {
                        $schema['dateModified'] = get_the_modified_date('c', $post);
                    }
                    if (empty($schema['wordCount'])) {
                        $schema['wordCount'] = str_word_count(strip_tags(get_the_content()));
                    }
                    if (empty($schema['image'])) {
                        $featured_image = get_the_post_thumbnail_url($post, 'large');
                        if ($featured_image) {
                            $schema['image'] = $featured_image;
                        }
                    }
                }
                break;
                
            case 'Organization':
            case 'LocalBusiness':
            case 'Restaurant':
            case 'Store':
                // Add mainEntityOfPage for business schemas
                $schema['mainEntityOfPage'] = [
                    '@type' => 'WebPage',
                    '@id' => $this->get_current_page_url()
                ];
                break;
        }
        
        return $schema;
    }
    
    /**
     * 🆕 Get current page URL for schema markup
     */
    private function get_current_page_url() {
        global $wp;
        return home_url(add_query_arg([], $wp->request));
    }
    
    /**
     * 🆕 Output Social Media Meta Tags (Open Graph, Twitter Cards)
     * This handles the social media tab data
     */
    private function output_social_media_meta($meta_settings) {
        // Open Graph tags
        $og_title = $meta_settings['og_title'] ?? $meta_settings['meta_title'] ?? '';
        if ($og_title) {
            echo '<meta property="og:title" content="' . esc_attr($og_title) . '">' . "\n";
        }
        
        $og_description = $meta_settings['og_description'] ?? $meta_settings['meta_description'] ?? '';
        if ($og_description) {
            echo '<meta property="og:description" content="' . esc_attr($og_description) . '">' . "\n";
        }
        
        $og_image = $meta_settings['og_image'] ?? $meta_settings['social_default_image'] ?? '';
        if ($og_image) {
            echo '<meta property="og:image" content="' . esc_url($og_image) . '">' . "\n";
        }
        
        $og_image_alt = $meta_settings['og_image_alt'] ?? '';
        if ($og_image_alt) {
            echo '<meta property="og:image:alt" content="' . esc_attr($og_image_alt) . '">' . "\n";
        }
        
        $og_type = $meta_settings['og_type'] ?? 'website';
        echo '<meta property="og:type" content="' . esc_attr($og_type) . '">' . "\n";
        
        $og_url = $this->get_current_page_url();
        echo '<meta property="og:url" content="' . esc_url($og_url) . '">' . "\n";
        
        $og_site_name = $meta_settings['og_site_name'] ?? get_bloginfo('name');
        if ($og_site_name) {
            echo '<meta property="og:site_name" content="' . esc_attr($og_site_name) . '">' . "\n";
        }
        
        $og_locale = $meta_settings['og_locale'] ?? '';
        if ($og_locale) {
            echo '<meta property="og:locale" content="' . esc_attr($og_locale) . '">' . "\n";
        }
        
        // Twitter Card tags
        $twitter_card = $meta_settings['twitter_card_type'] ?? 'summary_large_image';
        echo '<meta name="twitter:card" content="' . esc_attr($twitter_card) . '">' . "\n";
        
        $twitter_site = $meta_settings['twitter_site'] ?? '';
        if ($twitter_site) {
            echo '<meta name="twitter:site" content="' . esc_attr($twitter_site) . '">' . "\n";
        }
        
        $twitter_creator = $meta_settings['twitter_creator'] ?? '';
        if ($twitter_creator) {
            echo '<meta name="twitter:creator" content="' . esc_attr($twitter_creator) . '">' . "\n";
        }
        
        $twitter_title = $meta_settings['twitter_title'] ?? $og_title;
        if ($twitter_title) {
            echo '<meta name="twitter:title" content="' . esc_attr($twitter_title) . '">' . "\n";
        }
        
        $twitter_description = $meta_settings['twitter_description'] ?? $og_description;
        if ($twitter_description) {
            echo '<meta name="twitter:description" content="' . esc_attr($twitter_description) . '">' . "\n";
        }
        
        $twitter_image = $meta_settings['twitter_image'] ?? $meta_settings['social_twitter_image'] ?? $og_image;
        if ($twitter_image) {
            echo '<meta name="twitter:image" content="' . esc_url($twitter_image) . '">' . "\n";
        }
        
        // Facebook specific
        $fb_app_id = $meta_settings['fb_app_id'] ?? '';
        if ($fb_app_id) {
            echo '<meta property="fb:app_id" content="' . esc_attr($fb_app_id) . '">' . "\n";
        }
        
        $fb_admins = $meta_settings['fb_admins'] ?? '';
        if ($fb_admins) {
            echo '<meta property="fb:admins" content="' . esc_attr($fb_admins) . '">' . "\n";
        }
    }
    
    /**
     * Get meta settings for the current page
     */
    public function debug_current_page_meta() {
        echo "<!-- DEBUG: get_current_page_meta() trace -->\n";
        
        global $post;
        echo "<!-- Global post object: " . (is_object($post) ? "ID {$post->ID}, Type {$post->post_type}" : 'NULL') . " -->\n";
        
        // Check what page detection returns
        $current_page_id = $this->get_current_page_id();
        echo "<!-- get_current_page_id() returned: " . var_export($current_page_id, true) . " -->\n";
        
        // Check WordPress conditional functions
        echo "<!-- is_front_page(): " . (is_front_page() ? 'true' : 'false') . " -->\n";
        echo "<!-- is_home(): " . (is_home() ? 'true' : 'false') . " -->\n";
        echo "<!-- is_page(): " . (is_page() ? 'true' : 'false') . " -->\n";
        echo "<!-- is_single(): " . (is_single() ? 'true' : 'false') . " -->\n";
        
        // Call the actual method
        $meta_settings = $this->get_current_page_meta();
        echo "<!-- get_current_page_meta() returned: " . gettype($meta_settings) . " with " . (is_array($meta_settings) ? count($meta_settings) : '0') . " items -->\n";
        
        return $meta_settings;
    }
    
    /**
     * Output basic meta tags (description, keywords)
     */
    private function output_basic_meta_tags($meta_settings) {
        // Meta description
        if (!empty($meta_settings['meta_description'])) {
            $description = esc_attr($meta_settings['meta_description']);
            echo "<meta name=\"description\" content=\"{$description}\">\n";
        }
        
        // Meta keywords
        if (!empty($meta_settings['meta_keywords'])) {
            $keywords = esc_attr($meta_settings['meta_keywords']);
            echo "<meta name=\"keywords\" content=\"{$keywords}\">\n";
        }
    }
    
    /**
     * Output robots meta tags (index/noindex, follow/nofollow)
     */
    private function output_robots_meta($meta_settings) {
        $robots_parts = [];
        
        $robots_index = $meta_settings['robots_index'] ?? 'index';
        $robots_parts[] = $robots_index;
        
        $robots_follow = $meta_settings['robots_follow'] ?? 'follow';
        $robots_parts[] = $robots_follow;
        
        $robots_content = implode(', ', $robots_parts);
        echo "<meta name=\"robots\" content=\"{$robots_content}\">\n";
    }
    
    /**
     * Output canonical URL
     */
    private function output_canonical_url($meta_settings) {
        $canonical_url = '';
        
        if (!empty($meta_settings['canonical_url'])) {
            $canonical_url = $meta_settings['canonical_url'];
        } else {
            $canonical_url = get_permalink();
        }
        
        if ($canonical_url) {
            $canonical_url = esc_url($canonical_url);
            echo "<link rel=\"canonical\" href=\"{$canonical_url}\">\n";
        }
    }
    
    /**
     * Output hreflang tags
     */
    private function output_hreflang($meta_settings) {
        if (!empty($meta_settings['hreflang'])) {
            $hreflang = esc_attr($meta_settings['hreflang']);
            $current_url = esc_url(get_permalink());
            echo "<link rel=\"alternate\" hreflang=\"{$hreflang}\" href=\"{$current_url}\">\n";
        }
    }
    
    /**
     * Output date-related meta tags
     */
    private function output_date_meta($meta_settings) {
        if (!empty($meta_settings['date_published'])) {
            $published_date = esc_attr($meta_settings['date_published']);
            echo "<meta property=\"article:published_time\" content=\"{$published_date}\">\n";
        }
        
        if (!empty($meta_settings['date_modified'])) {
            $modified_date = esc_attr($meta_settings['date_modified']);
            echo "<meta property=\"article:modified_time\" content=\"{$modified_date}\">\n";
        }
    }
    
    /**
     * Filter the page title
     */
    public function filter_page_title($title) {
        $meta_settings = $this->get_current_page_meta();
        
        if (!empty($meta_settings['meta_title'])) {
            return $meta_settings['meta_title'];
        }
        
        return $title;
    }
}