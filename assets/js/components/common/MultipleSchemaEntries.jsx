import { useState } from "react";
import styles from "@css/components/tabs/SocialMedia.module.scss";

const MultipleSchemaEntries = ({
  schemaType,
  fieldDefinitions,
  fields,
  value = [],
  onChange,
  baseClasses,
}) => {
  const entries = Array.isArray(value) && value.length > 0 ? value : [{}];

  const addEntry = () => {
    onChange([...entries, {}]);
  };

  const removeEntry = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index, fieldKey, fieldValue) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [fieldKey]: fieldValue,
    };
    onChange(newEntries);
  };

  return (
    <div className={styles.multipleEntriesContainer}>
      {entries.map((entry, entryIndex) => (
        <div key={entryIndex} className={styles.entryForm}>
          <div className={styles.entryHeader}>
            <h4>
              {schemaType} {entryIndex + 1}
            </h4>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(entryIndex)}
                className={styles.removeButton}
              >
                Remove
              </button>
            )}
          </div>

          <div className={styles.entryFields}>
            {fields.map((fieldKey) => {
              const fieldDef = fieldDefinitions[fieldKey];
              if (!fieldDef) return null;

              return (
                <div key={fieldKey} className={styles.field}>
                  <label className={styles.label}>{fieldDef.label}</label>

                  {renderFieldInput(
                    fieldKey,
                    fieldDef,
                    entry[fieldKey] || "",
                    (value) => updateEntry(entryIndex, fieldKey, value),
                    baseClasses,
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button type="button" onClick={addEntry} className={styles.addButton}>
        + Add Another {schemaType}
      </button>
    </div>
  );
};

// Helper to render different field types
const renderFieldInput = (fieldKey, fieldDef, value, onChange, baseClasses) => {
  switch (fieldDef.type) {
    case "textarea":
      return (
        <textarea
          className={`${styles.textarea} ${baseClasses}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fieldDef.placeholder}
          rows={fieldDef.rows || 3}
        />
      );

    case "select":
      return (
        <select
          className={`${styles.select} ${baseClasses}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {fieldDef.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "number":
      return (
        <input
          type="number"
          className={`${styles.input} ${baseClasses}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fieldDef.placeholder}
          step="0.01"
        />
      );

    case "date":
      return (
        <input
          type="date"
          className={`${styles.input} ${baseClasses}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "object":
      if (fieldDef.subfields) {
        const objectValue = typeof value === "object" ? value : {};
        return (
          <div className={styles.objectFields}>
            {Object.keys(fieldDef.subfields).map((subKey) => {
              const subField = fieldDef.subfields[subKey];
              return (
                <div key={subKey} className={styles.subField}>
                  <label className={styles.subLabel}>{subField.label}</label>
                  <input
                    type={subField.type}
                    className={`${styles.input} ${baseClasses}`}
                    value={objectValue[subKey] || ""}
                    onChange={(e) => {
                      onChange({
                        ...objectValue,
                        [subKey]: e.target.value,
                      });
                    }}
                    placeholder={subField.placeholder}
                  />
                </div>
              );
            })}
          </div>
        );
      }
      break;

    default:
      return (
        <input
          type={fieldDef.type || "text"}
          className={`${styles.input} ${baseClasses}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={fieldDef.placeholder}
          maxLength={fieldDef.maxLength}
        />
      );
  }
};

export default MultipleSchemaEntries;
