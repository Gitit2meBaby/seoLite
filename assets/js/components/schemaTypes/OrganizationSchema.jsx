import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Organization Schema Editor */
/* ================================================================== */
export default function OrganizationSchema({ value, onChange }) {
  const [data, setData] = useState({
    address: {},
    contactPoint: [],
    founder: [],
    sameAs: [],
    ...value,
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateAddress = (field, val) =>
    setData((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), [field]: val },
    }));

  const updateArray = (field, index, val) => {
    const next = [...(data[field] || [])];
    next[index] = val;
    setData((prev) => ({ ...prev, [field]: next }));
  };

  const addArrayItem = (field, item = "") =>
    setData((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));

  const removeArrayItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Identity */}
      <div className={styles.fieldGroup}>
        <h4>Organization Identity</h4>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Organization Name *
            <Tooltip content="Official registered or trading name of the organization." />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.name || ""}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Excel Experts Australia"
            required
            autoComplete="organization"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Description
            <Tooltip content="Brief description of what the organization does." />
          </label>
          <textarea
            className={styles.textarea}
            value={data.description || ""}
            onChange={(e) => update("description", e.target.value)}
            maxLength={500}
            placeholder="We provide expert Excel automation, VBA development, and data solutions for businesses."
          />
          <small>{(data.description || "").length} / 500</small>
        </div>
      </div>

      {/* Identity URLs */}
      <div className={styles.fieldGroup}>
        <h4>Schema Identity & URLs</h4>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Organization @id *
            <Tooltip content="Stable identifier. Usually your homepage URL with #organization." />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.id || ""}
            onChange={(e) => update("id", e.target.value)}
            placeholder="https://example.com/#organization"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Website URL *
            <Tooltip content="Canonical homepage URL of the organization." />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.url || ""}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://example.com"
            required
            autoComplete="organization-url"
          />
        </div>
      </div>

      {/* Branding */}
      <div className={styles.fieldGroup}>
        <h4>Branding</h4>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Logo URL
            <Tooltip content="Logo image used for brand recognition. Recommended size: at least 112x112px." />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.logo || ""}
            onChange={(e) => update("logo", e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>

      {/* Address */}
      <div className={styles.fieldGroup}>
        <h4>Address</h4>
        {[
          {
            field: "streetAddress",
            label: "Street Address",
            autoComplete: "street-address",
          },
          {
            field: "addressLocality",
            label: "City",
            autoComplete: "address-level2",
          },
          {
            field: "addressRegion",
            label: "State / Region",
            autoComplete: "address-level1",
          },
          {
            field: "postalCode",
            label: "Postal Code",
            autoComplete: "postal-code",
          },
          {
            field: "addressCountry",
            label: "Country",
            placeholder: "Australia",
            autoComplete: "country",
          },
        ].map(({ field, label, placeholder, autoComplete }) => (
          <div className={styles.formGroup} key={field}>
            <label className={styles.label}>{label}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={placeholder || ""}
              value={data.address[field] || ""}
              onChange={(e) => updateAddress(field, e.target.value)}
              autoComplete={autoComplete}
            />
          </div>
        ))}
      </div>

      {/* Contact Points */}
      <div className={styles.fieldGroup}>
        <h4>Contact Points</h4>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Contact Telephone
            <Tooltip content="Public contact phone number in international format." />
          </label>
          <input
            type="tel"
            className={styles.input}
            value={data.contactPoint?.[0]?.telephone || ""}
            onChange={(e) =>
              update("contactPoint", [
                {
                  "@type": "ContactPoint",
                  telephone: e.target.value,
                  contactType: "Customer Service",
                  availableLanguage: ["English"],
                  areaServed: "AU",
                },
              ])
            }
            placeholder="+61 3 9000 0000"
          />
        </div>
      </div>

      {/* Additional Info */}
      <div className={styles.fieldGroup}>
        <h4>Additional Information</h4>

        {/* Founder (Array-safe) */}
        {data.founder?.map((f, i) => (
          <div key={i} className={styles.formGroup}>
            <label className={styles.label}>Founder</label>
            <input
              type="text"
              className={styles.input}
              value={f}
              onChange={(e) => updateArray("founder", i, e.target.value)}
              placeholder="John Doe"
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeArrayItem("founder", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={() => addArrayItem("founder")}
        >
          + Add Founder
        </button>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Founding Date
            <Tooltip content="ISO 8601 date the organization was founded." />
          </label>
          <input
            type="date"
            className={styles.input}
            value={data.foundingDate || ""}
            onChange={(e) => update("foundingDate", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Number of Employees
            <Tooltip content="Total number of employees." />
          </label>
          <input
            type="number"
            className={styles.input}
            value={data.numberOfEmployees || ""}
            onChange={(e) => update("numberOfEmployees", e.target.value)}
            placeholder="25"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Area Served
            <Tooltip content="Cities, regions or countries served by the organization." />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.areaServed || ""}
            onChange={(e) => update("areaServed", e.target.value)}
            placeholder="Australia"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Awards
            <Tooltip content="Industry awards or recognition." />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.award || ""}
            onChange={(e) => update("award", e.target.value)}
            placeholder="Best Excel Solutions 2025"
          />
        </div>

        {/* Social Profiles (sameAs) */}
        {data.sameAs?.map((url, i) => (
          <div key={i} className={styles.formGroup}>
            <label className={styles.label}>Social Profile</label>
            <input
              type="url"
              className={styles.input}
              value={url}
              onChange={(e) => updateArray("sameAs", i, e.target.value)}
              placeholder="https://twitter.com/username"
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeArrayItem("sameAs", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={() => addArrayItem("sameAs")}
        >
          + Add Social Profile
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder */
/* ================================================================== */
export function buildOrganizationJson(data) {
  if (!data?.name || !data?.url || !data?.id) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": data.id,
    name: data.name,
    ...(data.legalName && { legalName: data.legalName }),
    ...(data.description && { description: data.description }),
    url: data.url,
    ...(data.logo && { logo: { "@type": "ImageObject", url: data.logo } }),
    ...(data.address && {
      address: { "@type": "PostalAddress", ...data.address },
    }),
    ...(data.contactPoint &&
      data.contactPoint.length && { contactPoint: data.contactPoint }),
    ...(data.email && { email: data.email }),
    ...(data.telephone && { telephone: data.telephone }),
    ...(data.founder && data.founder.length && { founder: data.founder }),
    ...(data.foundingDate && { foundingDate: data.foundingDate }),
    ...(data.numberOfEmployees && {
      numberOfEmployees: data.numberOfEmployees,
    }),
    ...(data.areaServed && { areaServed: data.areaServed }),
    ...(data.award && { award: data.award }),
    ...(data.sameAs &&
      data.sameAs.length && { sameAs: data.sameAs.filter(Boolean) }),
  };
}
