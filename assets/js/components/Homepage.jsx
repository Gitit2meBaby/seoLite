import React from "react";

/**
 * PROPS:
 * - onGetStarted: Function to call when user clicks "Get Started"
 */
const Homepage = ({ onGetStarted }) => {
  // Get data passed from WordPress PHP
  const data = window.seoPluginData || {};

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  /**
   * Handle "Import Meta Data" button click
   * TODO: This will eventually open a modal or navigate to import page
   */
  const handleImportMeta = () => {
    console.log("Import Meta Data clicked - to be implemented");
    // You can add functionality here when offline
  };

  return (
    <div className="homepage-container">
      <div className="homepage-hero">
        {/* Logo Placeholder */}
        <div className="homepage-logo">
          <div className="logo-placeholder">
            {/* TODO: Replace with actual logo */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="16" fill="#0073aa" />
              <path
                d="M25 40L35 50L55 30"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="homepage-title">
          {data.strings?.welcome || "Welcome to SEOLite"}
        </h1>

        {/* Description */}
        <p className="homepage-description">
          SEO & custom fields toolkit without the hassle, hefty bloat or
          pricetag. Indie developed plugin to allow you full control over
          metadata, schemas and any script you can imagine. Super lightweight
          package with all the important features in a simple to use dashboard.
        </p>
      </div>

      {/* Feature Grid with Image Placeholders */}
      <div className="homepage-features">
        {/* Feature 1 */}
        <div className="feature-card">
          <div className="feature-image">
            <div className="image-placeholder">
              <span>📊</span>
            </div>
          </div>
          <h3>Complete SEO Control</h3>
          <p>
            Manage meta tags, Open Graph, Twitter Cards, and more in one place.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="feature-card">
          <div className="feature-image">
            <div className="image-placeholder">
              <span>🚀</span>
            </div>
          </div>
          <h3>Lightning Fast</h3>
          <p>
            40x smaller than leading SEO plugins. Zero impact on your site
            speed.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="feature-card">
          <div className="feature-image">
            <div className="image-placeholder">
              <span>🎯</span>
            </div>
          </div>
          <h3>Schema Markup</h3>
          <p>
            Rich snippets for better search visibility with comprehensive schema
            support.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="feature-card">
          <div className="feature-image">
            <div className="image-placeholder">
              <span>🔧</span>
            </div>
          </div>
          <h3>Easy to Use</h3>
          <p>
            Intuitive interface designed for both beginners and SEO
            professionals.
          </p>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="homepage-actions">
        {/* Import Button (smaller, secondary) */}
        <button
          className="import-button"
          onClick={handleImportMeta}
          type="button"
        >
          {data.strings?.importMeta || "Import Meta Data"}
        </button>

        {/* Get Started Button (primary, larger) */}
        <button
          className="get-started-button"
          onClick={handleGetStarted}
          type="button"
        >
          {data.strings?.getStarted || "Get Started"}
          <span className="button-icon">→</span>
        </button>
      </div>

      {/* Quick Stats Section (Optional) */}
      <div className="homepage-stats">
        <div className="stat-item">
          <div className="stat-number">15+</div>
          <div className="stat-label">Schema Types</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">40x</div>
          <div className="stat-label">Lighter</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Free</div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
