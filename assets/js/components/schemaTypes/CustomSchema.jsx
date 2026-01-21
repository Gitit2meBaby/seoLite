// /components/schemaTypes/CustomSchema.jsx
import { useState, useEffect } from "react";
import styles from "@css/components/tabs/SchemaTab.module.scss";
import Tooltip from "./Tooltip";

/**
 * Custom Schema Editor
 * Allows users to create arbitrary key/value pairs for any schema type
 */
export default function CustomSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);
  const [currentPair, setCurrentPair] = useState({ key: "", value: "" });
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setCurrentPair((prev) => ({ ...prev, [field]: val }));
  };

  const addOrUpdatePair = () => {
    if (!currentPair.key.trim()) return;

    setData((prev) => {
      const updated = { ...prev };
      updated[currentPair.key] = currentPair.value;
      return updated;
    });

    setCurrentPair({ key: "", value: "" });
    setEditingKey(null);
  };

  const editPair = (key) => {
    setCurrentPair({ key, value: data[key] });
    setEditingKey(key);
  };

  const deletePair = (key) => {
    setData((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

    if (editingKey === key) {
      setEditingKey(null);
      setCurrentPair({ key: "", value: "" });
    }
  };

  return (
    <div className={`${styles.schemaForm} ${styles.schemaCustom}`}>
      {/* Input for new key/value pair */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Add Custom Property</div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Key *
              <Tooltip text="Enter the property name for the schema. Example: 'audience', 'publisher', 'exampleField'." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={currentPair.key}
              onChange={(e) => handleChange("key", e.target.value)}
              placeholder="Enter property name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Value
              <Tooltip text="Enter the value for this property. Can be string, number, boolean, or JSON." />
            </label>
            <input
              type="text"
              className={styles.input}
              value={currentPair.value}
              onChange={(e) => handleChange("value", e.target.value)}
              placeholder="Enter value"
            />
          </div>
        </div>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={addOrUpdatePair}
        >
          {editingKey !== null ? "Update Property" : "Add Property"}
        </button>
      </div>

      {/* Display existing key/value pairs */}
      {Object.keys(data).length > 0 && (
        <div className={styles.fieldGroup}>
          <div className={styles.fieldGroupTitle}>Custom Properties</div>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className={styles.formRow}>
              <div className={styles.formGroup}>
                <strong>{key}:</strong> {value.toString()}
              </div>
              <div className={styles.formGroup}>
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => editPair(key)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => deletePair(key)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * JSON-LD builder for Custom Schema
 * @param {object} data - key/value object
 * @param {string} type - optional @type for schema
 */
export function buildCustomJson(data, type = "Thing") {
  if (!data || Object.keys(data).length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };
}
