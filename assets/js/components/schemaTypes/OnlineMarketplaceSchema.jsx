import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Online Marketplace Schema Editor */
/* ================================================================== */
export default function OnlineMarketplaceSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    url: "",
    description: "",
    email: "",
    telephone: "",
    paymentAccepted: [],
    currenciesAccepted: [],
    hasOfferCatalog: "",
    ...value,
    paymentAccepted: value?.paymentAccepted || [],
    currenciesAccepted: value?.currenciesAccepted || [],
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
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
      {/* Marketplace Core Info */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Marketplace Name<span className={styles.required}>*</span>
          <Tooltip text="The official name of your online marketplace." />
        </label>
        <input
          type="text"
          className={styles.input}
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="My Marketplace"
          required
          autoComplete="organization"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Marketplace URL<span className={styles.required}>*</span>
          <Tooltip text="The main URL of your online marketplace." />
        </label>
        <input
          type="url"
          className={styles.input}
          value={data.url}
          onChange={(e) => update("url", e.target.value)}
          placeholder="https://example.com"
          required
          autoComplete="organization-url"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Description
          <Tooltip text="A short description of your marketplace and what it offers." />
        </label>
        <textarea
          className={styles.textarea}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe your marketplace..."
        />
      </div>

      {/* Payment & Currencies */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Payment & Currencies</div>

        {data.paymentAccepted.map((item, i) => (
          <div key={i} className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              value={item}
              onChange={(e) =>
                updateArray("paymentAccepted", i, e.target.value)
              }
              placeholder="Credit Card, PayPal..."
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeArrayItem("paymentAccepted", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={() => addArrayItem("paymentAccepted")}
        >
          + Add Payment Method
        </button>

        {data.currenciesAccepted.map((item, i) => (
          <div key={i} className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              value={item}
              onChange={(e) =>
                updateArray("currenciesAccepted", i, e.target.value)
              }
              placeholder="USD, EUR, VND..."
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeArrayItem("currenciesAccepted", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={() => addArrayItem("currenciesAccepted")}
        >
          + Add Currency
        </button>
      </div>

      {/* Offer Catalog */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Offer Catalog URL
          <Tooltip text="Optional URL to the catalog of products or services offered on this marketplace." />
        </label>
        <input
          type="url"
          className={styles.input}
          value={data.hasOfferCatalog}
          onChange={(e) => update("hasOfferCatalog", e.target.value)}
          placeholder="https://example.com/catalog"
        />
      </div>

      {/* Contact Info */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Contact Email</label>
        <input
          type="email"
          className={styles.input}
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="contact@example.com"
          autoComplete="email"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Telephone</label>
        <input
          type="tel"
          className={styles.input}
          value={data.telephone}
          onChange={(e) => update("telephone", e.target.value)}
          placeholder="+1-555-555-5555"
          autoComplete="tel"
        />
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder for Online Marketplace */
/* ================================================================== */
export function buildOnlineMarketplaceJson(data) {
  if (!data?.name || !data?.url) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    description: data.description || undefined,
    email: data.email || undefined,
    telephone: data.telephone || undefined,
    paymentAccepted: data.paymentAccepted?.length
      ? data.paymentAccepted
      : undefined,
    currenciesAccepted: data.currenciesAccepted?.length
      ? data.currenciesAccepted
      : undefined,
    hasOfferCatalog: data.hasOfferCatalog
      ? { "@type": "OfferCatalog", url: data.hasOfferCatalog }
      : undefined,
  };
}
