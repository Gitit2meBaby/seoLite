// /components/schemaTypes/HowToSchema.jsx

import { useState, useEffect } from "react";

/**
 * HowTo Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function HowToSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="schema-form schema-howto">
      <label>
        HowTo Name / Title *
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </label>

      <label>
        Total Time (ISO 8601)
        <input
          type="text"
          value={data.totalTime || ""}
          onChange={(e) => handleChange("totalTime", e.target.value)}
          placeholder="PT30M"
        />
      </label>

      <label>
        Estimated Cost (JSON)
        <textarea
          value={data.estimatedCost || ""}
          onChange={(e) => handleChange("estimatedCost", e.target.value)}
          placeholder='{"@type":"MonetaryAmount","currency":"USD","value":"10"}'
        />
      </label>

      <label>
        Step by Step Instructions (one per line)
        <textarea
          value={data.step || ""}
          onChange={(e) => handleChange("step", e.target.value)}
          placeholder="Step 1: ..., Step 2: ..."
        />
      </label>

      <label>
        Supply / Materials (comma separated)
        <input
          type="text"
          value={data.supply || ""}
          onChange={(e) => handleChange("supply", e.target.value)}
          placeholder="Item 1, Item 2"
        />
      </label>

      <label>
        Tools (comma separated)
        <input
          type="text"
          value={data.tool || ""}
          onChange={(e) => handleChange("tool", e.target.value)}
          placeholder="Tool 1, Tool 2"
        />
      </label>

      <label>
        Author Name
        <input
          type="text"
          value={data.author || ""}
          onChange={(e) => handleChange("author", e.target.value)}
          placeholder="John Doe"
        />
      </label>

      <label>
        Image URL(s) (comma separated)
        <input
          type="text"
          value={data.image || ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </label>

      <label>
        Video URL
        <input
          type="url"
          value={data.video || ""}
          onChange={(e) => handleChange("video", e.target.value)}
          placeholder="https://youtube.com/..."
        />
      </label>

      <label>
        Social Profiles / SameAs (comma separated)
        <input
          type="text"
          value={data.sameAs || ""}
          onChange={(e) => handleChange("sameAs", e.target.value)}
          placeholder="https://facebook.com, https://twitter.com"
        />
      </label>
    </form>
  );
}

/**
 * JSON-LD builder for HowTo
 */
export function buildHowToJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const imageArray = data.image
    ? data.image
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const stepsArray = data.step
    ? data.step
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const suppliesArray = data.supply
    ? data.supply
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const toolsArray = data.tool
    ? data.tool
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : undefined;

  let estimatedCostObj;
  try {
    estimatedCostObj = data.estimatedCost
      ? JSON.parse(data.estimatedCost)
      : undefined;
  } catch {
    estimatedCostObj = undefined;
  }

  const json = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.totalTime && { totalTime: data.totalTime }),
    ...(estimatedCostObj && { estimatedCost: estimatedCostObj }),
    ...(stepsArray && {
      step: stepsArray.map((stepText) => ({
        "@type": "HowToStep",
        text: stepText,
      })),
    }),
    ...(suppliesArray && {
      supply: suppliesArray.map((s) => ({ "@type": "HowToSupply", name: s })),
    }),
    ...(toolsArray && {
      tool: toolsArray.map((t) => ({ "@type": "HowToTool", name: t })),
    }),
    ...(data.author && { author: { "@type": "Person", name: data.author } }),
    ...(imageArray && { image: imageArray }),
    ...(data.video && { video: { "@type": "VideoObject", url: data.video } }),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return json;
}
