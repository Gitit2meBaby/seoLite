import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

export default function ReviewSchema({ value, onChange }) {
  const emptyReview = {
    reviewerName: "",
    reviewerType: "Person",
    reviewBody: "",
    ratingValue: 5,
    bestRating: 5,
    worstRating: 1,
    datePublished: "",
    reviewAspect: "",
    ratingExplanation: "",
    positiveNotes: "",
    negativeNotes: "",
    publisher: "",
    associatedReview: "",
  };

  const [data, setData] = useState({
    itemReviewed: { name: "", type: "Product" },
    reviews: [],
    aggregateRating: {},
    ...value,
    itemReviewed: {
      name: value?.itemReviewed?.name || "",
      type: value?.itemReviewed?.type || "Product",
    },
    reviews: value?.reviews || [],
    aggregateRating: value?.aggregateRating || {},
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [currentReview, setCurrentReview] = useState({ ...emptyReview });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const updateItemReviewed = (field, val) =>
    setData((prev) => ({
      ...prev,
      itemReviewed: { ...(prev.itemReviewed || {}), [field]: val },
    }));

  const updateAggregate = (field, val) =>
    setData((prev) => ({
      ...prev,
      aggregateRating: { ...(prev.aggregateRating || {}), [field]: val },
    }));

  const handleReviewChange = (field, val) =>
    setCurrentReview((prev) => ({ ...prev, [field]: val }));

  const addOrUpdateReview = () => {
    if (!currentReview.reviewerName || !currentReview.reviewBody) return;

    const reviews = [...(data.reviews || [])];
    if (editingIndex !== null) {
      reviews[editingIndex] = { ...currentReview };
      setEditingIndex(null);
    } else reviews.push({ ...currentReview });

    setData((prev) => ({ ...prev, reviews }));
    setCurrentReview({ ...emptyReview });
  };

  const editReview = (idx) => {
    setCurrentReview({ ...(data.reviews?.[idx] || emptyReview) });
    setEditingIndex(idx);
  };

  const deleteReview = (idx) => {
    const reviews = (data.reviews || []).filter((_, i) => i !== idx);
    setData((prev) => ({ ...prev, reviews }));
    if (editingIndex === idx) setCurrentReview({ ...emptyReview });
    if (editingIndex === idx) setEditingIndex(null);
  };

  return (
    <div className={styles.schemaForm}>
      {/* Item Reviewed */}
      <div className={styles.fieldGroup}>
        <h4>Item Reviewed</h4>
        <div className={styles.formField}>
          <label>
            Name
            <Tooltip text="Name of the product, service, or business being reviewed" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.itemReviewed?.name || ""}
            onChange={(e) => updateItemReviewed("name", e.target.value)}
            placeholder="Product / Service Name"
          />
        </div>

        <div className={styles.formField}>
          <label>
            Type
            <Tooltip text="Type of the item being reviewed" />
          </label>
          <select
            className={styles.input}
            value={data.itemReviewed?.type || "Product"}
            onChange={(e) => updateItemReviewed("type", e.target.value)}
          >
            <option value="Product">Product</option>
            <option value="Service">Service</option>
            <option value="LocalBusiness">LocalBusiness</option>
            <option value="Organization">Organization</option>
          </select>
        </div>
      </div>

      {/* Aggregate Rating */}
      <div className={styles.fieldGroup}>
        <h4>Aggregate Rating</h4>
        <div className={styles.formField}>
          <label>
            Average Rating
            <Tooltip text="Overall rating from all reviews, typically between 1 and 5" />
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            className={styles.input}
            value={data.aggregateRating?.averageRating || ""}
            onChange={(e) =>
              updateAggregate("averageRating", parseFloat(e.target.value) || 0)
            }
            placeholder="Average Rating"
          />
        </div>
        <div className={styles.formField}>
          <label>
            Review Count
            <Tooltip text="Total number of reviews submitted" />
          </label>
          <input
            type="number"
            min="0"
            className={styles.input}
            value={data.aggregateRating?.reviewCount || ""}
            onChange={(e) =>
              updateAggregate("reviewCount", parseInt(e.target.value) || 0)
            }
            placeholder="Review Count"
          />
        </div>
      </div>

      {/* Single Review Editor */}
      <div className={styles.fieldGroup}>
        <h4>{editingIndex !== null ? "Edit Review" : "Add Review"}</h4>
        {Object.entries(currentReview).map(([field, value]) => {
          let type = "text";
          let minMax = {};
          if (field === "ratingValue") {
            type = "number";
            minMax = {
              min: currentReview.worstRating,
              max: currentReview.bestRating,
            };
          } else if (field === "datePublished") type = "date";

          // Friendly label and tooltip
          let label = field
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          let tooltipText = "";
          switch (field) {
            case "reviewerName":
              tooltipText =
                "Name of the person or organization leaving the review";
              break;
            case "reviewerType":
              tooltipText = "Type of reviewer: Person or Organization";
              break;
            case "reviewBody":
              tooltipText = "Full text of the review";
              break;
            case "ratingValue":
              tooltipText = "Score given by the reviewer";
              break;
            case "bestRating":
              tooltipText = "Maximum possible rating value";
              break;
            case "worstRating":
              tooltipText = "Minimum possible rating value";
              break;
            case "reviewAspect":
              tooltipText = "Aspect of the product or service being reviewed";
              break;
            case "ratingExplanation":
              tooltipText = "Explanation of the rating";
              break;
            case "positiveNotes":
              tooltipText = "Positive points mentioned by the reviewer";
              break;
            case "negativeNotes":
              tooltipText = "Negative points mentioned by the reviewer";
              break;
            case "publisher":
              tooltipText = "Publisher of the review, if applicable";
              break;
            case "associatedReview":
              tooltipText = "Optional link to another related review";
              break;
            default:
              tooltipText = "";
          }

          // Special case for reviewerType select
          if (field === "reviewerType") {
            return (
              <div key={field} className={styles.formField}>
                <label>{label}</label>
                <Tooltip text={tooltipText} />
                <select
                  className={styles.input}
                  value={currentReview.reviewerType}
                  onChange={(e) =>
                    handleReviewChange("reviewerType", e.target.value)
                  }
                >
                  <option value="Person">Person</option>
                  <option value="Organization">Organization</option>
                </select>
              </div>
            );
          }

          return (
            <div key={field} className={styles.formField}>
              <label>{label}</label>
              <Tooltip text={tooltipText} />
              {type === "text" || type === "number" ? (
                <input
                  type={type}
                  {...minMax}
                  className={styles.input}
                  value={currentReview[field] || ""}
                  onChange={(e) =>
                    handleReviewChange(
                      field,
                      type === "number"
                        ? parseFloat(e.target.value) || 0
                        : e.target.value,
                    )
                  }
                />
              ) : (
                <textarea
                  className={styles.textarea}
                  value={currentReview[field] || ""}
                  onChange={(e) => handleReviewChange(field, e.target.value)}
                />
              )}
            </div>
          );
        })}
        <button className={styles.secondaryButton} onClick={addOrUpdateReview}>
          {editingIndex !== null ? "Update Review" : "Add Review"}
        </button>
      </div>

      {/* Existing Reviews */}
      {(data.reviews || []).map((rev, i) => (
        <div key={i} className={styles.reviewCard}>
          <strong>{rev.reviewerName || "Anonymous"}</strong> (
          {rev.reviewerType || "Person"}) - {rev.ratingValue}/{rev.bestRating}
          <p>{rev.reviewBody || ""}</p>
          {rev.datePublished && <small>Published: {rev.datePublished}</small>}
          <div className={styles.buttonRow}>
            <button className={styles.editButton} onClick={() => editReview(i)}>
              Edit
            </button>
            <button
              className={styles.removeButton}
              onClick={() => deleteReview(i)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* JSON-LD Builder (Null Protected) */
export function buildReviewJson(data) {
  if (!data?.itemReviewed?.name) return null;

  const reviews = (data.reviews || []).map((r) => ({
    "@type": "Review",
    author: {
      "@type": r.reviewerType || "Person",
      name: r.reviewerName || "Anonymous",
    },
    reviewBody: r.reviewBody || "",
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.ratingValue || 5,
      bestRating: r.bestRating || 5,
      worstRating: r.worstRating || 1,
      ratingExplanation: r.ratingExplanation || undefined,
    },
    datePublished: r.datePublished || undefined,
    reviewAspect: r.reviewAspect || undefined,
    positiveNotes: r.positiveNotes ? [r.positiveNotes] : undefined,
    negativeNotes: r.negativeNotes ? [r.negativeNotes] : undefined,
    publisher: r.publisher
      ? { "@type": "Organization", name: r.publisher }
      : undefined,
    associatedReview: r.associatedReview || undefined,
  }));

  const aggregateRating =
    data.aggregateRating?.averageRating && data.aggregateRating?.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: data.aggregateRating.averageRating,
          reviewCount: data.aggregateRating.reviewCount,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": data.itemReviewed?.type || "Product",
    name: data.itemReviewed?.name || "",
    ...(aggregateRating && { aggregateRating }),
    ...(reviews.length && { review: reviews }),
  };
}
