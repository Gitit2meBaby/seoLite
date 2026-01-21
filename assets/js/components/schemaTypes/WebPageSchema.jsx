// /components/schemaTypes/WebPageSchema.jsx

import { useEffect, useState } from "react";

/**
 * WebPage Schema Editor
 * - Page-level schema
 * - Links to Organization / Website / Images
 * - Foundation for Article, Product, Service, etc.
 */
export default function WebPageSchema({ value, onChange }) {
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
    <form className="schema-form schema-webpage">
      {/* Core */}
      <label>
        Page Name / Title *
        <input
          type="text"
          id="name"
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </label>

      <label>
        Page URL *
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
        Page @id (optional but recommended)
        <input
          type="url"
          id="id"
          placeholder="https://example.com/page#webpage"
          value={data.id || ""}
          onChange={(e) => update("id", e.target.value)}
        />
      </label>

      <label>
        Is Part Of (Website URL)
        <input
          type="url"
          id="isPartOf"
          placeholder="https://example.com"
          value={data.isPartOf || ""}
          onChange={(e) => update("isPartOf", e.target.value)}
        />
      </label>

      {/* Content */}
      <label>
        Primary Image URL
        <input
          type="url"
          id="primaryImage"
          value={data.primaryImage || ""}
          onChange={(e) => update("primaryImage", e.target.value)}
        />
      </label>

      <label>
        Breadcrumb URL
        <input
          type="url"
          id="breadcrumb"
          value={data.breadcrumb || ""}
          onChange={(e) => update("breadcrumb", e.target.value)}
        />
      </label>

      {/* Metadata */}
      <label>
        Date Published
        <input
          type="date"
          id="datePublished"
          value={data.datePublished || ""}
          onChange={(e) => update("datePublished", e.target.value)}
        />
      </label>

      <label>
        Date Modified
        <input
          type="date"
          id="dateModified"
          value={data.dateModified || ""}
          onChange={(e) => update("dateModified", e.target.value)}
        />
      </label>

      {/* Authority */}
      <label>
        Author Name
        <input
          type="text"
          id="author"
          value={data.author || ""}
          onChange={(e) => update("author", e.target.value)}
        />
      </label>

      <label>
        Publisher Name
        <input
          type="text"
          id="publisher"
          value={data.publisher || ""}
          onChange={(e) => update("publisher", e.target.value)}
        />
      </label>

      {/* Page Type */}
      <label>
        WebPage Type
        <select
          id="webPageType"
          value={data.webPageType || "WebPage"}
          onChange={(e) => update("webPageType", e.target.value)}
        >
          <option value="WebPage">WebPage</option>
          <option value="AboutPage">AboutPage</option>
          <option value="ContactPage">ContactPage</option>
          <option value="FAQPage">FAQPage</option>
          <option value="ItemPage">ItemPage</option>
          <option value="CheckoutPage">CheckoutPage</option>
          <option value="ProfilePage">ProfilePage</option>
          <option value="SearchResultsPage">SearchResultsPage</option>
        </select>
      </label>
    </form>
  );
}

/**
 * JSON-LD builder for WebPage
 */
export function buildWebPageJson(data) {
  if (!data?.name || !data?.url) return null;

  return {
    "@context": "https://schema.org",
    "@type": data.webPageType || "WebPage",

    ...(data.id && { "@id": data.id }),

    // Core
    name: data.name,
    url: data.url,
    description: data.description,

    // Relationships
    isPartOf: data.isPartOf
      ? {
          "@type": "WebSite",
          "@id": data.isPartOf,
        }
      : undefined,

    primaryImageOfPage: data.primaryImage
      ? {
          "@type": "ImageObject",
          url: data.primaryImage,
        }
      : undefined,

    breadcrumb: data.breadcrumb
      ? {
          "@type": "BreadcrumbList",
          "@id": data.breadcrumb,
        }
      : undefined,

    // Metadata
    datePublished: data.datePublished,
    dateModified: data.dateModified,

    // Authority
    author: data.author
      ? {
          "@type": "Person",
          name: data.author,
        }
      : undefined,

    publisher: data.publisher
      ? {
          "@type": "Organization",
          name: data.publisher,
        }
      : undefined,
  };
}
