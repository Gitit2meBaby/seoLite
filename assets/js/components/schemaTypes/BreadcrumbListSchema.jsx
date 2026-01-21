// /components/schemaTypes/BreadcrumbListSchema.jsx

import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/**
 * BreadcrumbList Schema Editor
 * - Defines page breadcrumb hierarchy
 * - Used by Google for breadcrumb rich results
 */
export default function BreadcrumbListSchema({ value = {}, onChange }) {
  const [data, setData] = useState(
    value || {
      id: "",
      items: [],
    },
  );

  const [currentItem, setCurrentItem] = useState({
    name: "",
    url: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  function update(field, val) {
    setData((prev) => ({ ...prev, [field]: val }));
  }

  function updateCurrent(field, val) {
    setCurrentItem((prev) => ({ ...prev, [field]: val }));
  }

  function addOrUpdateItem() {
    if (!currentItem.name || !currentItem.url) return;

    setData((prev) => {
      const items = [...(prev.items || [])];

      if (editingIndex !== null) {
        items[editingIndex] = currentItem;
      } else {
        items.push(currentItem);
      }

      return { ...prev, items };
    });

    setCurrentItem({ name: "", url: "" });
    setEditingIndex(null);
  }

  function editItem(index) {
    setCurrentItem(data.items[index]);
    setEditingIndex(index);
  }

  function removeItem(index) {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentItem({ name: "", url: "" });
    }
  }

  return (
    <div className={styles.schemaForm}>
      {/* Advanced Settings */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Advanced Settings</div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            BreadcrumbList @id
            <Tooltip text="Optional unique identifier for this breadcrumb list. Useful when linking schemas together. Example: https://example.com/page#breadcrumb" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.id || ""}
            onChange={(e) => update("id", e.target.value)}
            placeholder="https://example.com/page#breadcrumb"
          />
        </div>
      </div>

      {/* Breadcrumb Item Editor */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Breadcrumb Item</div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Name
              <span className={styles.required}>*</span>
              <Tooltip text="The breadcrumb label as shown to users. Example: 'Blog' or 'Services'." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={currentItem.name}
              onChange={(e) => updateCurrent("name", e.target.value)}
              placeholder="Blog"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              URL
              <span className={styles.required}>*</span>
              <Tooltip text="The full URL this breadcrumb points to. Must match the actual page URL and include https://." />
            </label>
            <input
              type="url"
              className={styles.input}
              value={currentItem.url}
              onChange={(e) => updateCurrent("url", e.target.value)}
              placeholder="https://example.com/blog"
              required
            />
          </div>
        </div>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={addOrUpdateItem}
        >
          {editingIndex !== null ? "Update Breadcrumb" : "Add Breadcrumb"}
        </button>

        {data.items?.length > 0 && (
          <div className={styles.helpText}>
            {data.items.map((item, index) => (
              <div key={index}>
                {index + 1}. {item.name} — {item.url}{" "}
                <button
                  className={styles.editButton}
                  type="button"
                  onClick={() => editItem(index)}
                >
                  Edit
                </button>
                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * JSON-LD builder for BreadcrumbList
 */
export function buildBreadcrumbListJson(data) {
  if (!data?.items || data.items.length === 0) return null;

  const itemListElement = data.items
    .filter((item) => item.name && item.url)
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    }));

  if (itemListElement.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(data.id && { "@id": data.id }),
    itemListElement,
  };
}
