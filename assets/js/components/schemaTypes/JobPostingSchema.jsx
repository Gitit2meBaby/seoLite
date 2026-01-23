import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Job Posting Schema Editor (Null-Safe & Styled) */
/* ================================================================== */
export default function JobPostingSchema({ value, onChange }) {
  const [data, setData] = useState({
    employmentType: [],
    jobLocation: {},
    ...value,
    employmentType: value?.employmentType || [],
    jobLocation: value?.jobLocation || {},
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  /* ======================= Update Helpers ======================= */
  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));

  const updateJobLocation = (field, val) =>
    setData((prev) => ({
      ...prev,
      jobLocation: { ...prev.jobLocation, [field]: val },
    }));

  const updateEmploymentType = (index, val) => {
    const next = [...(data.employmentType || [])];
    next[index] = val;
    setData((prev) => ({ ...prev, employmentType: next }));
  };

  const addEmploymentType = () =>
    setData((prev) => ({
      ...prev,
      employmentType: [...(prev.employmentType || []), ""],
    }));

  const removeEmploymentType = (index) =>
    setData((prev) => ({
      ...prev,
      employmentType: (prev.employmentType || []).filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Job Info */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Job Title *<span className={styles.required}>*</span>
          <Tooltip text="The title of the job position." />
        </label>
        <input
          type="text"
          className={styles.input}
          value={data.title || ""}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Software Engineer"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Job Description *<span className={styles.required}>*</span>
          <Tooltip text="Full description of the job, responsibilities, and requirements." />
        </label>
        <textarea
          className={styles.textarea}
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe the job..."
          required
        />
      </div>

      {/* Hiring Organization */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Hiring Organization Name *<span className={styles.required}>*</span>
          <Tooltip text="The name of the company or organization hiring." />
        </label>
        <input
          type="text"
          className={styles.input}
          value={data.hiringOrganizationName || ""}
          onChange={(e) => update("hiringOrganizationName", e.target.value)}
          placeholder="Example Corp"
          autoComplete="organization"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Hiring Organization Logo URL
          <Tooltip text="Optional logo of the hiring company." />
        </label>
        <input
          type="url"
          className={styles.input}
          value={data.hiringOrganizationLogo || ""}
          onChange={(e) => update("hiringOrganizationLogo", e.target.value)}
          placeholder="https://example.com/logo.png"
          autoComplete="organization-url"
        />
      </div>

      {/* Job Location */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Job Location</div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Street Address
            <input
              type="text"
              className={styles.input}
              value={data.jobLocation.streetAddress || ""}
              onChange={(e) =>
                updateJobLocation("streetAddress", e.target.value)
              }
              placeholder="123 Main St"
            />
          </label>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              City
              <input
                type="text"
                className={styles.input}
                value={data.jobLocation.addressLocality || ""}
                onChange={(e) =>
                  updateJobLocation("addressLocality", e.target.value)
                }
                placeholder="Melbourne"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              State / Region
              <input
                type="text"
                className={styles.input}
                value={data.jobLocation.addressRegion || ""}
                onChange={(e) =>
                  updateJobLocation("addressRegion", e.target.value)
                }
                placeholder="VIC"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Postal Code
              <input
                type="text"
                className={styles.input}
                value={data.jobLocation.postalCode || ""}
                onChange={(e) =>
                  updateJobLocation("postalCode", e.target.value)
                }
                placeholder="3000"
                autoComplete="postal-code"
              />
            </label>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Country
            <input
              type="text"
              className={styles.input}
              value={data.jobLocation.addressCountry || ""}
              onChange={(e) =>
                updateJobLocation("addressCountry", e.target.value)
              }
              placeholder="Australia"
              autoComplete="country"
            />
          </label>
        </div>
      </div>

      {/* Employment Type */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Employment Type</div>
        {(data.employmentType || []).map((type, i) => (
          <div key={i} className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              value={type || ""}
              onChange={(e) => updateEmploymentType(i, e.target.value)}
              placeholder="FullTime, PartTime, Contract..."
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeEmploymentType(i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={addEmploymentType}
        >
          + Add Employment Type
        </button>
      </div>

      {/* Dates & Salary */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Date Posted
            <input
              type="date"
              className={styles.input}
              value={data.datePosted || ""}
              onChange={(e) => update("datePosted", e.target.value)}
              onFocus={() => {
                if (!data.datePublished) {
                  update("datePosted", new Date().toISOString().slice(0, 16));
                }
              }}
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Valid Through
            <input
              type="date"
              className={styles.input}
              value={data.validThrough || ""}
              onChange={(e) => update("validThrough", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Salary Currency
            <input
              type="text"
              className={styles.input}
              value={data.salaryCurrency || ""}
              onChange={(e) => update("salaryCurrency", e.target.value)}
              placeholder="USD, AUD..."
            />
          </label>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Base Salary
            <input
              type="number"
              className={styles.input}
              value={data.baseSalary || ""}
              onChange={(e) => update("baseSalary", e.target.value)}
              placeholder="50000"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder for JobPosting (Null-Safe) */
/* ================================================================== */
export function buildJobPostingJson(data) {
  if (!data?.title || !data?.description || !data?.hiringOrganizationName)
    return null;

  const jobLocation = data.jobLocation?.streetAddress
    ? {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          streetAddress: data.jobLocation.streetAddress || "",
          addressLocality: data.jobLocation.addressLocality || "",
          addressRegion: data.jobLocation.addressRegion || "",
          postalCode: data.jobLocation.postalCode || "",
          addressCountry: data.jobLocation.addressCountry || "",
        },
      }
    : undefined;

  const hiringOrganization = {
    "@type": "Organization",
    name: data.hiringOrganizationName,
    ...(data.hiringOrganizationLogo
      ? { logo: data.hiringOrganizationLogo }
      : {}),
  };

  const baseSalary = data.baseSalary
    ? {
        "@type": "MonetaryAmount",
        currency: data.salaryCurrency || "USD",
        value: {
          "@type": "QuantitativeValue",
          value: data.baseSalary,
          unitText: "YEAR",
        },
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: data.title,
    description: data.description,
    datePosted: data.datePosted || undefined,
    validThrough: data.validThrough || undefined,
    employmentType: data.employmentType?.length
      ? data.employmentType
      : undefined,
    hiringOrganization,
    jobLocation,
    baseSalary,
  };
}
