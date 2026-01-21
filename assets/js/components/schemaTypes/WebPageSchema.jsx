import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/**
 * WebPage Schema Editor
 */
export default function WebPageSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    url: "",
    description: "",
    inLanguage: "",
    isPartOf: "",
    breadcrumb: "",
    primaryImage: "",
    datePublished: "",
    dateModified: "",
    author: "",
    publisher: "",
    webPageType: "WebPage",
    id: "",
    about: "",
    ...value,
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Information */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Page Title <span className={styles.required}>*</span>
          <Tooltip text="The name of the webpage. Usually matches the page title or H1." />
        </label>
        <input
          type="text"
          className={styles.input}
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          placeholder="About Us"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Page URL <span className={styles.required}>*</span>
          <Tooltip text="The canonical URL of this webpage. Must include https:// and match the actual page URL." />
        </label>
        <input
          type="url"
          className={styles.input}
          value={data.url || ""}
          onChange={(e) => update("url", e.target.value)}
          placeholder="https://example.com/about"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Description
          <Tooltip text="Short summary of this page. Aim for 150–250 characters for best SEO results." />
        </label>
        <textarea
          className={styles.textarea}
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Brief description of this page..."
          maxLength={300}
        />
        {data.description && (
          <div className={styles.charCounter}>
            {data.description.length}/300 characters
          </div>
        )}
      </div>

      {/* Relationships */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Relationships</div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Is Part Of (Website)
            <Tooltip text="The website this page belongs to. Typically the homepage URL of your site." />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.isPartOf || ""}
            onChange={(e) => update("isPartOf", e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Breadcrumb Schema @id
            <Tooltip text="Reference to a BreadcrumbList schema @id associated with this page." />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.breadcrumb || ""}
            onChange={(e) => update("breadcrumb", e.target.value)}
            placeholder="https://example.com/about#breadcrumb"
          />
        </div>
      </div>

      {/* Media */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Primary Image URL
          <Tooltip text="The main image representing this page. Used in search and social previews." />
        </label>
        <input
          type="url"
          className={styles.input}
          value={data.primaryImage || ""}
          onChange={(e) => update("primaryImage", e.target.value)}
          placeholder="https://example.com/images/page-image.jpg"
        />
      </div>

      {/* Metadata */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Date Published
            <Tooltip text="The date this page was first published. Format: YYYY-MM-DD." />
          </label>
          <input
            type="date"
            className={styles.input}
            value={data.datePublished || ""}
            onChange={(e) => update("datePublished", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Date Modified
            <Tooltip text="The most recent date this page was updated." />
          </label>
          <input
            type="date"
            className={styles.input}
            value={data.dateModified || ""}
            onChange={(e) => update("dateModified", e.target.value)}
          />
        </div>
      </div>

      {/* Authority */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Authority</div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Author Name
              <Tooltip text="The person primarily responsible for this page’s content." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={data.author || ""}
              onChange={(e) => update("author", e.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Publisher Name
              <Tooltip text="The organization that publishes this page. Usually your company or website name." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={data.publisher || ""}
              onChange={(e) => update("publisher", e.target.value)}
              placeholder="Example Company"
            />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            WebPage Type
            <Tooltip text="Choose the most specific subtype for this page. Improves search understanding." />
          </label>
          <select
            className={styles.select}
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
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Page Language
            <Tooltip text="The primary language of this page using IETF BCP 47 format. Example: en, en-GB, fr." />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.inLanguage || ""}
            onChange={(e) => update("inLanguage", e.target.value)}
            placeholder="en"
          />
        </div>
      </div>

      {/* Advanced */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Advanced Settings</div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            WebPage @id
            <Tooltip text="Optional unique identifier for this webpage. Recommended for linking schemas together. Example: https://example.com/page#webpage" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.id || ""}
            onChange={(e) => update("id", e.target.value)}
            placeholder="https://example.com/page#webpage"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            About (Entity or Topic)
            <Tooltip text="What this page is about. Can reference a topic, person, place, or thing using a URL or name." />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.about || ""}
            onChange={(e) => update("about", e.target.value)}
            placeholder="Digital Marketing"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * JSON-LD builder for WebPage (null-safe)
 */
export function buildWebPageJson(data) {
  if (!data?.name || !data?.url) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": data.webPageType || "WebPage",
    ...(data.id && { "@id": data.id }),
    name: data.name,
    url: data.url,
    ...(data.description && { description: data.description }),
    ...(data.inLanguage && { inLanguage: data.inLanguage }),
    ...(data.isPartOf && {
      isPartOf: { "@type": "WebSite", "@id": data.isPartOf },
    }),
    ...(data.breadcrumb && {
      breadcrumb: { "@type": "BreadcrumbList", "@id": data.breadcrumb },
    }),
    ...(data.primaryImage && {
      primaryImageOfPage: { "@type": "ImageObject", url: data.primaryImage },
    }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
    ...(data.author && { author: { "@type": "Person", name: data.author } }),
    ...(data.publisher && {
      publisher: { "@type": "Organization", name: data.publisher },
    }),
    ...(data.about && { about: data.about }),
  };

  return json;
}
