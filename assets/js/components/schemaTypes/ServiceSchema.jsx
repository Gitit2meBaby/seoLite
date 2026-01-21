import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

export default function ServiceSchema({ value, onChange }) {
  const emptyChannel = { name: "", serviceUrl: "", servicePhone: "" };

  const [data, setData] = useState({
    name: "",
    description: "",
    serviceType: "",
    category: "",
    serviceOutput: "",
    provider: "",
    brand: "",
    url: "",
    termsOfService: "",
    areaServed: "",
    availableChannel: [],
    images: [],
    reviews: [],
    aggregateRating: {},
    ...value,
    availableChannel: value?.availableChannel || [],
    images: value?.images || [],
    reviews: value?.reviews || [],
    aggregateRating: value?.aggregateRating || {},
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
  const addArrayItem = (field, item = {}) =>
    setData((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));
  const removeArrayItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Service Overview */}
      <div className={styles.fieldGroup}>
        <h4>Service Overview</h4>
        {[
          {
            field: "name",
            label: "Service Name",
            required: true,
            tooltip: "Official name of the service",
            type: "text",
          },
          {
            field: "description",
            label: "Description",
            required: true,
            tooltip: "Clear description of the service",
            type: "textarea",
            maxLength: 500,
          },
          {
            field: "serviceType",
            label: "Service Type",
            tooltip:
              "Classification of the service e.g., Professional, Medical",
            type: "text",
          },
          {
            field: "category",
            label: "Category",
            tooltip: "More specific category of the service",
            type: "text",
          },
          {
            field: "serviceOutput",
            label: "Service Output",
            tooltip: "What the customer receives from this service",
            type: "text",
          },
        ].map(({ field, label, tooltip, required, type, maxLength }) => (
          <div key={field} className={styles.formField}>
            <label>
              {label}
              {required && <span className={styles.required}>*</span>}
            </label>
            {tooltip && <Tooltip content={tooltip} />}
            {type === "textarea" ? (
              <>
                <textarea
                  className={styles.input}
                  value={data[field] || ""}
                  onChange={(e) => update(field, e.target.value)}
                  maxLength={maxLength}
                  required={required}
                />
                {maxLength && (
                  <small>
                    {(data[field] || "").length} / {maxLength}
                  </small>
                )}
              </>
            ) : (
              <input
                className={styles.input}
                type={type}
                value={data[field] || ""}
                onChange={(e) => update(field, e.target.value)}
                required={required}
              />
            )}
          </div>
        ))}
      </div>

      {/* Provider & Branding */}
      <div className={styles.fieldGroup}>
        <h4>Provider & Branding</h4>
        {[
          {
            field: "provider",
            label: "Provider Name",
            tooltip: "The organization providing this service",
          },
          {
            field: "brand",
            label: "Brand",
            tooltip: "The brand name associated with the service",
          },
          {
            field: "url",
            label: "Service Page URL",
            tooltip: "URL of the service page",
            type: "url",
          },
          {
            field: "termsOfService",
            label: "Terms of Service URL",
            tooltip: "URL of terms of service",
            type: "url",
          },
        ].map(({ field, label, tooltip, type }) => (
          <div key={field} className={styles.formField}>
            <label>{label}</label>
            {tooltip && <Tooltip content={tooltip} />}
            <input
              type={type || "text"}
              className={styles.input}
              value={data[field] || ""}
              onChange={(e) => update(field, e.target.value)}
              placeholder={type === "url" ? "https://example.com" : undefined}
            />
          </div>
        ))}
      </div>

      {/* Location & Channels */}
      <div className={styles.fieldGroup}>
        <h4>Location & Channels</h4>
        <div className={styles.formField}>
          <label>Area Served</label>
          <Tooltip content="The geographic area where this service is offered" />
          <input
            className={styles.input}
            type="text"
            value={data.areaServed || ""}
            onChange={(e) => update("areaServed", e.target.value)}
            placeholder="City, State, Country"
          />
        </div>

        <div className={styles.formField}>
          <label>Available Channels</label>
          <Tooltip content="How customers can contact or access this service (phone, website, etc.)" />
          {(data.availableChannel || []).map((channel, i) => (
            <div key={i} className={styles.formRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="Channel Name"
                value={channel.name || ""}
                onChange={(e) =>
                  updateArray("availableChannel", i, {
                    ...channel,
                    name: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                type="url"
                placeholder="Service URL"
                value={channel.serviceUrl || ""}
                onChange={(e) =>
                  updateArray("availableChannel", i, {
                    ...channel,
                    serviceUrl: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                type="tel"
                placeholder="Service Phone"
                value={channel.servicePhone || ""}
                onChange={(e) =>
                  updateArray("availableChannel", i, {
                    ...channel,
                    servicePhone: e.target.value,
                  })
                }
              />
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => removeArrayItem("availableChannel", i)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className={styles.addButton}
            type="button"
            onClick={() =>
              addArrayItem("availableChannel", { ...emptyChannel })
            }
          >
            + Add Channel
          </button>
        </div>
      </div>
    </div>
  );
}

/* JSON-LD Builder */
export function buildServiceJson(data) {
  if (!data?.name || !data?.description) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    ...(data.id && { "@id": data.id }),
    name: data.name,
    description: data.description,
    ...(data.url && { url: data.url }),
    ...(data.provider && {
      provider: { "@type": "Organization", name: data.provider },
    }),
    ...(data.brand && { brand: { "@type": "Brand", name: data.brand } }),
    ...(data.areaServed && {
      areaServed: { "@type": "Place", name: data.areaServed },
    }),
    ...(data.serviceType && { serviceType: data.serviceType }),
    ...(data.category && { category: data.category }),
    ...(data.serviceOutput && { serviceOutput: data.serviceOutput }),
    ...(data.termsOfService && { termsOfService: data.termsOfService }),
    ...(data.availableChannel?.length > 0 && {
      availableChannel: data.availableChannel.map((ch) => ({
        "@type": "ServiceChannel",
        serviceLocation: ch.serviceLocation || {
          "@type": "Place",
          name: ch.name || "",
        },
        ...(ch.serviceUrl && { serviceUrl: ch.serviceUrl }),
        ...(ch.servicePhone && { servicePhone: ch.servicePhone }),
      })),
    }),
    ...(data.aggregateRating && { aggregateRating: data.aggregateRating }),
    ...(data.reviews?.length > 0 && { review: data.reviews }),
    ...(data.hoursAvailable && { hoursAvailable: data.hoursAvailable }),
    ...(data.broker && {
      broker: { "@type": "Organization", name: data.broker },
    }),
    ...(data.serviceArea && {
      serviceArea: { "@type": "Place", name: data.serviceArea },
    }),
    ...(data.images?.length > 0 && { image: data.images }),
  };
}
