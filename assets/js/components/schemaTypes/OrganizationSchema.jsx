import { useEffect, useState } from "react";

/**
 * Organization Schema Editor
 * - Self-contained form
 * - Owns its state
 * - Exports JSON-LD builder
 */
export default function OrganizationSchema({ value, onChange }) {
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
    <form className="schema-form schema-organization">
      {/* Required / Core */}
      <label>
        Organization Name *
        <input
          type="text"
          id="name"
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </label>

      <label>
        Website URL
        <input
          type="url"
          id="url"
          value={data.url || ""}
          onChange={(e) => update("url", e.target.value)}
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
        Logo URL
        <input
          type="url"
          id="logo"
          value={data.logo || ""}
          onChange={(e) => update("logo", e.target.value)}
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

      {/* Contact */}
      <label>
        Email
        <input
          type="email"
          id="email"
          value={data.email || ""}
          onChange={(e) => update("email", e.target.value)}
        />
      </label>

      <label>
        Telephone
        <input
          type="tel"
          id="telephone"
          value={data.telephone || ""}
          onChange={(e) => update("telephone", e.target.value)}
        />
      </label>

      {/* Address (kept simple for uniformity) */}
      <label>
        Address
        <input
          type="text"
          id="address"
          value={data.address || ""}
          onChange={(e) => update("address", e.target.value)}
        />
      </label>

      {/* Business info */}
      <label>
        Founding Date
        <input
          type="date"
          id="foundingDate"
          value={data.foundingDate || ""}
          onChange={(e) => update("foundingDate", e.target.value)}
        />
      </label>

      <label>
        Number of Employees
        <input
          type="number"
          id="numberOfEmployees"
          value={data.numberOfEmployees || ""}
          onChange={(e) => update("numberOfEmployees", e.target.value)}
        />
      </label>

      <label>
        Area Served
        <input
          type="text"
          id="areaServed"
          value={data.areaServed || ""}
          onChange={(e) => update("areaServed", e.target.value)}
        />
      </label>

      <label>
        Opening Hours
        <input
          type="text"
          id="openingHours"
          placeholder="Mo-Fr 09:00-17:00"
          value={data.openingHours || ""}
          onChange={(e) => update("openingHours", e.target.value)}
        />
      </label>

      {/* Commercial */}
      <label>
        Payment Accepted
        <input
          type="text"
          id="paymentAccepted"
          placeholder="Cash, Credit Card, PayPal"
          value={data.paymentAccepted || ""}
          onChange={(e) => update("paymentAccepted", e.target.value)}
        />
      </label>

      <label>
        Price Range
        <input
          type="text"
          id="priceRange"
          placeholder="$$"
          value={data.priceRange || ""}
          onChange={(e) => update("priceRange", e.target.value)}
        />
      </label>

      {/* Trust / Authority */}
      <label>
        Same As (one URL per line)
        <textarea
          id="sameAs"
          placeholder="https://facebook.com/yourpage"
          value={data.sameAs || ""}
          onChange={(e) => update("sameAs", e.target.value)}
        />
      </label>
    </form>
  );
}

/**
 * JSON-LD builder
 * Keep pure & predictable
 */
export function buildOrganizationJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",

    // Core
    name: data.name,
    url: data.url,
    description: data.description,

    // Identity
    logo: data.logo,
    brand: data.brand,

    // Contact
    email: data.email,
    telephone: data.telephone,
    address: data.address,

    // Business info
    foundingDate: data.foundingDate,
    numberOfEmployees: data.numberOfEmployees,
    areaServed: data.areaServed,
    openingHours: data.openingHours,

    // Commercial
    paymentAccepted: data.paymentAccepted,
    priceRange: data.priceRange,

    // Authority
    sameAs: sameAsArray,
  };
}
