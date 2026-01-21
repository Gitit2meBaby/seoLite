import { useEffect, useState } from "react";

import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* FAQPage Schema Editor (Null-Safe & Styled) */
/* ================================================================== */
export default function FaqPageSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    description: "",
    mainEntity: [],
    ...value,
    mainEntity: value?.mainEntity || [],
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  /* ======================= Update Functions ======================= */
  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));

  const addQA = () =>
    setData((prev) => ({
      ...prev,
      mainEntity: [...(prev.mainEntity || []), { question: "", answer: "" }],
    }));

  const updateQA = (index, field, val) => {
    const next = [...(data.mainEntity || [])];
    next[index] = { ...next[index], [field]: val };
    setData((prev) => ({ ...prev, mainEntity: next }));
  };

  const removeQA = (index) =>
    setData((prev) => ({
      ...prev,
      mainEntity: (prev.mainEntity || []).filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Page Title */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          FAQ Page Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Frequently Asked Questions"
          required
        />
      </div>

      {/* Description */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Description <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="This FAQ page covers common questions about our service..."
          required
        />
      </div>

      {/* Questions & Answers */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Questions & Answers</div>
        {(data.mainEntity || []).map((qa, i) => (
          <div key={i} className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Question *</label>
              <input
                type="text"
                className={styles.input}
                value={qa.question || ""}
                onChange={(e) => updateQA(i, "question", e.target.value)}
                placeholder={`Question ${i + 1}`}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Answer *</label>
              <textarea
                className={styles.textarea}
                value={qa.answer || ""}
                onChange={(e) => updateQA(i, "answer", e.target.value)}
                placeholder={`Answer ${i + 1}`}
                required
              />
            </div>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeQA(i)}
            >
              Delete Q&A
            </button>
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={addQA}>
          + Add Question
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder for FAQPage (Null-Safe) */
/* ================================================================== */
export function buildFaqPageJson(data) {
  if (!data?.name || !data?.description) return null;

  const mainEntity = (data.mainEntity || [])
    .filter((qa) => qa?.question && qa?.answer)
    .map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    }));

  if (!mainEntity.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: data.name,
    description: data.description,
    mainEntity,
  };
}
