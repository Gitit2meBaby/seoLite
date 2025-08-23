// assets/js/components/tabs/schemaTypes.js

// Common field definitions with tooltips instead of descriptions
export const fieldDefinitions = {
  // Basic Information
  name: {
    label: "Name/Title",
    type: "text",
    placeholder: "product name", // Updated placeholder for products
    maxLength: 110,
    hasTooltip: true,
    tooltipText:
      "The name or title of this item (max 110 characters for best SEO)",
  },
  headline: {
    label: "Headline",
    type: "text",
    placeholder: "compelling article headline",
    maxLength: 110,
    hasTooltip: true,
    tooltipText: "Main headline for articles (max 110 characters)",
  },
  description: {
    label: "Description",
    type: "textarea",
    placeholder: "A detailed description of the item",
    maxLength: 300,
    hasTooltip: true,
    tooltipText: "Detailed description of the entity (max 300 characters)",
  },
  url: {
    label: "URL",
    type: "url",
    placeholder: "https://example.com",
    hasTooltip: true,
    tooltipText: "Official website URL for this item",
  },
  image: {
    label: "Image URL",
    type: "url",
    placeholder: "https://example.com/image.jpg",
    hasTooltip: true,
    tooltipText: "High-quality image (1200x630px recommended)",
  },
  logo: {
    label: "Logo URL",
    type: "url",
    placeholder: "https://example.com/logo.jpg",
    hasTooltip: true,
    tooltipText: "Company/organization logo (square format preferred)",
  },

  // Contact Information
  email: {
    label: "Email",
    type: "email",
    placeholder: "contact@example.com",
    hasTooltip: true,
    tooltipText: "Primary contact email address",
  },
  telephone: {
    label: "Phone Number",
    type: "tel",
    placeholder: "+1-555-123-4567",
    hasTooltip: true,
    tooltipText: "Contact phone number with country code",
  },

  // Product-Specific Fields with Multiple Support
  products: {
    label: "Products",
    type: "productArray", // New type for multiple products
    hasTooltip: true,
    tooltipText:
      "Add multiple products offered by your business - you can add as many as needed",
  },

  // Individual Product Fields (used in product array)
  productName: {
    label: "Product Name",
    type: "text",
    placeholder: "product name",
    hasTooltip: true,
    tooltipText: "Name of the specific product",
  },
  productDescription: {
    label: "Product Description",
    type: "textarea",
    placeholder: "describe your product",
    hasTooltip: true,
    tooltipText: "Brief description of what this product does or offers",
  },
  productImage: {
    label: "Product Image",
    type: "url",
    placeholder: "https://example.com/product.jpg",
    hasTooltip: true,
    tooltipText: "High-quality product image (1200x630px recommended)",
  },
  productPrice: {
    label: "Price",
    type: "number",
    placeholder: "29.99",
    hasTooltip: true,
    tooltipText: "Current price of the product",
  },
  productCurrency: {
    label: "Currency",
    type: "text",
    placeholder: "USD",
    hasTooltip: true,
    tooltipText: "Currency code (USD, EUR, GBP, etc.)",
  },
  productAvailability: {
    label: "Availability",
    type: "select",
    options: [
      { value: "InStock", label: "In Stock" },
      { value: "OutOfStock", label: "Out of Stock" },
      { value: "PreOrder", label: "Pre-Order" },
      { value: "Discontinued", label: "Discontinued" },
    ],
    hasTooltip: true,
    tooltipText: "Current availability status of the product",
  },
  productBrand: {
    label: "Brand",
    type: "text",
    placeholder: "Apple, Nike, Sony",
    hasTooltip: true,
    tooltipText: "Brand or manufacturer of the product",
  },
  productSKU: {
    label: "SKU",
    type: "text",
    placeholder: "ABC123XYZ",
    hasTooltip: true,
    tooltipText: "Stock Keeping Unit - your internal product identifier",
  },

  // Address Information
  address: {
    label: "Address",
    type: "object",
    subfields: {
      streetAddress: {
        label: "Street Address",
        type: "text",
        placeholder: "123 Main St",
      },
      addressLocality: { label: "City", type: "text", placeholder: "New York" },
      addressRegion: {
        label: "State/Province",
        type: "text",
        placeholder: "NY",
      },
      postalCode: { label: "Postal Code", type: "text", placeholder: "10001" },
      addressCountry: { label: "Country", type: "text", placeholder: "US" },
    },
    hasTooltip: true,
    tooltipText: "Physical address information for your business",
  },

  // Social Media & External Links
  sameAs: {
    label: "Official Profiles & Citations",
    type: "array",
    placeholder: "https://facebook.com/yourbusiness",
    hasTooltip: true,
    tooltipText:
      "Official social media profiles, Wikipedia pages, and other authoritative external sources about this entity (one per line)",
    arrayType: "url",
  },

  // Service Catalog Fields
  hasOfferCatalog: {
    label: "Has Product/Service Catalog",
    type: "select",
    options: [
      { value: "", label: "Not specified" },
      { value: "true", label: "Yes - Show product/service options" },
      { value: "false", label: "No" },
    ],
    hasTooltip: true,
    tooltipText:
      "Whether your business offers a catalog of products or services",
  },

  offerCatalog: {
    label: "Services Offered",
    type: "serviceArray",
    hasTooltip: true,
    tooltipText: "List of specific services offered by this business",
    dependsOn: { field: "hasOfferCatalog", values: ["true"] },
  },

  // Date fields
  datePublished: {
    label: "Published Date",
    type: "date",
    hasTooltip: true,
    tooltipText: "When this content was first published",
  },
  dateModified: {
    label: "Modified Date",
    type: "date",
    hasTooltip: true,
    tooltipText: "When this content was last updated",
  },

  // Author/Publisher
  author: {
    label: "Author",
    type: "object",
    subfields: {
      name: { label: "Author Name", type: "text", placeholder: "John Doe" },
      url: {
        label: "Author URL",
        type: "url",
        placeholder: "https://example.com/author",
      },
      image: {
        label: "Author Photo",
        type: "url",
        placeholder: "https://example.com/author.jpg",
      },
    },
    hasTooltip: true,
    tooltipText: "Information about the content author",
  },

  publisher: {
    label: "Publisher",
    type: "object",
    subfields: {
      name: {
        label: "Publisher Name",
        type: "text",
        placeholder: "Your Site Name",
      },
      logo: {
        label: "Publisher Logo",
        type: "url",
        placeholder: "https://example.com/logo.jpg",
      },
      url: {
        label: "Publisher URL",
        type: "url",
        placeholder: "https://example.com",
      },
    },
    hasTooltip: true,
    tooltipText: "Information about the content publisher",
  },

  // Additional fields...
  openingHours: {
    label: "Opening Hours",
    type: "textarea",
    placeholder: "Mo-Fr 09:00-17:00, Sa 09:00-12:00",
    hasTooltip: true,
    tooltipText: "Business hours in structured format (Mo-Fr 09:00-17:00)",
  },

  priceRange: {
    label: "Price Range",
    type: "text",
    placeholder: "$$ or $10-$50",
    hasTooltip: true,
    tooltipText: "General price range using $ symbols or actual range",
  },
};

// Schema type configurations
export const schemaTypes = {
  "": { label: "Select Schema Type", fields: [] },

  Organization: {
    label: "Organization/Business",
    fields: [
      "name",
      "url",
      "logo",
      "description",
      "email",
      "telephone",
      "address",
      "sameAs",
      "openingHours",
      "hasOfferCatalog",
      "offerCatalog",
      "products", // Multiple products support
      "priceRange",
    ],
  },

  LocalBusiness: {
    label: "Local Business",
    extends: "Organization",
    fields: [
      "name",
      "url",
      "logo",
      "description",
      "email",
      "telephone",
      "address",
      "sameAs",
      "openingHours",
      "hasOfferCatalog",
      "offerCatalog",
      "products", // Multiple products support
      "priceRange",
    ],
  },

  Store: {
    label: "Retail Store",
    extends: "LocalBusiness",
    fields: [
      "name",
      "url",
      "logo",
      "description",
      "email",
      "telephone",
      "address",
      "sameAs",
      "openingHours",
      "products", // Multiple products - main feature for stores
      "priceRange",
    ],
  },

  Product: {
    label: "Single Product Page",
    fields: [
      "name", // Will use product name placeholder
      "description",
      "image",
      "productBrand",
      "productSKU",
      "productPrice",
      "productCurrency",
      "productAvailability",
    ],
  },

  Article: {
    label: "Article/Blog Post",
    fields: [
      "headline",
      "description",
      "author",
      "publisher",
      "datePublished",
      "dateModified",
      "image",
    ],
  },

  Person: {
    label: "Person/Author",
    fields: ["name", "url", "image", "description", "email", "sameAs"],
  },

  Event: {
    label: "Event",
    fields: [
      "name",
      "description",
      "datePublished", // Using as start date
      "dateModified", // Using as end date
      "address",
      "image",
    ],
  },
};
