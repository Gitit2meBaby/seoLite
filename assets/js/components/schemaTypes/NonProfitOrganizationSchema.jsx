import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Opening Hours Editor */
/* ================================================================== */
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function OpeningHoursEditor({ value = [], onChange }) {
  const updateDay = (i, field, val) => {
    const next = [...value];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  const addDay = (day = "Monday") => {
    onChange([...value, { dayOfWeek: day, opens: "", closes: "" }]);
  };

  return (
    <div className={styles.fieldGroup}>
      <h4>Opening Hours</h4>
      {value.map((row, i) => (
        <div key={i} className={styles.formRow}>
          <select
            className={styles.select}
            value={row.dayOfWeek}
            onChange={(e) => updateDay(i, "dayOfWeek", e.target.value)}
          >
            {DAYS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input
            type="time"
            className={styles.input}
            value={row.opens}
            onChange={(e) => updateDay(i, "opens", e.target.value)}
          />
          <input
            type="time"
            className={styles.input}
            value={row.closes}
            onChange={(e) => updateDay(i, "closes", e.target.value)}
          />
        </div>
      ))}
      <button
        type="button"
        className={styles.addButton}
        onClick={() => addDay()}
      >
        + Add Opening Day
      </button>
    </div>
  );
}

/* ================================================================== */
/* NonprofitOrganization Schema Editor */
/* ================================================================== */
export default function NonprofitOrganizationSchema({ value, onChange }) {
  const [data, setData] = useState({
    id: "",
    name: "",
    url: "",
    description: "",
    email: "",
    telephone: "",
    address: {
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "",
    },
    openingHours: [],
    mission: "",
    donationUrl: "",
    volunteerUrl: "",
    taxID: "",
    nonprofitStatus: "",
    logo: "",
    images: [],
    sameAs: [],
    founder: [],
    foundingDate: "",
    areaServed: [],
    knowsAbout: [],
    seeks: [],
    memberOf: [],
    funder: [],
    event: [],
    subOrganization: [],
    ...value,
    address: value?.address || {
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "",
    },
    openingHours: value?.openingHours || [],
    images: value?.images || [],
    sameAs: value?.sameAs || [],
    founder: value?.founder || [],
    areaServed: value?.areaServed || [],
    knowsAbout: value?.knowsAbout || [],
    seeks: value?.seeks || [],
    memberOf: value?.memberOf || [],
    funder: value?.funder || [],
    event: value?.event || [],
    subOrganization: value?.subOrganization || [],
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  /* ======================= Helpers ======================= */
  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateAddress = (field, val) =>
    setData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: val },
    }));
  const updateArray = (field, index, val) => {
    const next = [...data[field]];
    next[index] = val;
    setData((prev) => ({ ...prev, [field]: next }));
  };
  const addArrayItem = (field, item = "") =>
    setData((prev) => ({ ...prev, [field]: [...prev[field], item] }));
  const removeArrayItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Info */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Organization Name <span className={styles.required}>*</span>
          <Tooltip text="Official name of your nonprofit organization." />
        </label>
        <input
          type="text"
          className={styles.input}
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          required
          autoComplete="organization"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Website URL
          <Tooltip text="Primary website for your organization." />
        </label>
        <input
          type="url"
          className={styles.input}
          value={data.url}
          onChange={(e) => update("url", e.target.value)}
          autoComplete="organization-url"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Description
          <Tooltip text="Brief description of your organization and its activities." />
        </label>
        <textarea
          className={styles.textarea}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          @id (Unique Identifier)
          <Tooltip text="Optional URL or unique identifier for structured data." />
        </label>
        <input
          type="url"
          className={styles.input}
          value={data.id}
          onChange={(e) => update("id", e.target.value)}
        />
      </div>

      {/* Contact */}
      <div className={styles.formRow}>
        <input
          type="email"
          className={styles.input}
          placeholder="info@example.org"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
        />
        <input
          type="tel"
          className={styles.input}
          placeholder="+1-555-555-5555"
          value={data.telephone}
          onChange={(e) => update("telephone", e.target.value)}
          autoComplete="tel"
        />
      </div>

      {/* Address */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Address</label>
        <input
          type="text"
          className={styles.input}
          placeholder="123 Main Street"
          value={data.address.streetAddress}
          onChange={(e) => updateAddress("streetAddress", e.target.value)}
          autoComplete="street-address"
        />
        <input
          type="text"
          className={styles.input}
          placeholder="City"
          value={data.address.addressLocality}
          onChange={(e) => updateAddress("addressLocality", e.target.value)}
          autoComplete="address-level2"
        />
        <input
          type="text"
          className={styles.input}
          placeholder="State/Region"
          value={data.address.addressRegion}
          onChange={(e) => updateAddress("addressRegion", e.target.value)}
          autoComplete="address-level1"
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Postal Code"
          value={data.address.postalCode}
          onChange={(e) => updateAddress("postalCode", e.target.value)}
          autoComplete="postal-code"
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Country"
          value={data.address.addressCountry}
          onChange={(e) => updateAddress("addressCountry", e.target.value)}
          autoComplete="country"
        />
      </div>

      <OpeningHoursEditor
        value={data.openingHours}
        onChange={(val) => update("openingHours", val)}
      />

      {/* Nonprofit-specific */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Mission
          <Tooltip text="Main mission or purpose of your nonprofit organization." />
        </label>
        <textarea
          className={styles.textarea}
          value={data.mission}
          onChange={(e) => update("mission", e.target.value)}
        />
      </div>

      <input
        type="url"
        className={styles.input}
        placeholder="Donation URL"
        value={data.donationUrl}
        onChange={(e) => update("donationUrl", e.target.value)}
      />
      <input
        type="url"
        className={styles.input}
        placeholder="Volunteer URL"
        value={data.volunteerUrl}
        onChange={(e) => update("volunteerUrl", e.target.value)}
      />
      <input
        type="text"
        className={styles.input}
        placeholder="Tax ID"
        value={data.taxID}
        onChange={(e) => update("taxID", e.target.value)}
      />
      <input
        type="text"
        className={styles.input}
        placeholder="501(c)(3) Status"
        value={data.nonprofitStatus}
        onChange={(e) => update("nonprofitStatus", e.target.value)}
      />

      {/* Optional Arrays (founders, social, etc.) */}
      {[
        "founder",
        "sameAs",
        "areaServed",
        "knowsAbout",
        "seeks",
        "memberOf",
        "funder",
        "event",
        "subOrganization",
      ].map((field) => (
        <div className={styles.formGroup} key={field}>
          <label className={styles.label}>{field}</label>
          {data[field]?.map((item, idx) => (
            <div key={idx} className={styles.formRow}>
              <input
                className={styles.input}
                value={item}
                onChange={(e) => updateArray(field, idx, e.target.value)}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeArrayItem(field, idx)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => addArrayItem(field)}
          >
            + Add {field}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder (Crash-Safe) */
/* ================================================================== */
export function buildNonProfitOrganizationJson(data) {
  if (!data?.name) return null;

  const openingHours = data.openingHours
    ?.map((row) =>
      row.opens && row.closes && row.dayOfWeek
        ? `${row.dayOfWeek} ${row.opens}-${row.closes}`
        : null,
    )
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    ...(data.id && { "@id": data.id }),
    name: data.name,
    url: data.url || undefined,
    description: data.description || undefined,
    email: data.email || undefined,
    telephone: data.telephone || undefined,
    address: data.address?.streetAddress
      ? { "@type": "PostalAddress", ...data.address }
      : undefined,
    openingHours: openingHours.length ? openingHours : undefined,
    mission: data.mission || undefined,
    donationUrl: data.donationUrl || undefined,
    volunteerUrl: data.volunteerUrl || undefined,
    taxID: data.taxID || undefined,
    nonprofitStatus: data.nonprofitStatus || undefined,
    logo: data.logo || undefined,
    image: data.images?.length ? data.images : undefined,
    sameAs: data.sameAs?.length ? data.sameAs : undefined,
    founder: data.founder?.length
      ? data.founder.map((n) => ({ "@type": "Person", name: n }))
      : undefined,
    foundingDate: data.foundingDate || undefined,
    areaServed: data.areaServed?.length ? data.areaServed : undefined,
    knowsAbout: data.knowsAbout?.length ? data.knowsAbout : undefined,
    seeks: data.seeks?.length ? data.seeks : undefined,
    memberOf: data.memberOf?.length
      ? data.memberOf.map((n) => ({ "@type": "Organization", name: n }))
      : undefined,
    funder: data.funder?.length
      ? data.funder.map((f) => ({ "@type": "Organization", name: f }))
      : undefined,
    event: data.event?.length ? data.event : undefined,
    subOrganization: data.subOrganization?.length
      ? data.subOrganization
      : undefined,
  };
}
