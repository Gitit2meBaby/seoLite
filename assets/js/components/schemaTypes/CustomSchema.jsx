// /components/schemaTypes/CustomSchema.jsx

import { useState, useEffect } from "react";

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
    <div className="schema-form schema-custom">
      <div className="custom-inputs">
        <label>
          Key *
          <input
            type="text"
            value={currentPair.key}
            onChange={(e) => handleChange("key", e.target.value)}
            placeholder="Enter property name"
          />
        </label>

        <label>
          Value
          <input
            type="text"
            value={currentPair.value}
            onChange={(e) => handleChange("value", e.target.value)}
            placeholder="Enter value (string, number, JSON...)"
          />
        </label>

        <button type="button" onClick={addOrUpdatePair}>
          {editingKey !== null ? "Update" : "Add"}
        </button>
      </div>

      {Object.keys(data).length > 0 && (
        <div className="custom-list">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="custom-item">
              <strong>{key}:</strong> {value.toString()}
              <button type="button" onClick={() => editPair(key)}>
                Edit
              </button>
              <button type="button" onClick={() => deletePair(key)}>
                Delete
              </button>
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
