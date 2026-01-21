// /components/schemaTypes/ServiceSchema.jsx

import { useState, useEffect } from "react";

/**
 * Service Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function ServiceSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="schema-form schema-service">
      <label>
        Service Name *
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
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
        Service Type / Category
        <input
          type="text"
          value={data.serviceType || ""}
          onChange={(e) => handleChange("serviceType", e.target.value)}
          placeholder="Consulting, Cleaning, Delivery..."
        />
      </label>

      <label>
        Provider Name
        <input
          type="text"
          value={data.providerName || ""}
          onChange={(e) => handleChange("providerName", e.target.value)}
          placeholder="Organization Name"
        />
      </label>

      <label>
        Provider URL
        <input
          type="url"
          value={data.providerUrl || ""}
          onChange={(e) => handleChange("providerUrl", e.target.value)}
          placeholder="https://example.com"
        />
      </label>

      <label>
        Area Served (City, Region, or Country)
        <input
          type="text"
          value={data.areaServed || ""}
          onChange={(e) => handleChange("areaServed", e.target.value)}
          placeholder="Melbourne, VIC, Australia"
        />
      </label>

      <label>
        Service Audience / Target
        <input
          type="text"
          value={data.audience || ""}
          onChange={(e) => handleChange("audience", e.target.value)}
          placeholder="General Public, Businesses, Students..."
        />
      </label>

      <label>
        Service Hours
        <input
          type="text"
          value={data.hoursAvailable || ""}
          onChange={(e) => handleChange("hoursAvailable", e.target.value)}
          placeholder="Mo-Fr 9:00-17:00"
        />
      </label>

      <label>
        Image URL(s) (comma separated)
        <input
          type="text"
          value={data.image || ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
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
 * JSON-LD builder for Service
 */
export function buildServiceJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const imageArray = data.image
    ? data.image
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.serviceType && { serviceType: data.serviceType }),
    ...(data.providerName || data.providerUrl
      ? {
          provider: {
            "@type": "Organization",
            ...(data.providerName && { name: data.providerName }),
            ...(data.providerUrl && { url: data.providerUrl }),
          },
        }
      : undefined),
    ...(data.areaServed && { areaServed: data.areaServed }),
    ...(data.audience && {
      audience: { "@type": "Audience", name: data.audience },
    }),
    ...(data.hoursAvailable && { hoursAvailable: data.hoursAvailable }),
    ...(imageArray && { image: imageArray }),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return json;
}
