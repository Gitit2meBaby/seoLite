import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Person Schema Editor with Recommended Properties */
/* ================================================================== */
export default function PersonSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    givenName: "",
    familyName: "",
    additionalName: "",
    honorificPrefix: "",
    honorificSuffix: "",
    jobTitle: "",
    description: "",
    images: [],
    sameAs: [],
    email: "",
    telephone: "",
    url: "",
    address: { addressLocality: "", addressRegion: "", addressCountry: "" },
    birthDate: "",
    birthPlace: "",
    nationality: "",
    gender: "",
    alumniOf: [],
    worksFor: { name: "" },
    memberOf: [],
    award: [],
    knowsAbout: [],
    knowsLanguage: [],
    colleague: [],
    brand: "",
    owns: [],
    seeks: [],
    ...value,
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateAddress = (field, val) =>
    setData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: val },
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
      {/* Core */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Full Name *</label>
        <input
          type="text"
          className={styles.input}
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Given Name</label>
        <input
          type="text"
          className={styles.input}
          value={data.givenName}
          onChange={(e) => update("givenName", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Family Name</label>
        <input
          type="text"
          className={styles.input}
          value={data.familyName}
          onChange={(e) => update("familyName", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Additional Name / Middle Name</label>
        <input
          type="text"
          className={styles.input}
          value={data.additionalName}
          onChange={(e) => update("additionalName", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Honorific Prefix</label>
        <input
          type="text"
          className={styles.input}
          value={data.honorificPrefix}
          onChange={(e) => update("honorificPrefix", e.target.value)}
          placeholder="Dr."
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Honorific Suffix</label>
        <input
          type="text"
          className={styles.input}
          value={data.honorificSuffix}
          onChange={(e) => update("honorificSuffix", e.target.value)}
          placeholder="PhD"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Job Title</label>
        <input
          type="text"
          className={styles.input}
          value={data.jobTitle}
          onChange={(e) => update("jobTitle", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* Contact / Social */}
      <ArrayFieldEditor
        title="Images"
        field="images"
        data={data}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
        updateArray={updateArray}
        placeholder="https://example.com/photo.jpg"
      />

      <ArrayFieldEditor
        title="Social Profiles / URLs"
        field="sameAs"
        data={data}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
        updateArray={updateArray}
        placeholder="https://twitter.com/johndoe"
      />

      <div className={styles.formGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={styles.input}
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Telephone</label>
        <input
          type="tel"
          className={styles.input}
          value={data.telephone}
          onChange={(e) => update("telephone", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Website URL</label>
        <input
          type="url"
          className={styles.input}
          value={data.url}
          onChange={(e) => update("url", e.target.value)}
        />
      </div>

      {/* Address */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Address</label>
        <input
          type="text"
          className={styles.input}
          value={data.address.addressLocality}
          onChange={(e) => updateAddress("addressLocality", e.target.value)}
          placeholder="City"
        />
        <input
          type="text"
          className={styles.input}
          value={data.address.addressRegion}
          onChange={(e) => updateAddress("addressRegion", e.target.value)}
          placeholder="Region/State"
        />
        <input
          type="text"
          className={styles.input}
          value={data.address.addressCountry}
          onChange={(e) => updateAddress("addressCountry", e.target.value)}
          placeholder="Country"
        />
      </div>

      {/* Personal Details */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Birth Date</label>
        <input
          type="date"
          className={styles.input}
          value={data.birthDate}
          onChange={(e) => update("birthDate", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Birth Place</label>
        <input
          type="text"
          className={styles.input}
          value={data.birthPlace}
          onChange={(e) => update("birthPlace", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Nationality</label>
        <input
          type="text"
          className={styles.input}
          value={data.nationality}
          onChange={(e) => update("nationality", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Gender</label>
        <select
          className={styles.select}
          value={data.gender}
          onChange={(e) => update("gender", e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="NonBinary">Non-binary</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder for Person with Recommended Properties */
/* ================================================================== */
export function buildPersonJson(data) {
  if (!data?.name) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    givenName: data.givenName || undefined,
    familyName: data.familyName || undefined,
    additionalName: data.additionalName || undefined,
    honorificPrefix: data.honorificPrefix || undefined,
    honorificSuffix: data.honorificSuffix || undefined,
    jobTitle: data.jobTitle || undefined,
    description: data.description || undefined,
    image: data.images?.length ? data.images : undefined,
    email: data.email || undefined,
    telephone: data.telephone || undefined,
    url: data.url || undefined,
    sameAs: data.sameAs?.length ? data.sameAs : undefined,
    address: data.address?.addressLocality
      ? {
          "@type": "PostalAddress",
          addressLocality: data.address.addressLocality,
          addressRegion: data.address.addressRegion,
          addressCountry: data.address.addressCountry,
        }
      : undefined,
    birthDate: data.birthDate || undefined,
    birthPlace: data.birthPlace || undefined,
    nationality: data.nationality || undefined,
    gender: data.gender || undefined,
    alumniOf: data.alumniOf?.length
      ? data.alumniOf.map((org) => ({
          "@type": "Organization",
          name: org.name || org,
        }))
      : undefined,
    worksFor: data.worksFor?.name
      ? { "@type": "Organization", name: data.worksFor.name }
      : undefined,
    memberOf: data.memberOf?.length
      ? data.memberOf.map((org) => ({ "@type": "Organization", name: org }))
      : undefined,
    award: data.award?.length ? data.award : undefined,
    knowsAbout: data.knowsAbout?.length ? data.knowsAbout : undefined,
    knowsLanguage: data.knowsLanguage?.length ? data.knowsLanguage : undefined,
    colleague: data.colleague?.length
      ? data.colleague.map((name) => ({ "@type": "Person", name }))
      : undefined,
    brand: data.brand || undefined,
    owns: data.owns?.length ? data.owns : undefined,
    seeks: data.seeks?.length ? data.seeks : undefined,
  };
}

/* ================================================================== */
/* Array Field Editor Component for Reuse */
/* ================================================================== */
function ArrayFieldEditor({
  title,
  field,
  data,
  addArrayItem,
  removeArrayItem,
  updateArray,
  placeholder,
}) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldGroupTitle}>{title}</div>
      {data[field]?.map((item, i) => (
        <div key={i} className={styles.formRow}>
          <input
            type="text"
            className={styles.input}
            value={item}
            onChange={(e) => updateArray(field, i, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => removeArrayItem(field, i)}
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addButton}
        onClick={() => addArrayItem(field)}
      >
        + Add {title}
      </button>
    </div>
  );
}
