import { useEffect, useState } from "react";

import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* HowTo Schema Editor (Null-Safe & Styled) */
/* ================================================================== */
export default function HowToSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    description: "",
    prepTime: "",
    performTime: "",
    totalTime: "",
    yield: "",
    estimatedCost: "",
    image: "",
    video: "",
    supply: [],
    tool: [],
    steps: [],
    ...value,
    supply: value?.supply || [],
    tool: value?.tool || [],
    steps: value?.steps || [],
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  /* ======================= Update Helpers ======================= */
  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));

  const addArrayItem = (field, item) =>
    setData((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));

  const updateArrayItem = (field, index, val) => {
    const next = [...(data[field] || [])];
    next[index] = val;
    setData((prev) => ({ ...prev, [field]: next }));
  };

  const removeArrayItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));

  /* ======================= Steps Helpers ======================= */
  const addStep = () =>
    addArrayItem("steps", {
      name: "",
      text: "",
      image: "",
      video: "",
      tip: "",
      url: "",
    });

  const updateStep = (i, field, val) =>
    updateArrayItem("steps", i, { ...data.steps[i], [field]: val });

  const removeStep = (i) => removeArrayItem("steps", i);

  return (
    <div className={styles.schemaForm}>
      {/* Title & Description */}
      <div className={styles.formGroup}>
        <label className={styles.label}>HowTo Title *</label>
        <input
          type="text"
          className={styles.input}
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          placeholder="How to Make a Cake"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description *</label>
        <textarea
          className={styles.textarea}
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the process..."
          required
        />
      </div>

      {/* Media */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Main HowTo Image URL</label>
        <input
          type="url"
          className={styles.input}
          value={data.image || ""}
          onChange={(e) => update("image", e.target.value)}
          placeholder="https://example.com/howto.jpg"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Instructional Video URL</label>
        <input
          type="url"
          className={styles.input}
          value={data.video || ""}
          onChange={(e) => update("video", e.target.value)}
          placeholder="https://example.com/video.mp4"
        />
      </div>

      {/* Time & Yield */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Prep Time (ISO 8601)</label>
          <input
            type="text"
            className={styles.input}
            value={data.prepTime || ""}
            onChange={(e) => update("prepTime", e.target.value)}
            placeholder="PT15M"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Perform Time (ISO 8601)</label>
          <input
            type="text"
            className={styles.input}
            value={data.performTime || ""}
            onChange={(e) => update("performTime", e.target.value)}
            placeholder="PT45M"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Total Time (ISO 8601)</label>
          <input
            type="text"
            className={styles.input}
            value={data.totalTime || ""}
            onChange={(e) => update("totalTime", e.target.value)}
            placeholder="PT1H"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Yield</label>
          <input
            type="text"
            className={styles.input}
            value={data.yield || ""}
            onChange={(e) => update("yield", e.target.value)}
            placeholder="1 cake"
          />
        </div>
      </div>

      {/* Estimated Cost */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Estimated Cost</label>
        <input
          type="text"
          className={styles.input}
          value={data.estimatedCost || ""}
          onChange={(e) => update("estimatedCost", e.target.value)}
          placeholder="$20"
        />
      </div>

      {/* Supplies */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Supplies</div>
        {(data.supply || []).map((s, i) => (
          <div key={i} className={styles.formRow}>
            <input
              type="text"
              value={s.name || ""}
              placeholder="Flour"
              onChange={(e) =>
                updateArrayItem("supply", i, { ...s, name: e.target.value })
              }
            />
            <input
              type="number"
              min="0"
              value={s.requiredQuantity || ""}
              placeholder="Quantity"
              onChange={(e) =>
                updateArrayItem("supply", i, {
                  ...s,
                  requiredQuantity: Number(e.target.value),
                })
              }
            />
            <input
              type="text"
              value={s.estimatedCost?.value || ""}
              placeholder="Cost"
              onChange={(e) =>
                updateArrayItem("supply", i, {
                  ...s,
                  estimatedCost: {
                    "@type": "MonetaryAmount",
                    currency: "USD",
                    value: e.target.value,
                  },
                })
              }
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("supply", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() =>
            addArrayItem("supply", {
              name: "",
              requiredQuantity: 0,
              estimatedCost: {
                "@type": "MonetaryAmount",
                currency: "USD",
                value: "",
              },
            })
          }
        >
          + Add Supply
        </button>
      </div>

      {/* Tools */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Tools</div>
        {(data.tool || []).map((t, i) => (
          <div key={i} className={styles.formRow}>
            <input
              type="text"
              value={t.name || ""}
              placeholder="Mixing Bowl"
              onChange={(e) =>
                updateArrayItem("tool", i, { ...t, name: e.target.value })
              }
            />
            <input
              type="number"
              min="0"
              value={t.requiredQuantity || ""}
              placeholder="Quantity"
              onChange={(e) =>
                updateArrayItem("tool", i, {
                  ...t,
                  requiredQuantity: Number(e.target.value),
                })
              }
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("tool", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() =>
            addArrayItem("tool", { name: "", requiredQuantity: 0 })
          }
        >
          + Add Tool
        </button>
      </div>

      {/* Steps */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Steps</div>
        {(data.steps || []).map((s, i) => (
          <div key={i} className={styles.formRow}>
            <input
              type="text"
              value={s.name || ""}
              placeholder="Step Name"
              onChange={(e) => updateStep(i, "name", e.target.value)}
            />
            <textarea
              value={s.text || ""}
              placeholder="Step Instructions"
              onChange={(e) => updateStep(i, "text", e.target.value)}
            />
            <input
              type="url"
              value={s.image || ""}
              placeholder="Step Image URL"
              onChange={(e) => updateStep(i, "image", e.target.value)}
            />
            <input
              type="url"
              value={s.video || ""}
              placeholder="Step Video URL"
              onChange={(e) => updateStep(i, "video", e.target.value)}
            />
            <input
              type="text"
              value={s.tip || ""}
              placeholder="Tip / Advice"
              onChange={(e) => updateStep(i, "tip", e.target.value)}
            />
            <input
              type="url"
              value={s.url || ""}
              placeholder="Step URL"
              onChange={(e) => updateStep(i, "url", e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeStep(i)}
            >
              Delete Step
            </button>
          </div>
        ))}
        <button className={styles.addButton} type="button" onClick={addStep}>
          + Add Step
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder for HowTo (Null-Safe) */
/* ================================================================== */
export function buildHowToJson(data) {
  if (!data?.name || !data?.description) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    description: data.description,
    image: data.image || undefined,
    video: data.video
      ? {
          "@type": "VideoObject",
          name: `${data.name} Video`,
          description: data.description,
          contentUrl: data.video,
        }
      : undefined,
    prepTime: data.prepTime || undefined,
    performTime: data.performTime || undefined,
    totalTime: data.totalTime || undefined,
    yield: data.yield || undefined,
    estimatedCost: data.estimatedCost
      ? {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: data.estimatedCost,
        }
      : undefined,
    supply: (data.supply || []).map((s) => ({
      "@type": "HowToSupply",
      name: s.name || "",
      requiredQuantity: s.requiredQuantity || undefined,
      estimatedCost: s.estimatedCost || undefined,
    })),
    tool: (data.tool || []).map((t) => ({
      "@type": "HowToTool",
      name: t.name || "",
      requiredQuantity: t.requiredQuantity || undefined,
    })),
    step: (data.steps || []).map((s, i) => ({
      "@type": "HowToStep",
      name: s.name || `Step ${i + 1}`,
      text: s.text || "",
      image: s.image ? { "@type": "ImageObject", url: s.image } : undefined,
      video: s.video
        ? { "@type": "VideoObject", contentUrl: s.video }
        : undefined,
      tip: s.tip ? { "@type": "HowToTip", text: s.tip } : undefined,
      url: s.url || undefined,
      position: i + 1,
    })),
  };
}
