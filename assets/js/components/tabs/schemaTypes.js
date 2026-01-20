// Schema type configurations with proper field assignments
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
      "sameAs", // âœ… Correct - Organizations have authoritative profiles
      "foundingDate",
      "numberOfEmployees",
      "areaServed",
      "openingHours",
      "hasOfferCatalog", // This will trigger service catalog UI
      "offerCatalog", // New field for actual services
      "paymentAccepted",
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
      "sameAs", // âœ… Correct - Local businesses have profiles
      "openingHours",
      "hasOfferCatalog",
      "offerCatalog", // Services offered
      "paymentAccepted",
      "priceRange",
      "servesCuisine", // Only for restaurants
      "acceptsReservations",
      "menuUrl",
    ],
  },

  Restaurant: {
    label: "Restaurant",
    extends: "LocalBusiness",
    fields: [
      "name",
      "url",
      "logo",
      "description",
      "email",
      "telephone",
      "address",
      "sameAs", // âœ… Restaurant social profiles
      "openingHours",
      "servesCuisine",
      "acceptsReservations",
      "menuUrl",
      "paymentAccepted",
      "priceRange",
      "hasOfferCatalog",
      "offerCatalog", // Menu items/services
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
      "sameAs", // âœ… Store social profiles
      "openingHours",
      "hasOfferCatalog",
      "offerCatalog", // Products/services sold
      "paymentAccepted",
      "priceRange",
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
      "articleSection",
      "wordCount",
      "articleBody",
      // âŒ Removed sameAs - articles don't have social profiles
    ],
  },

  NewsArticle: {
    label: "News Article",
    extends: "Article",
    fields: [
      "headline",
      "description",
      "author",
      "publisher",
      "datePublished",
      "dateModified",
      "image",
      "articleSection",
      "wordCount",
      "dateline",
      // âŒ Removed sameAs - news articles don't have profiles
    ],
  },

  Product: {
    label: "Product",
    fields: [
      "name",
      "description",
      "image",
      "brand",
      "manufacturer",
      "model",
      "sku",
      "gtin",
      "offers",
      "aggregateRating",
      "review",
      // âŒ No sameAs for products
    ],
  },

  Service: {
    label: "Service",
    fields: [
      "name",
      "description",
      "provider", // This links to Organization
      "serviceType",
      "areaServed",
      "hasOfferCatalog",
      "offerCatalog", // Sub-services
      "offers",
      "aggregateRating",
      "review",
      // âŒ No sameAs for individual services
    ],
  },

  Person: {
    label: "Person/Author",
    fields: [
      "name",
      "url",
      "image",
      "description",
      "email",
      "jobTitle",
      "worksFor",
      "sameAs", // âœ… Correct - People have social profiles
      "birthDate",
      "nationality",
      "alumniOf",
    ],
  },

  Event: {
    label: "Event",
    fields: [
      "name",
      "description",
      "startDate",
      "endDate",
      "location",
      "organizer", // Links to Organization/Person
      "performer",
      "offers",
      "eventStatus",
      "eventAttendanceMode",
      "image",
      // âŒ Events typically don't have sameAs
    ],
  },

  Recipe: {
    label: "Recipe",
    fields: [
      "name",
      "description",
      "image",
      "author", // Links to Person
      "datePublished",
      "prepTime",
      "cookTime",
      "totalTime",
      "recipeYield",
      "recipeCategory",
      "recipeCuisine",
      "recipeIngredient",
      "recipeInstructions",
      "nutrition",
      "aggregateRating",
      // âŒ Individual recipes don't have sameAs
    ],
  },

  Book: {
    label: "Book",
    fields: [
      "name",
      "description",
      "author", // Links to Person
      "publisher", // Links to Organization
      "datePublished",
      "isbn",
      "numberOfPages",
      "bookFormat",
      "genre",
      "image",
      "aggregateRating",
      // âŒ Books don't have sameAs
    ],
  },

  Course: {
    label: "Course/Educational",
    fields: [
      "name",
      "description",
      "provider", // Links to Organization
      "courseCode",
      "educationalLevel",
      "timeRequired",
      "coursePrerequisites",
      "competencyRequired",
      "offers",
      // âŒ Courses don't have sameAs
    ],
  },

  WebSite: {
    label: "Website",
    fields: [
      "name",
      "url",
      "description",
      "publisher", // Links to Organization
      "potentialAction", // Search functionality
      // âŒ Removed sameAs - use publisher.sameAs instead
    ],
  },

  WebPage: {
    label: "Web Page",
    fields: [
      "name",
      "description",
      "url",
      "isPartOf", // Links to WebSite
      "primaryImageOfPage",
      "datePublished",
      "dateModified",
      "author", // Links to Person
      // âŒ Individual pages don't have sameAs
    ],
  },
};

// Service catalog options by business type
// Enhanced serviceOptions for your schemaTypes.js file
export const serviceOptions = {
  // General business services - enhanced
  general: [
    "Professional Consulting",
    "Project Management",
    "Strategic Planning",
    "Training & Development",
    "Technical Support",
    "Installation Service",
    "Maintenance Service",
    "Repair Service",
    "Customer Support",
    "Emergency Service",
    "Custom Solutions",
    "Advisory Services",
  ],

  // Restaurant services - enhanced
  restaurant: [
    "Dine-in Service",
    "Takeout Service",
    "Delivery Service",
    "Catering Service",
    "Private Event Hosting",
    "Buffet Service",
    "Drive-through Service",
    "Outdoor Dining",
    "Live Entertainment",
    "Wine Tasting",
    "Event Planning",
    "Custom Menu Creation",
  ],

  // Retail store services - enhanced
  store: [
    "In-store Shopping",
    "Online Shopping",
    "Curbside Pickup",
    "Home Delivery",
    "Personal Shopping Assistant",
    "Gift Wrapping Service",
    "Product Assembly",
    "Returns & Exchanges",
    "Loyalty Program",
    "Product Consultation",
    "Custom Orders",
    "Product Demonstrations",
  ],

  // Professional services - enhanced
  professional: [
    "Legal Consultation",
    "Tax Preparation",
    "Financial Planning",
    "Medical Consultation",
    "Therapy Sessions",
    "Design Services",
    "Web Development",
    "Marketing Services",
    "Accounting Services",
    "Business Consulting",
    "IT Support",
    "Content Creation",
  ],

  // Home services - enhanced
  home: [
    "Plumbing Services",
    "Electrical Services",
    "HVAC Services",
    "Cleaning Services",
    "Landscaping Services",
    "Painting Services",
    "Roofing Services",
    "Pest Control",
    "Home Inspection",
    "Security Installation",
    "Appliance Repair",
    "Handyman Services",
  ],

  // Healthcare services
  healthcare: [
    "General Practice",
    "Specialist Consultation",
    "Diagnostic Services",
    "Preventive Care",
    "Emergency Care",
    "Mental Health Services",
    "Physical Therapy",
    "Laboratory Services",
    "Imaging Services",
    "Telemedicine",
    "Health Screenings",
    "Wellness Programs",
  ],

  // Education services
  education: [
    "Tutoring Services",
    "Online Courses",
    "Workshop Training",
    "Certification Programs",
    "Skills Development",
    "Language Learning",
    "Test Preparation",
    "Career Counseling",
    "Academic Coaching",
    "Professional Development",
    "Corporate Training",
    "Educational Consulting",
  ],

  // Technology services
  technology: [
    "Software Development",
    "Web Design & Development",
    "Mobile App Development",
    "Database Management",
    "Cloud Solutions",
    "Cybersecurity Services",
    "IT Consulting",
    "System Integration",
    "Technical Support",
    "Network Administration",
    "Data Analytics",
    "Digital Marketing",
  ],
};

// Field definitions with dependencies and conditional logic
export const fieldDefinitions = {
  // Basic Information
  name: {
    label: "Name/Title",
    type: "text",
    placeholder: "Business Name / Article Title / Product Name",
    description: "The main name or title",
    required: true,
  },
  headline: {
    label: "Headline",
    type: "text",
    placeholder: "Compelling article headline",
    description: "Main headline for articles (max 110 characters)",
    maxLength: 110,
  },
  description: {
    label: "Description",
    type: "textarea",
    placeholder: "A detailed description of the item",
    description: "Detailed description of the entity",
    maxLength: 300,
  },
  url: {
    label: "URL",
    type: "url",
    placeholder: "https://example.com",
    description: "Official website URL",
  },
  image: {
    label: "Image URL",
    type: "url",
    placeholder: "https://example.com/image.jpg",
    description: "High-quality image (1200x630px recommended)",
    hasMediaHelper: true,
  },
  logo: {
    label: "Logo URL",
    type: "url",
    placeholder: "https://example.com/logo.jpg",
    description: "Company/organization logo (square format preferred)",
    hasMediaHelper: true,
  },

  // Contact Information
  email: {
    label: "Email",
    type: "email",
    placeholder: "contact@example.com",
    description: "Contact email address",
  },
  telephone: {
    label: "Phone Number",
    type: "tel",
    placeholder: "+1-555-123-4567",
    description: "Contact phone number with country code",
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
    description: "Physical address information",
  },

  // Social Media & External Links - FIXED DESCRIPTION
  sameAs: {
    label: "Official Profiles & Citations",
    type: "array",
    placeholder: "https://facebook.com/yourbusiness",
    description:
      "Official social media profiles, Wikipedia pages, and other authoritative external sources about this entity (one per line)",
    arrayType: "url",
    helpText:
      "These should be authoritative profiles ABOUT this entity, not for social sharing. Use Social Media tab for sharing optimization.",
  },

  // Date Information
  datePublished: {
    label: "Date Published",
    type: "datetime-local",
    description: "When this content was first published",
  },
  dateModified: {
    label: "Date Modified",
    type: "datetime-local",
    description: "When this content was last updated",
  },
  foundingDate: {
    label: "Founding Date",
    type: "date",
    description: "When the organization was founded",
  },
  birthDate: {
    label: "Birth Date",
    type: "date",
    description: "Person's birth date",
  },

  // Business Specific
  openingHours: {
    label: "Opening Hours",
    type: "object",
    subfields: {
      monday: {
        label: "Monday",
        type: "text",
        placeholder: "09:00-17:00 or 'Closed'",
      },
      tuesday: {
        label: "Tuesday",
        type: "text",
        placeholder: "09:00-17:00 or 'Closed'",
      },
      wednesday: {
        label: "Wednesday",
        type: "text",
        placeholder: "09:00-17:00 or 'Closed'",
      },
      thursday: {
        label: "Thursday",
        type: "text",
        placeholder: "09:00-17:00 or 'Closed'",
      },
      friday: {
        label: "Friday",
        type: "text",
        placeholder: "09:00-17:00 or 'Closed'",
      },
      saturday: {
        label: "Saturday",
        type: "text",
        placeholder: "10:00-16:00 or 'Closed'",
      },
      sunday: { label: "Sunday", type: "text", placeholder: "Closed" },
    },
    description: "Business operating hours (use 24-hour format: 09:00-17:00)",
  },
  priceRange: {
    label: "Price Range",
    type: "select",
    options: [
      { value: "", label: "Not specified" },
      { value: "$", label: "$ - Inexpensive" },
      { value: "$$", label: "$$ - Moderate" },
      { value: "$$$", label: "$$$ - Expensive" },
      { value: "$$$$", label: "$$$$ - Very Expensive" },
    ],
    description: "Relative price range for products/services",
  },
  paymentAccepted: {
    label: "Payment Methods",
    type: "array",
    options: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "PayPal",
      "Apple Pay",
      "Google Pay",
      "Venmo",
      "Check",
      "Bank Transfer",
      "Cryptocurrency",
      "Gift Card",
    ],
    description: "Accepted payment methods (select multiple)",
    arrayType: "select",
  },

  // SERVICE CATALOG FIELDS - CRITICAL SECTION
  hasOfferCatalog: {
    label: "Has Product/Service Catalog",
    type: "select",
    options: [
      { value: "", label: "Not specified" },
      { value: "true", label: "Yes - Show service options" },
      { value: "false", label: "No" },
    ],
    description: "Whether business offers a catalog of products/services",
  },

  offerCatalog: {
    label: "Products/Services Offered",
    type: "serviceArray",
    description:
      "List of specific products or services offered by this business",
    dependsOn: { field: "hasOfferCatalog", values: ["true"] },
  },

  // Restaurant Specific
  servesCuisine: {
    label: "Cuisine Type",
    type: "array",
    options: [
      "American",
      "Italian",
      "French",
      "Chinese",
      "Japanese",
      "Mexican",
      "Indian",
      "Thai",
      "Mediterranean",
      "Greek",
      "Spanish",
      "German",
      "Korean",
      "Vietnamese",
    ],
    description: "Types of cuisine served",
    arrayType: "select",
    dependsOn: { field: "schemaType", values: ["Restaurant", "LocalBusiness"] },
  },
  acceptsReservations: {
    label: "Accepts Reservations",
    type: "select",
    options: [
      { value: "", label: "Not specified" },
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    description: "Whether the restaurant accepts reservations",
  },
  menuUrl: {
    label: "Menu URL",
    type: "url",
    placeholder: "https://example.com/menu",
    description: "Link to online menu",
  },

  // Product/Service Specific
  brand: {
    label: "Brand",
    type: "text",
    placeholder: "Apple, Nike, Sony",
    description: "Product brand name",
  },
  manufacturer: {
    label: "Manufacturer",
    type: "text",
    placeholder: "Company that manufactured the product",
    description: "Manufacturing company",
  },
  model: {
    label: "Model",
    type: "text",
    placeholder: "iPhone 15, Air Max 90",
    description: "Product model name/number",
  },
  sku: {
    label: "SKU",
    type: "text",
    placeholder: "ABC123XYZ",
    description: "Stock Keeping Unit identifier",
  },
  gtin: {
    label: "GTIN/UPC/EAN",
    type: "text",
    placeholder: "123456789012",
    description: "Global Trade Item Number (barcode)",
  },

  // Offers (Product/Service pricing)
  offers: {
    label: "Offers/Pricing",
    type: "object",
    subfields: {
      price: { label: "Price", type: "number", placeholder: "29.99" },
      priceCurrency: { label: "Currency", type: "text", placeholder: "USD" },
      availability: {
        label: "Availability",
        type: "select",
        options: [
          { value: "InStock", label: "In Stock" },
          { value: "OutOfStock", label: "Out of Stock" },
          { value: "PreOrder", label: "Pre-Order" },
          { value: "Discontinued", label: "Discontinued" },
        ],
      },
      validFrom: { label: "Valid From", type: "date" },
      validThrough: { label: "Valid Until", type: "date" },
    },
    description: "Pricing and availability information",
  },

  // Author/Person Information
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
    description: "Content author information",
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
    description: "Content publisher information",
  },

  // Additional Organization fields
  numberOfEmployees: {
    label: "Number of Employees",
    type: "number",
    placeholder: "50",
    description: "Approximate number of employees",
  },
  areaServed: {
    label: "Area Served",
    type: "text",
    placeholder: "New York City, California, Worldwide",
    description: "Geographic area where service is available",
  },

  // Additional fields for completeness...
  jobTitle: {
    label: "Job Title",
    type: "text",
    placeholder: "Software Developer, CEO, Writer",
    description: "Person's job title or profession",
  },
  worksFor: {
    label: "Works For",
    type: "text",
    placeholder: "Company Name",
    description: "Organization the person works for",
  },
  nationality: {
    label: "Nationality",
    type: "text",
    placeholder: "American, British, Canadian",
    description: "Person's nationality",
  },
  alumniOf: {
    label: "Alumni Of",
    type: "text",
    placeholder: "Harvard University, MIT",
    description: "Educational institutions attended",
  },

  // Event fields
  startDate: {
    label: "Start Date & Time",
    type: "datetime-local",
    description: "When the event starts",
  },
  endDate: {
    label: "End Date & Time",
    type: "datetime-local",
    description: "When the event ends",
  },
  location: {
    label: "Event Location",
    type: "object",
    subfields: {
      name: {
        label: "Venue Name",
        type: "text",
        placeholder: "Madison Square Garden",
      },
      address: {
        label: "Address",
        type: "text",
        placeholder: "4 Pennsylvania Plaza, New York, NY",
      },
    },
    description: "Event venue information",
  },
  organizer: {
    label: "Event Organizer",
    type: "object",
    subfields: {
      "@type": {
        label: "Organizer Type",
        type: "select",
        options: [
          { value: "Organization", label: "Organization" },
          { value: "Person", label: "Person" },
        ],
        value: "Organization",
      },
      name: {
        label: "Organizer Name",
        type: "text",
        placeholder: "Event Company or Person Name",
      },
      url: {
        label: "Organizer Website",
        type: "url",
        placeholder: "https://eventcompany.com",
      },
    },
    description: "Who is organizing the event",
  },
  eventStatus: {
    label: "Event Status",
    type: "select",
    options: [
      { value: "EventScheduled", label: "Scheduled" },
      { value: "EventCancelled", label: "Cancelled" },
      { value: "EventPostponed", label: "Postponed" },
      { value: "EventRescheduled", label: "Rescheduled" },
    ],
    description: "Current status of the event",
  },
  eventAttendanceMode: {
    label: "Attendance Mode",
    type: "select",
    options: [
      { value: "OfflineEventAttendanceMode", label: "In-person" },
      { value: "OnlineEventAttendanceMode", label: "Online" },
      { value: "MixedEventAttendanceMode", label: "Hybrid" },
    ],
    description: "How people attend the event",
  },

  // Recipe fields
  prepTime: {
    label: "Prep Time (minutes)",
    type: "number",
    placeholder: "15",
    description: "Preparation time in minutes",
  },
  cookTime: {
    label: "Cook Time (minutes)",
    type: "number",
    placeholder: "30",
    description: "Cooking time in minutes",
  },
  totalTime: {
    label: "Total Time (minutes)",
    type: "number",
    placeholder: "45",
    description: "Total time including prep and cooking",
  },
  recipeYield: {
    label: "Recipe Yield",
    type: "text",
    placeholder: "4 servings",
    description: "How many servings this recipe makes",
  },
  recipeCategory: {
    label: "Recipe Category",
    type: "select",
    options: [
      { value: "", label: "Select category" },
      { value: "Appetizer", label: "Appetizer" },
      { value: "Main Course", label: "Main Course" },
      { value: "Dessert", label: "Dessert" },
      { value: "Breakfast", label: "Breakfast" },
      { value: "Lunch", label: "Lunch" },
      { value: "Dinner", label: "Dinner" },
      { value: "Snack", label: "Snack" },
      { value: "Beverage", label: "Beverage" },
    ],
    description: "Type of recipe",
  },
  recipeCuisine: {
    label: "Recipe Cuisine",
    type: "text",
    placeholder: "Italian, Mexican, Asian",
    description: "Cuisine style of the recipe",
  },
  recipeIngredient: {
    label: "Ingredients",
    type: "array",
    placeholder: "1 cup flour",
    description: "List of ingredients (one per line)",
    arrayType: "text",
  },
  recipeInstructions: {
    label: "Instructions",
    type: "array",
    placeholder: "Preheat oven to 350Â°F",
    description: "Cooking instructions (one step per line)",
    arrayType: "text",
  },
  nutrition: {
    label: "Nutrition Information",
    type: "object",
    subfields: {
      calories: { label: "Calories", type: "number", placeholder: "250" },
      fatContent: { label: "Fat (g)", type: "number", placeholder: "10" },
      carbohydrateContent: {
        label: "Carbs (g)",
        type: "number",
        placeholder: "30",
      },
      proteinContent: {
        label: "Protein (g)",
        type: "number",
        placeholder: "15",
      },
    },
    description: "Nutritional information per serving",
  },

  // Reviews and Ratings
  aggregateRating: {
    label: "Aggregate Rating",
    type: "object",
    subfields: {
      ratingValue: {
        label: "Rating",
        type: "number",
        placeholder: "4.5",
        min: 0,
        max: 5,
        step: 0.1,
      },
      reviewCount: {
        label: "Review Count",
        type: "number",
        placeholder: "127",
      },
      bestRating: {
        label: "Best Rating",
        type: "number",
        placeholder: "5",
        value: "5",
      },
      worstRating: {
        label: "Worst Rating",
        type: "number",
        placeholder: "1",
        value: "1",
      },
    },
    description: "Overall rating information",
  },
  review: {
    label: "Featured Review",
    type: "object",
    subfields: {
      author: {
        label: "Reviewer Name",
        type: "text",
        placeholder: "Happy Customer",
      },
      reviewRating: {
        label: "Review Rating",
        type: "number",
        placeholder: "5",
        min: 1,
        max: 5,
      },
      reviewBody: {
        label: "Review Text",
        type: "textarea",
        placeholder: "Excellent service!",
      },
    },
    description: "A featured customer review",
  },

  // Service specific fields
  serviceType: {
    label: "Service Type",
    type: "select",
    options: [
      { value: "", label: "Select service type" },
      // Professional Services
      { value: "Legal Services", label: "Legal Services" },
      { value: "Financial Services", label: "Financial Services" },
      { value: "Medical Services", label: "Medical Services" },
      { value: "Consulting", label: "Consulting" },
      { value: "Education", label: "Education" },
      { value: "Training", label: "Training" },
      // Technical Services
      { value: "Web Development", label: "Web Development" },
      { value: "Software Development", label: "Software Development" },
      { value: "IT Support", label: "IT Support" },
      { value: "Digital Marketing", label: "Digital Marketing" },
      // Home Services
      { value: "Plumbing", label: "Plumbing" },
      { value: "Electrical", label: "Electrical" },
      { value: "HVAC", label: "HVAC" },
      { value: "Cleaning", label: "Cleaning" },
      { value: "Landscaping", label: "Landscaping" },
      { value: "Painting", label: "Painting" },
      // Creative Services
      { value: "Graphic Design", label: "Graphic Design" },
      { value: "Photography", label: "Photography" },
      { value: "Video Production", label: "Video Production" },
      { value: "Writing", label: "Writing" },
      // Business Services
      { value: "Accounting", label: "Accounting" },
      { value: "Real Estate", label: "Real Estate" },
      { value: "Insurance", label: "Insurance" },
      { value: "Transportation", label: "Transportation" },
      // Personal Services
      { value: "Health & Wellness", label: "Health & Wellness" },
      { value: "Beauty & Spa", label: "Beauty & Spa" },
      { value: "Fitness", label: "Fitness" },
      { value: "Pet Care", label: "Pet Care" },
    ],
    description: "Specific type of service provided",
  },

  provider: {
    label: "Service Provider",
    type: "object",
    subfields: {
      "@type": {
        label: "Provider Type",
        type: "select",
        options: [
          { value: "Organization", label: "Organization" },
          { value: "Person", label: "Person" },
        ],
        value: "Organization",
      },
      name: {
        label: "Provider Name",
        type: "text",
        placeholder: "Your Business Name",
      },
      url: {
        label: "Provider Website",
        type: "url",
        placeholder: "https://yourbusiness.com",
      },
    },
    description: "Who provides this service",
  },

  // Book specific
  isbn: {
    label: "ISBN",
    type: "text",
    placeholder: "978-0123456789",
    description: "International Standard Book Number",
  },
  numberOfPages: {
    label: "Number of Pages",
    type: "number",
    placeholder: "250",
    description: "Total number of pages in the book",
  },
  bookFormat: {
    label: "Book Format",
    type: "select",
    options: [
      { value: "", label: "Select format" },
      { value: "Hardcover", label: "Hardcover" },
      { value: "Paperback", label: "Paperback" },
      { value: "EBook", label: "E-Book" },
      { value: "AudioBook", label: "Audio Book" },
    ],
    description: "Physical format of the book",
  },
  genre: {
    label: "Genre",
    type: "text",
    placeholder: "Fiction, Non-fiction, Mystery, Romance",
    description: "Literary genre or category",
  },

  // Course specific
  courseCode: {
    label: "Course Code",
    type: "text",
    placeholder: "CS101, ENG201",
    description: "Official course identifier",
  },
  educationalLevel: {
    label: "Educational Level",
    type: "select",
    options: [
      { value: "", label: "Select level" },
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" },
      { value: "Expert", label: "Expert" },
    ],
    description: "Target skill level for the course",
  },
  timeRequired: {
    label: "Time Required",
    type: "text",
    placeholder: "PT4H (4 hours), P1W (1 week)",
    description: "Expected time to complete (ISO 8601 duration format)",
  },
  coursePrerequisites: {
    label: "Prerequisites",
    type: "text",
    placeholder: "Basic HTML knowledge, Math 101",
    description: "Required knowledge or courses before taking this course",
  },
  competencyRequired: {
    label: "Required Competencies",
    type: "text",
    placeholder: "Problem solving, Basic programming",
    description: "Skills or competencies required for the course",
  },

  // WebSite/WebPage specific
  isPartOf: {
    label: "Part Of (Website)",
    type: "object",
    subfields: {
      "@type": {
        label: "Type",
        type: "text",
        value: "WebSite",
        readonly: true,
      },
      name: {
        label: "Website Name",
        type: "text",
        placeholder: "Your Website",
      },
      url: {
        label: "Website URL",
        type: "url",
        placeholder: "https://example.com",
      },
    },
    description: "The website this page belongs to",
  },
  primaryImageOfPage: {
    label: "Primary Image",
    type: "url",
    placeholder: "https://example.com/page-image.jpg",
    description: "Main image representing this page",
    hasMediaHelper: true,
  },
  potentialAction: {
    label: "Potential Actions",
    type: "object",
    subfields: {
      "@type": {
        label: "Action Type",
        type: "text",
        value: "SearchAction",
        readonly: true,
      },
      target: {
        label: "Search URL Template",
        type: "text",
        placeholder: "https://example.com/search?q={search_term_string}",
      },
    },
    description: "Actions users can perform (like searching)",
  },

  // Article specific
  articleSection: {
    label: "Article Section",
    type: "text",
    placeholder: "Technology, Sports, Business",
    description: "The section/category this article belongs to",
  },
  wordCount: {
    label: "Word Count",
    type: "number",
    placeholder: "1500",
    description: "Approximate number of words in the article",
  },
  articleBody: {
    label: "Article Body",
    type: "textarea",
    placeholder: "The full text content of the article...",
    description: "Full article content (optional - can be auto-detected)",
    rows: 6,
  },
  dateline: {
    label: "Dateline",
    type: "text",
    placeholder: "NEW YORK, Jan 15",
    description: "Location and date line for news articles",
  },

  // Event performer
  performer: {
    label: "Event Performer(s)",
    type: "array",
    arrayType: "object",
    subfields: {
      "@type": {
        label: "Performer Type",
        type: "select",
        options: [
          { value: "Person", label: "Person" },
          { value: "MusicGroup", label: "Music Group" },
          { value: "Organization", label: "Organization" },
        ],
        value: "Person",
      },
      name: {
        label: "Performer Name",
        type: "text",
        placeholder: "Artist or Band Name",
      },
    },
    description: "Who is performing at the event",
  },
};
