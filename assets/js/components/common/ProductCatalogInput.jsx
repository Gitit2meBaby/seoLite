// assets/js/components/common/ProductCatalogInput.jsx
import { useState } from "react";
import styles from "@css/components/tabs/SocialMedia.module.scss"; // Reusing existing styles

const ProductCatalogInput = ({ value = [], onChange, className = "" }) => {
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Ensure value is always an array
  const products = Array.isArray(value) ? value : [];

  const addProduct = () => {
    const newProduct = {
      name: "",
      description: "",
      image: "",
      price: "",
      currency: "USD",
      availability: "InStock",
      brand: "",
      sku: "",
    };
    const updatedProducts = [...products, newProduct];
    onChange(updatedProducts);
    setExpandedProduct(updatedProducts.length - 1); // Expand the new product
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    onChange(updatedProducts);
    // Close expanded section if we removed it
    if (expandedProduct === index) {
      setExpandedProduct(null);
    } else if (expandedProduct > index) {
      setExpandedProduct(expandedProduct - 1);
    }
  };

  const updateProduct = (index, field, productValue) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [field]: productValue } : product
    );
    onChange(updatedProducts);
  };

  const toggleProductExpansion = (index) => {
    setExpandedProduct(expandedProduct === index ? null : index);
  };

  const TooltipHelper = ({ tooltipText }) => (
    <span className={styles.mediaHelper}>
      <span className={styles.tooltipTrigger} data-tooltip={tooltipText}>
        ℹ️
      </span>
    </span>
  );

  const renderProductField = (product, index, field, config) => {
    const fieldValue = product[field] || "";

    return (
      <div key={field} className={styles.field}>
        <label className={styles.label}>
          {config.label}
          {config.hasTooltip && (
            <TooltipHelper tooltipText={config.tooltipText} />
          )}
        </label>

        {config.type === "textarea" ? (
          <textarea
            className={styles.textarea}
            value={fieldValue}
            onChange={(e) => updateProduct(index, field, e.target.value)}
            placeholder={config.placeholder}
            rows={3}
          />
        ) : config.type === "select" ? (
          <select
            className={styles.select}
            value={fieldValue}
            onChange={(e) => updateProduct(index, field, e.target.value)}
          >
            {config.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={config.type}
            className={styles.input}
            value={fieldValue}
            onChange={(e) => updateProduct(index, field, e.target.value)}
            placeholder={config.placeholder}
            step={config.type === "number" ? "0.01" : undefined}
          />
        )}
      </div>
    );
  };

  // Field configurations for products
  const productFields = {
    name: {
      label: "Product Name",
      type: "text",
      placeholder: "product name",
      hasTooltip: true,
      tooltipText: "Name of the specific product",
    },
    description: {
      label: "Product Description",
      type: "textarea",
      placeholder: "describe your product",
      hasTooltip: true,
      tooltipText: "Brief description of what this product does or offers",
    },
    image: {
      label: "Product Image",
      type: "url",
      placeholder: "https://example.com/product.jpg",
      hasTooltip: true,
      tooltipText: "High-quality product image (1200x630px recommended)",
    },
    price: {
      label: "Price",
      type: "number",
      placeholder: "29.99",
      hasTooltip: true,
      tooltipText: "Current price of the product",
    },
    currency: {
      label: "Currency",
      type: "select",
      options: [
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
        { value: "GBP", label: "GBP (£)" },
        { value: "CAD", label: "CAD (C$)" },
        { value: "AUD", label: "AUD (A$)" },
        { value: "JPY", label: "JPY (¥)" },
      ],
      hasTooltip: true,
      tooltipText: "Currency for the product price",
    },
    availability: {
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
    brand: {
      label: "Brand",
      type: "text",
      placeholder: "Apple, Nike, Sony",
      hasTooltip: true,
      tooltipText: "Brand or manufacturer of the product",
    },
    sku: {
      label: "SKU",
      type: "text",
      placeholder: "ABC123XYZ",
      hasTooltip: true,
      tooltipText: "Stock Keeping Unit - your internal product identifier",
    },
  };

  return (
    <div className={`${styles.sectionsContainer} ${className}`}>
      <div className={styles.sectionHeader}>
        <h4>Products ({products.length})</h4>
        <button
          type="button"
          className={styles.saveButton}
          onClick={addProduct}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
            background: "#28a745",
            marginBottom: "1rem",
          }}
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div
          className={styles.emptyState}
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#666",
            background: "#f8f9fa",
            borderRadius: "8px",
            margin: "1rem 0",
          }}
        >
          <p>No products added yet.</p>
          <p style={{ fontSize: "0.9rem" }}>
            Click "Add Product" to start adding your products.
          </p>
        </div>
      ) : (
        products.map((product, index) => {
          const isExpanded = expandedProduct === index;
          const productName = product.name || `Product ${index + 1}`;

          return (
            <div key={index} className={styles.section}>
              <button
                type="button"
                className={`${styles.sectionHeader} ${
                  isExpanded ? styles.expanded : ""
                }`}
                onClick={() => toggleProductExpansion(index)}
              >
                <div className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>
                    {isExpanded ? "▼" : "▶"}
                  </span>
                  <h3>{productName}</h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  <span className={styles.sectionCount}>
                    {product.price && product.currency
                      ? `${product.currency} ${product.price}`
                      : "No price set"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProduct(index);
                    }}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </button>

              {isExpanded && (
                <div className={styles.sectionContent}>
                  <div className={styles.fieldsContainer}>
                    {Object.keys(productFields).map((fieldKey) =>
                      renderProductField(
                        product,
                        index,
                        fieldKey,
                        productFields[fieldKey]
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProductCatalogInput;
