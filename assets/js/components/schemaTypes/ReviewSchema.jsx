// /components/schemaTypes/ReviewSchema.jsx

import { useState, useEffect } from "react";

/**
 * Review Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function ReviewSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="schema-form schema-review">
      <label>
        Review Title / Name *
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </label>

      <label>
        Review Body
        <textarea
          value={data.reviewBody || ""}
          onChange={(e) => handleChange("reviewBody", e.target.value)}
        />
      </label>

      <label>
        Rating (1-5)
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={data.reviewRating || ""}
          onChange={(e) => handleChange("reviewRating", e.target.value)}
          placeholder="4.5"
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
        Date Published
        <input
          type="date"
          value={data.datePublished || ""}
          onChange={(e) => handleChange("datePublished", e.target.value)}
        />
      </label>

      <label>
        Item Reviewed (Product, Service, etc.)
        <input
          type="text"
          value={data.itemReviewed || ""}
          onChange={(e) => handleChange("itemReviewed", e.target.value)}
        />
      </label>

      <label>
        Aggregate Rating (JSON)
        <textarea
          value={data.aggregateRating || ""}
          onChange={(e) => handleChange("aggregateRating", e.target.value)}
          placeholder='{"@type":"AggregateRating","ratingValue":"4.5","reviewCount":"10"}'
        />
      </label>

      <label>
        Social Profiles / SameAs (comma separated)
        <input
          type="text"
          value={data.sameAs || ""}
          onChange={(e) => handleChange("sameAs", e.target.value)}
          placeholder="https://example.com, https://twitter.com/..."
        />
      </label>
    </form>
  );
}

/**
 * JSON-LD builder for Review
 */
export function buildReviewJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  let aggregateRatingObj;
  try {
    aggregateRatingObj = data.aggregateRating
      ? JSON.parse(data.aggregateRating)
      : undefined;
  } catch {
    aggregateRatingObj = undefined;
  }

  const reviewJson = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: data.name,
    ...(data.reviewBody && { reviewBody: data.reviewBody }),
    ...(data.reviewRating && {
      reviewRating: {
        "@type": "Rating",
        ratingValue: data.reviewRating,
        bestRating: "5",
        worstRating: "1",
      },
    }),
    ...(data.author && { author: { "@type": "Person", name: data.author } }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.itemReviewed && {
      itemReviewed: { "@type": "Thing", name: data.itemReviewed },
    }),
    ...(aggregateRatingObj && { aggregateRating: aggregateRatingObj }),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return reviewJson;
}
