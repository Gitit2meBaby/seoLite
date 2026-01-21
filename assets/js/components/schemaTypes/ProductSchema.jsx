// /components/schemaTypes/ProductSchema.jsx

import { useEffect, useState } from "react";

/**
 * Product Schema Editor
 * - Commercial schema
 * - Works for physical & digital products
 * - Clean base for Offers, Reviews, Variants
 */
export default function ProductSchema({ value, onChange }) {
  const [data, setData] = useState(value || {});

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  function update(field, val) {
    setData((prev) => ({
      ...prev,
      [field]: val,
    }));
  }

  return (
    <form className="schema-form schema-product">
      {/* Core */}
      <label>
        Product Name *
        <input
          type="text"
          id="name"
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </label>

      <label>
        Product URL *
        <input
          type="url"
          id="url"
          value={data.url || ""}
          onChange={(e) => update("url", e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          id="description"
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          maxLength={300}
        />
      </label>

      {/* Identity */}
      <label>
        Product @id
        <input
          type="url"
          id="id"
          placeholder="https://example.com/product#product"
          value={data.id || ""}
          onChange={(e) => update("id", e.target.value)}
        />
      </label>

      <label>
        Brand Name
        <input
          type="text"
          id="brand"
          value={data.brand || ""}
          onChange={(e) => update("brand", e.target.value)}
        />
      </label>

      <label>
        SKU
        <input
          type="text"
          id="sku"
          value={data.sku || ""}
          onChange={(e) => update("sku", e.target.value)}
        />
      </label>

      <label>
        GTIN (UPC / EAN / ISBN)
        <input
          type="text"
          id="gtin"
          value={data.gtin || ""}
          onChange={(e) => update("gtin", e.target.value)}
        />
      </label>

      <label>
        MPN
        <input
          type="text"
          id="mpn"
          value={data.mpn || ""}
          onChange={(e) => update("mpn", e.target.value)}
        />
      </label>

      {/* Media */}
      <label>
        Product Image URL
        <input
          type="url"
          id="image"
          value={data.image || ""}
          onChange={(e) => update("image", e.target.value)}
        />
      </label>

      {/* Offer */}
      <label>
        Price
        <input
          type="number"
          step="any"
          id="price"
          value={data.price || ""}
          onChange={(e) => update("price", e.target.value)}
        />
      </label>

      <label>
        Currency
        <input
          type="text"
          id="priceCurrency"
          placeholder="USD, EUR, AUD"
          value={data.priceCurrency || ""}
          onChange={(e) => update("priceCurrency", e.target.value)}
        />
      </label>

      <label>
        Availability
        <select
          id="availability"
          value={data.availability || ""}
          onChange={(e) => update("availability", e.target.value)}
        >
          <option value="">—</option>
          <option value="InStock">In stock</option>
          <option value="OutOfStock">Out of stock</option>
          <option value="PreOrder">Pre-order</option>
          <option value="Discontinued">Discontinued</option>
        </select>
      </label>

      {/* Relationships */}
      <label>
        Manufacturer Name
        <input
          type="text"
          id="manufacturer"
          value={data.manufacturer || ""}
          onChange={(e) => update("manufacturer", e.target.value)}
        />
      </label>

      <label>
        Category
        <input
          type="text"
          id="category"
          value={data.category || ""}
          onChange={(e) => update("category", e.target.value)}
        />
      </label>
    </form>
  );
}

/**
 * JSON-LD builder for Product
 */
export function buildProductJson(data) {
  if (!data?.name || !data?.url) return null;

  const offer =
    data.price && data.priceCurrency
      ? {
          "@type": "Offer",
          price: data.price,
          priceCurrency: data.priceCurrency,
          availability: data.availability
            ? `https://schema.org/${data.availability}`
            : undefined,
          url: data.url,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",

    ...(data.id && { "@id": data.id }),

    // Core
    name: data.name,
    url: data.url,
    description: data.description,

    // Identity
    sku: data.sku,
    gtin: data.gtin,
    mpn: data.mpn,

    brand: data.brand
      ? {
          "@type": "Brand",
          name: data.brand,
        }
      : undefined,

    // Media
    image: data.image,

    // Offer
    offers: offer,

    // Relationships
    manufacturer: data.manufacturer
      ? {
          "@type": "Organization",
          name: data.manufacturer,
        }
      : undefined,

    category: data.category,
  };
}
