import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Product Schema Editor */
/* ================================================================== */
export default function ProductSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    description: "",
    sku: "",
    gtin13: "",
    mpn: "",
    brand: "",
    manufacturer: "",
    url: "",
    images: [],
    colors: [],
    sizes: [],
    offers: [],
    reviews: [],
    additionalProperty: [],
    weight: "",
    width: "",
    height: "",
    depth: "",
    category: "",
    model: "",
    releaseDate: "",
    itemCondition: "",
    isRelatedTo: [],
    isSimilarTo: [],
    ...value,
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateArray = (field, index, val) => {
    const next = [...(data[field] || [])];
    next[index] = val;
    setData((prev) => ({ ...prev, [field]: next }));
  };
  const addArrayItem = (field, item = "") =>
    setData((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));
  const removeArrayItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Fields */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Product Name *
          <Tooltip text="Name of the product" />
        </label>
        <input
          type="text"
          className={styles.input}
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Description
          <Tooltip text="Short description" />
        </label>
        <textarea
          className={styles.textarea}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* Identifiers */}
      <div className={styles.formRow}>
        {["sku", "gtin13", "mpn"].map((field) => (
          <div className={styles.formGroup} key={field}>
            <label className={styles.label}>{field.toUpperCase()}</label>
            <input
              type="text"
              className={styles.input}
              value={data[field] || ""}
              onChange={(e) => update(field, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Brand & Manufacturer */}
      <div className={styles.formRow}>
        {["brand", "manufacturer"].map((field) => (
          <div className={styles.formGroup} key={field}>
            <label className={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              className={styles.input}
              value={data[field] || ""}
              onChange={(e) => update(field, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* URL */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Product URL</label>
        <input
          type="url"
          className={styles.input}
          value={data.url || ""}
          onChange={(e) => update("url", e.target.value)}
        />
      </div>

      {/* Arrays: Images, Colors, Sizes, Additional Properties, Reviews */}
      {["images", "colors", "sizes", "additionalProperty", "reviews"].map(
        (field) => (
          <ArrayFieldEditor
            key={field}
            title={field.charAt(0).toUpperCase() + field.slice(1)}
            field={field}
            data={data}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            updateArray={updateArray}
            placeholder={
              field === "images" ? "https://example.com/image.jpg" : ""
            }
          />
        ),
      )}
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder for Product */
/* ================================================================== */
export function buildProductJson(data) {
  if (!data?.name) return null;

  const offersArray =
    data.offers?.length > 0
      ? data.offers.map((o) => ({
          "@type": "Offer",
          price: o.price,
          priceCurrency: o.priceCurrency,
          availability: o.availability,
          itemCondition: o.itemCondition,
          seller: o.seller
            ? { "@type": "Organization", name: o.seller }
            : undefined,
          priceValidUntil: o.priceValidUntil,
          shippingDetails: o.shippingDetails,
          hasMerchantReturnPolicy: o.hasMerchantReturnPolicy,
          eligibleRegion: o.eligibleRegion,
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description || undefined,
    sku: data.sku || undefined,
    gtin13: data.gtin13 || undefined,
    mpn: data.mpn || undefined,
    brand: data.brand ? { "@type": "Brand", name: data.brand } : undefined,
    manufacturer: data.manufacturer
      ? { "@type": "Organization", name: data.manufacturer }
      : undefined,
    image: data.images?.length ? data.images : undefined,
    color: data.colors?.length ? data.colors : undefined,
    size: data.sizes?.length ? data.sizes : undefined,
    weight: data.weight || undefined,
    width: data.width || undefined,
    height: data.height || undefined,
    depth: data.depth || undefined,
    category: data.category || undefined,
    model: data.model || undefined,
    releaseDate: data.releaseDate || undefined,
    itemCondition: data.itemCondition || undefined,
    url: data.url || undefined,
    additionalProperty: data.additionalProperty?.length
      ? data.additionalProperty
      : undefined,
    isRelatedTo: data.isRelatedTo?.length ? data.isRelatedTo : undefined,
    isSimilarTo: data.isSimilarTo?.length ? data.isSimilarTo : undefined,
    aggregateRating: data.aggregateRating || undefined,
    review: data.reviews?.length ? data.reviews : undefined,
    offers: offersArray,
  };
}

/* ================================================================== */
/* Reusable Array Field Editor Component */
/* ================================================================== */
function ArrayFieldEditor({
  title,
  field,
  data,
  addArrayItem,
  removeArrayItem,
  updateArray,
  placeholder,
}) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldGroupTitle}>{title}</div>
      {data[field]?.map((item, i) => (
        <div key={i} className={styles.formRow}>
          <input
            type="text"
            className={styles.input}
            value={item}
            onChange={(e) => updateArray(field, i, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => removeArrayItem(field, i)}
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        className={styles.addButton}
        onClick={() => addArrayItem(field)}
      >
        + Add {title}
      </button>
    </div>
  );
}
