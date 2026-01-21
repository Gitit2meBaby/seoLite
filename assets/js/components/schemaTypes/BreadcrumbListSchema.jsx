// /components/schemaTypes/BreadcrumbListSchema.jsx

import { useState, useEffect } from "react";

/**
 * BreadcrumbList Schema Editor
 * Dynamic breadcrumb items with add/edit/delete
 */
export default function BreadcrumbListSchema({ value = [], onChange }) {
  const [items, setItems] = useState(value);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState({ name: "", url: "" });

  useEffect(() => {
    if (onChange) onChange(items);
  }, [items]);

  const handleChange = (field, val) => {
    setCurrentItem((prev) => ({ ...prev, [field]: val }));
  };

  const addOrUpdateItem = () => {
    if (!currentItem.name.trim() || !currentItem.url.trim()) return;

    if (editingIndex !== null) {
      // update existing
      const updated = [...items];
      updated[editingIndex] = currentItem;
      setItems(updated);
      setEditingIndex(null);
    } else {
      // add new
      setItems((prev) => [...prev, currentItem]);
    }
    setCurrentItem({ name: "", url: "" });
  };

  const editItem = (index) => {
    setCurrentItem(items[index]);
    setEditingIndex(index);
  };

  const deleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentItem({ name: "", url: "" });
    }
  };

  return (
    <div className="schema-form schema-breadcrumb">
      <div className="breadcrumb-inputs">
        <label>
          Name *
          <input
            type="text"
            value={currentItem.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>

        <label>
          URL *
          <input
            type="url"
            value={currentItem.url}
            onChange={(e) => handleChange("url", e.target.value)}
          />
        </label>

        <button type="button" onClick={addOrUpdateItem}>
          {editingIndex !== null ? "Update Item" : "Add Item"}
        </button>
      </div>

      {items.length > 0 && (
        <div className="breadcrumb-list">
          {items.map((item, i) => (
            <div key={i} className="breadcrumb-item">
              <strong>{i + 1}:</strong> {item.name} (
              <a href={item.url}>{item.url}</a>)
              <button type="button" onClick={() => editItem(i)}>
                Edit
              </button>
              <button type="button" onClick={() => deleteItem(i)}>
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
 * JSON-LD builder for BreadcrumbList
 */
export function buildBreadcrumbListJson(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const itemListElement = items
    .filter((i) => i.name && i.url)
    .map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      item: i.url,
    }));

  if (itemListElement.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}
