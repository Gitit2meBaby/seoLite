// /components/schemaTypes/NonProfitOrganizationSchema.jsx

import React from "react";

export default function NonProfitOrganizationSchema({ data = {}, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <form>
      <h3>Non-Profit Organization Schema</h3>

      {/* Core Organization Fields */}
      <input
        name="name"
        placeholder="Organization Name"
        value={data.name || ""}
        onChange={handleChange}
      />
      <input
        name="url"
        type="url"
        placeholder="Website URL"
        value={data.url || ""}
        onChange={handleChange}
      />
      <input
        name="logo"
        type="url"
        placeholder="Logo URL"
        value={data.logo || ""}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={data.description || ""}
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={data.email || ""}
        onChange={handleChange}
      />
      <input
        name="telephone"
        type="tel"
        placeholder="Phone Number"
        value={data.telephone || ""}
        onChange={handleChange}
      />
      <input
        name="address"
        placeholder="Address"
        value={data.address || ""}
        onChange={handleChange}
      />

      <input
        name="foundingDate"
        type="date"
        value={data.foundingDate || ""}
        onChange={handleChange}
      />
      <input
        name="areaServed"
        placeholder="Area Served"
        value={data.areaServed || ""}
        onChange={handleChange}
      />

      {/* Non-Profit Specific Fields */}
      <input
        name="nonprofitStatus"
        placeholder="Nonprofit Status (e.g. 501(c)(3))"
        value={data.nonprofitStatus || ""}
        onChange={handleChange}
      />
      <input
        name="taxID"
        placeholder="Tax ID / Charity Number"
        value={data.taxID || ""}
        onChange={handleChange}
      />

      <textarea
        name="mission"
        placeholder="Mission Statement"
        value={data.mission || ""}
        onChange={handleChange}
      />

      <input
        name="donationUrl"
        type="url"
        placeholder="Donation URL"
        value={data.donationUrl || ""}
        onChange={handleChange}
      />
      <input
        name="volunteerUrl"
        type="url"
        placeholder="Volunteer URL"
        value={data.volunteerUrl || ""}
        onChange={handleChange}
      />

      <input
        name="sameAs"
        placeholder="Social Profiles (comma separated)"
        value={data.sameAs || ""}
        onChange={handleChange}
      />
    </form>
  );
}

/**
 * JSON-LD builder for NonProfitOrganization
 */
export function buildNonProfitOrganizationJson(data) {
  // Required minimum
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",

    // Core
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    email: data.email,
    telephone: data.telephone,

    // Address
    ...(data.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: data.address,
      },
    }),

    foundingDate: data.foundingDate,
    ...(data.areaServed && {
      areaServed: {
        "@type": "AdministrativeArea",
        name: data.areaServed,
      },
    }),

    // Non-profit specific
    nonprofitStatus: data.nonprofitStatus,
    taxID: data.taxID,
    mission: data.mission,
    donationUrl: data.donationUrl,
    volunteerUrl: data.volunteerUrl,

    // Social links
    ...(sameAsArray && { sameAs: sameAsArray }),
  };
}
