<?php
/**
 * Meta Output Handler for SEO Plugin - FIXED INHERITANCE
 * 
 * This class handles outputting meta tags AND schema markup to the website's <head> section.
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
        // Hook into wp_head to add our meta tags
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
        
        // Get current page settings
        $meta_settings = $this->get_current_page_meta();
        
        // Output each type of meta tag
        $this->output_basic_meta_tags($meta_settings);
        $this->output_robots_meta($meta_settings);
        $this->output_canonical_url($meta_settings);
        $this->output_hreflang($meta_settings);
        $this->output_date_meta($meta_settings);
        $this->output_social_media_meta($meta_settings);
        
        // Schema Markup
        $this->output_schema_markup($meta_settings);
        
        echo "<!-- /SEO Plugin Meta Tags -->\n";
    }
    
    /**
     * Get the current page ID for meta lookup - DEBUG VERSION
     */
    private function get_current_page_id() {
        global $post;
        
        if (is_front_page()) {
            echo "<!-- DEBUG: Detected as front page, returning 'home' -->\n";
            return 'home';
        } elseif (is_home()) {
            echo "<!-- DEBUG: Detected as blog home, returning 'home' -->\n";
            return 'home';
        } elseif (is_page() || is_single()) {
            if ($post) {
                echo "<!-- DEBUG: Detected as page/post, returning post ID: {$post->ID} -->\n";
                return (string) $post->ID;
            } else {
                echo "<!-- DEBUG: is_page/is_single but no post object, returning 'global' -->\n";
                return 'global';
            }
        } else {
            echo "<!-- DEBUG: No specific page detected, returning 'global' -->\n";
            return 'global';
        }
    }
    
    /**
     * Get meta settings for the current page - FIXED INHERITANCE
     */
    public function get_current_page_meta() {
        // Get the current page identifier
        $page_id = $this->get_current_page_id();
        
        // Get page-specific settings
        $page_settings = get_option("seo_plugin_page_{$page_id}", []);
        
        // Get global settings as fallback
        $global_settings = get_option('seo_plugin_page_global', []);
        
        // Smart merge: global first, then page-specific overrides
        $merged_settings = array_merge($global_settings, $page_settings);
        
        // FIXED: Handle service catalog inheritance properly
        $merged_settings['offerCatalog'] = $this->merge_service_catalog(
            $global_settings['offerCatalog'] ?? [],
            $page_settings['offerCatalog'] ?? [],
            $page_id === 'global'
        );
        
        return $merged_settings;
    }
    
    /**
     * Smart service catalog merging with inheritance handling
     */
    private function merge_service_catalog($global_services, $page_services, $is_global_page) {
        // If we're on the global page, just return global services
        if ($is_global_page) {
            return $global_services;
        }
        
        // For non-global pages, we need to:
        // 1. Add inherited global services (marked as inherited)
        // 2. Add page-specific services (not inherited)
        // 3. Filter out any inherited services that were "deleted" on this page
        
        $final_services = [];
        
        // Step 1: Add global services as inherited (unless explicitly removed)
        if (is_array($global_services)) {
            foreach ($global_services as $index => $global_service) {
                // Check if this global service was explicitly removed on this page
                $was_removed = $this->was_global_service_removed($page_services, $global_service, $index);
                
                if (!$was_removed) {
                    $inherited_service = $global_service;
                    $inherited_service['isInherited'] = true;
                    $inherited_service['globalIndex'] = $index; // Track which global service this is
                    $final_services[] = $inherited_service;
                }
            }
        }
        
        // Step 2: Add page-specific services (non-inherited only)
        if (is_array($page_services)) {
            foreach ($page_services as $page_service) {
                // Only add if it's not marked as inherited (i.e., it's a genuine page-specific service)
                if (!isset($page_service['isInherited']) || $page_service['isInherited'] === false) {
                    $final_services[] = $page_service;
                }
            }
        }
        
        return $final_services;
    }
    
    /**
     * Check if a global service was explicitly removed on this page
     * This prevents deleted inherited services from reappearing
     */
    private function was_global_service_removed($page_services, $global_service, $global_index) {
        if (!is_array($page_services)) {
            return false;
        }
        
        // Look for a "removal marker" in page services
        // This could be stored as a special array of removed global service indices
        // For now, we'll use a simple approach: if page has any inherited services,
        // we assume the user has actively managed the inheritance
        
        foreach ($page_services as $page_service) {
            if (isset($page_service['isInherited']) && 
                isset($page_service['globalIndex']) && 
                $page_service['globalIndex'] === $global_index &&
                isset($page_service['_removed']) && 
                $page_service['_removed'] === true) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Output Schema Markup JSON-LD - USES FIXED INHERITANCE
     */
    public function output_schema_markup($meta_settings) {
        echo "<!-- SEO Plugin: Schema Debug Start -->\n";
        
        // Get current page ID
        $page_id = $this->get_current_page_id();
        echo "<!-- DEBUG: Current page ID: '{$page_id}' -->\n";
        
        // Determine schema type (page-specific first, then global)
        $page_settings = get_option("seo_plugin_page_{$page_id}", []);
        $global_settings = get_option('seo_plugin_page_global', []);
        
        $schema_type = '';
        if (!empty($page_settings['schemaType'])) {
            $schema_type = $page_settings['schemaType'];
            echo "<!-- DEBUG: Using page-specific schema type: '{$schema_type}' -->\n";
        } elseif (!empty($global_settings['schemaType'])) {
            $schema_type = $global_settings['schemaType'];
            echo "<!-- DEBUG: Using global schema type: '{$schema_type}' -->\n";
        }
        
        if (empty($schema_type)) {
            echo "<!-- No schema type configured -->\n";
            echo "<!-- SEO Plugin: Schema Debug End -->\n";
            return;
        }
        
        // Use the merged settings which already have proper service inheritance
        echo "<!-- DEBUG: Using merged settings with smart service inheritance -->\n";
        echo "<!-- DEBUG: Final service count: " . (isset($meta_settings['offerCatalog']) ? count($meta_settings['offerCatalog']) : 0) . " -->\n";
        
        // Generate the schema JSON
        $schema = $this->generate_schema_json($meta_settings, $schema_type);
        
        if (empty($schema) || !is_array($schema)) {
            echo "<!-- DEBUG: Schema generation failed -->\n";
            echo "<!-- SEO Plugin: Schema Debug End -->\n";
            return;
        }
        
        echo "<!-- DEBUG: Schema generated successfully with " . count($schema) . " properties -->\n";
        
        // Output the schema JSON-LD
        echo "<script type=\"application/ld+json\">\n";
        echo wp_json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        echo "\n</script>\n";
        
        echo "<!-- SEO Plugin: Schema Debug End -->\n";
    }
    
    /**
     * Generate Schema JSON from user settings
     */
    private function generate_schema_json($meta_settings, $schema_type) {
        // Start with basic schema structure
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => $schema_type
        ];
        
        // Add basic fields that most schema types have
        if (!empty($meta_settings['name'])) {
            $schema['name'] = $meta_settings['name'];
        }
        
        if (!empty($meta_settings['description'])) {
            $schema['description'] = $meta_settings['description'];
        }
        
        if (!empty($meta_settings['url'])) {
            $schema['url'] = $meta_settings['url'];
        }
        
        if (!empty($meta_settings['image'])) {
            $schema['image'] = $meta_settings['image'];
        }
        
        // Handle specific schema types
        switch ($schema_type) {
            case 'Organization':
            case 'LocalBusiness':
            case 'Restaurant':
            case 'Store':
                $this->add_business_schema_fields($schema, $meta_settings);
                break;
                
            case 'Article':
            case 'NewsArticle':
                $this->add_article_schema_fields($schema, $meta_settings);
                break;
                
            case 'Product':
                $this->add_product_schema_fields($schema, $meta_settings);
                break;
                
            case 'Person':
                $this->add_person_schema_fields($schema, $meta_settings);
                break;
                
            case 'Event':
                $this->add_event_schema_fields($schema, $meta_settings);
                break;
        }
        
        // Handle service catalog (offerCatalog) - now with proper inheritance
        if (!empty($meta_settings['offerCatalog']) && is_array($meta_settings['offerCatalog'])) {
            $this->add_service_catalog($schema, $meta_settings['offerCatalog']);
        }
        
        return $schema;
    }
    
    /**
     * Add service catalog to schema - CLEANED UP VERSION
     */
    private function add_service_catalog(&$schema, $services) {
        if (empty($services) || !is_array($services)) {
            return;
        }
        
        $catalog_items = [];
        
        foreach ($services as $index => $service) {
            if (empty($service['name'])) continue;
            
            // Skip services marked for removal
            if (isset($service['_removed']) && $service['_removed'] === true) {
                continue;
            }
            
            $offer = [
                '@type' => 'Offer',
                '@id' => '#service-' . ($index + 1),
                'itemOffered' => [
                    '@type' => 'Service',
                    'name' => $service['name']
                ]
            ];
            
            if (!empty($service['description'])) {
                $offer['itemOffered']['description'] = $service['description'];
            }
            
            if (!empty($service['serviceType'])) {
                $offer['itemOffered']['serviceType'] = $service['serviceType'];
            }
            
            if (!empty($service['areaServed'])) {
                $offer['itemOffered']['areaServed'] = $service['areaServed'];
            }
            
            $catalog_items[] = $offer;
        }
        
        if (!empty($catalog_items)) {
            $schema['hasOfferCatalog'] = [
                '@type' => 'OfferCatalog',
                'name' => 'Our Services',
                'itemListElement' => $catalog_items
            ];
        }
    }
    
    /**
     * Add business-specific schema fields
     */
    private function add_business_schema_fields(&$schema, $meta_settings) {
        // Contact information
        if (!empty($meta_settings['email'])) {
            $schema['email'] = $meta_settings['email'];
        }
        
        if (!empty($meta_settings['telephone'])) {
            $schema['telephone'] = $meta_settings['telephone'];
        }
        
        // Address
        if (!empty($meta_settings['address']) && is_array($meta_settings['address'])) {
            $address = $meta_settings['address'];
            $schema['address'] = [
                '@type' => 'PostalAddress'
            ];
            
            if (!empty($address['streetAddress'])) $schema['address']['streetAddress'] = $address['streetAddress'];
            if (!empty($address['addressLocality'])) $schema['address']['addressLocality'] = $address['addressLocality'];
            if (!empty($address['addressRegion'])) $schema['address']['addressRegion'] = $address['addressRegion'];
            if (!empty($address['postalCode'])) $schema['address']['postalCode'] = $address['postalCode'];
            if (!empty($address['addressCountry'])) $schema['address']['addressCountry'] = $address['addressCountry'];
        }
        
        // Social media profiles (sameAs)
        if (!empty($meta_settings['sameAs']) && is_array($meta_settings['sameAs'])) {
            $schema['sameAs'] = array_filter($meta_settings['sameAs']);
        }
        
        // Opening hours
        if (!empty($meta_settings['openingHours']) && is_array($meta_settings['openingHours'])) {
            $opening_hours = [];
            $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            $day_abbrev = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
            
            foreach ($days as $index => $day) {
                if (!empty($meta_settings['openingHours'][$day]) && 
                    strtolower($meta_settings['openingHours'][$day]) !== 'closed') {
                    $opening_hours[] = $day_abbrev[$index] . ' ' . $meta_settings['openingHours'][$day];
                }
            }
            
            if (!empty($opening_hours)) {
                $schema['openingHours'] = $opening_hours;
            }
        }
        
        // Price range
        if (!empty($meta_settings['priceRange'])) {
            $schema['priceRange'] = $meta_settings['priceRange'];
        }
    }
    
    /**
     * Add article-specific schema fields
     */
    private function add_article_schema_fields(&$schema, $meta_settings) {
        global $post;
        
        // Use headline instead of name for articles
        if (!empty($meta_settings['headline'])) {
            $schema['headline'] = $meta_settings['headline'];
            unset($schema['name']); // Articles use headline, not name
        } elseif ($post) {
            $schema['headline'] = get_the_title($post);
            unset($schema['name']);
        }
        
        // Author
        if (!empty($meta_settings['author']) && is_array($meta_settings['author'])) {
            $schema['author'] = [
                '@type' => 'Person',
                'name' => $meta_settings['author']['name'] ?? ''
            ];
            
            if (!empty($meta_settings['author']['url'])) {
                $schema['author']['url'] = $meta_settings['author']['url'];
            }
        } elseif ($post) {
            $author_id = $post->post_author;
            $schema['author'] = [
                '@type' => 'Person',
                'name' => get_the_author_meta('display_name', $author_id)
            ];
        }
        
        // Publisher
        if (!empty($meta_settings['publisher']) && is_array($meta_settings['publisher'])) {
            $schema['publisher'] = [
                '@type' => 'Organization',
                'name' => $meta_settings['publisher']['name'] ?? get_bloginfo('name')
            ];
            
            if (!empty($meta_settings['publisher']['logo'])) {
                $schema['publisher']['logo'] = $meta_settings['publisher']['logo'];
            }
        } else {
            $schema['publisher'] = [
                '@type' => 'Organization',
                'name' => get_bloginfo('name')
            ];
        }
        
        // Dates
        if (!empty($meta_settings['datePublished'])) {
            $schema['datePublished'] = $meta_settings['datePublished'];
        } elseif ($post) {
            $schema['datePublished'] = get_the_date('c', $post);
        }
        
        if (!empty($meta_settings['dateModified'])) {
            $schema['dateModified'] = $meta_settings['dateModified'];
        } elseif ($post) {
            $schema['dateModified'] = get_the_modified_date('c', $post);
        }
    }
    
    /**
     * Add product-specific schema fields
     */
    private function add_product_schema_fields(&$schema, $meta_settings) {
        // Brand
        if (!empty($meta_settings['brand'])) {
            $schema['brand'] = $meta_settings['brand'];
        }
        
        // SKU
        if (!empty($meta_settings['sku'])) {
            $schema['sku'] = $meta_settings['sku'];
        }
        
        // Offers
        if (!empty($meta_settings['offers']) && is_array($meta_settings['offers'])) {
            $offers = $meta_settings['offers'];
            $schema['offers'] = [
                '@type' => 'Offer'
            ];
            
            if (!empty($offers['price'])) {
                $schema['offers']['price'] = $offers['price'];
            }
            
            if (!empty($offers['priceCurrency'])) {
                $schema['offers']['priceCurrency'] = $offers['priceCurrency'];
            }
            
            if (!empty($offers['availability'])) {
                $schema['offers']['availability'] = 'https://schema.org/' . $offers['availability'];
            }
        }
    }
    
    /**
     * Add person-specific schema fields
     */
    private function add_person_schema_fields(&$schema, $meta_settings) {
        // Job title
        if (!empty($meta_settings['jobTitle'])) {
            $schema['jobTitle'] = $meta_settings['jobTitle'];
        }
        
        // Works for
        if (!empty($meta_settings['worksFor'])) {
            $schema['worksFor'] = [
                '@type' => 'Organization',
                'name' => $meta_settings['worksFor']
            ];
        }
        
        // Social profiles
        if (!empty($meta_settings['sameAs']) && is_array($meta_settings['sameAs'])) {
            $schema['sameAs'] = array_filter($meta_settings['sameAs']);
        }
    }
    
    /**
     * Add event-specific schema fields
     */
    private function add_event_schema_fields(&$schema, $meta_settings) {
        // Start and end dates
        if (!empty($meta_settings['startDate'])) {
            $schema['startDate'] = $meta_settings['startDate'];
        }
        
        if (!empty($meta_settings['endDate'])) {
            $schema['endDate'] = $meta_settings['endDate'];
        }
        
        // Location
        if (!empty($meta_settings['location']) && is_array($meta_settings['location'])) {
            $location = $meta_settings['location'];
            $schema['location'] = [
                '@type' => 'Place'
            ];
            
            if (!empty($location['name'])) {
                $schema['location']['name'] = $location['name'];
            }
            
            if (!empty($location['address'])) {
                $schema['location']['address'] = $location['address'];
            }
        }
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
     * Output Social Media Meta Tags (Open Graph, Twitter Cards)
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
        
        $og_type = $meta_settings['og_type'] ?? 'website';
        echo '<meta property="og:type" content="' . esc_attr($og_type) . '">' . "\n";
        
        $og_url = $this->get_current_page_url();
        echo '<meta property="og:url" content="' . esc_url($og_url) . '">' . "\n";
        
        // Twitter Card tags
        $twitter_card = $meta_settings['twitter_card_type'] ?? 'summary_large_image';
        echo '<meta name="twitter:card" content="' . esc_attr($twitter_card) . '">' . "\n";
        
        $twitter_site = $meta_settings['twitter_site'] ?? '';
        if ($twitter_site) {
            echo '<meta name="twitter:site" content="' . esc_attr($twitter_site) . '">' . "\n";
        }
    }
    
    /**
     * Get current page URL for schema markup
     */
    private function get_current_page_url() {
        global $wp;
        return home_url(add_query_arg([], $wp->request));
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