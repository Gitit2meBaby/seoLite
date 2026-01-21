import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/**
 * WebSite Schema Editor
 */
export default function WebSiteSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    url: "",
    id: "",
    description: "",
    inLanguage: "",
    alternateName: "",
    searchUrl: "",
    publisher: "",
    ...value,
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));

  return (
    <div className={styles.schemaForm}>
      {/* Website Identity */}
      <div className={styles.fieldGroup}>
        <h4>Website Identity</h4>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>
              Website Name *
              <Tooltip content="The official name of your website or brand." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={data.name || ""}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Example: My Website"
              required
            />
          </div>

          <div className={styles.formField}>
            <label>
              Website URL *
              <Tooltip content="The canonical homepage URL of your website." />
            </label>
            <input
              type="url"
              className={styles.input}
              value={data.url || ""}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
        </div>
      </div>

      {/* Schema Identity */}
      <div className={styles.fieldGroup}>
        <h4>Schema Identity</h4>
        <div className={styles.formField}>
          <label>
            Website @id
            <Tooltip content="A stable identifier for this website schema. Usually your homepage URL with #website." />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.id || ""}
            onChange={(e) => update("id", e.target.value)}
            placeholder="https://example.com/#website"
          />
        </div>
      </div>

      {/* Metadata */}
      <div className={styles.fieldGroup}>
        <h4>Metadata</h4>
        <div className={styles.formField}>
          <label>
            Description
            <Tooltip content="A short description of what your website is about." />
          </label>
          <textarea
            className={styles.textarea}
            value={data.description || ""}
            onChange={(e) => update("description", e.target.value)}
            maxLength={300}
            placeholder="Example: Professional services and solutions for your business."
          />
          <small>{(data.description || "").length} / 300</small>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label>
              In Language
              <Tooltip content="Primary language of your website (BCP-47 code)." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={data.inLanguage || ""}
              onChange={(e) => update("inLanguage", e.target.value)}
              placeholder="en-AU"
            />
          </div>

          <div className={styles.formField}>
            <label>
              Alternate Name
              <Tooltip content="Optional shorter or alternate name for your website." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={data.alternateName || ""}
              onChange={(e) => update("alternateName", e.target.value)}
              placeholder="Example: MySite"
            />
          </div>
        </div>
      </div>

      {/* Site Search */}
      <div className={styles.fieldGroup}>
        <h4>Site Search (Optional)</h4>
        <div className={styles.formField}>
          <label>
            Search URL Template
            <Tooltip content="Enable Google sitelinks search box. Use {search_term_string} as the placeholder." />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.searchUrl || ""}
            onChange={(e) => update("searchUrl", e.target.value)}
            placeholder="https://example.com/search?q={search_term_string}"
          />
        </div>
      </div>

      {/* Publisher */}
      <div className={styles.fieldGroup}>
        <h4>Publisher</h4>
        <div className={styles.formField}>
          <label>
            Publisher Name
            <Tooltip content="The organisation that owns or publishes the website." />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.publisher || ""}
            onChange={(e) => update("publisher", e.target.value)}
            placeholder="Example: My Company Pty Ltd"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * JSON-LD builder for WebSite (null-safe)
 */
export function buildWebSiteJson(data) {
  if (!data?.name || !data?.url) return null;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    url: data.url,
    ...(data.id && { "@id": data.id }),
    ...(data.alternateName && { alternateName: data.alternateName }),
    ...(data.description && { description: data.description }),
    ...(data.inLanguage && { inLanguage: data.inLanguage }),
    ...(data.publisher && {
      publisher: { "@type": "Organization", name: data.publisher },
    }),
    ...(data.searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: data.searchUrl,
        "query-input": "required name=search_term_string",
      },
    }),
  };
}
