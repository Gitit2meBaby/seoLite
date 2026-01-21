// /components/schemaTypes/WebSiteSchema.jsx

import { useState, useEffect } from "react";

/**
 * WebSite Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function WebSiteSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="schema-form schema-website">
      <label>
        Site Name *
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </label>

      <label>
        Site URL *
        <input
          type="url"
          value={data.url || ""}
          onChange={(e) => handleChange("url", e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </label>

      <label>
        Publisher Name
        <input
          type="text"
          value={data.publisherName || ""}
          onChange={(e) => handleChange("publisherName", e.target.value)}
          placeholder="Organization Name"
        />
      </label>

      <label>
        Publisher Logo URL
        <input
          type="url"
          value={data.publisherLogo || ""}
          onChange={(e) => handleChange("publisherLogo", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
      </label>

      <label>
        Search URL (for SearchAction)
        <input
          type="url"
          value={data.searchUrl || ""}
          onChange={(e) => handleChange("searchUrl", e.target.value)}
          placeholder="https://example.com/?s={search_term_string}"
        />
      </label>

      <label>
        Social Profiles / SameAs (comma separated)
        <input
          type="text"
          value={data.sameAs || ""}
          onChange={(e) => handleChange("sameAs", e.target.value)}
          placeholder="https://facebook.com, https://twitter.com"
        />
      </label>
    </form>
  );
}

/**
 * JSON-LD builder for WebSite
 */
export function buildWebSiteJson(data) {
  if (!data?.name || !data?.url) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    url: data.url,
    ...(data.description && { description: data.description }),
    ...(data.publisherName
      ? {
          publisher: {
            "@type": "Organization",
            name: data.publisherName,
            ...(data.publisherLogo && {
              logo: { "@type": "ImageObject", url: data.publisherLogo },
            }),
          },
        }
      : undefined),
    ...(data.searchUrl
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: data.searchUrl,
            "query-input": "required name=search_term_string",
          },
        }
      : undefined),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return json;
}
