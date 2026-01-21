import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Course Schema Editor with Instances, Pricing & Ratings (Null-safe) */
/* ================================================================== */
export default function CourseSchema({ value, onChange }) {
  const initialInstance = {
    courseMode: "Online",
    startDate: "",
    endDate: "",
    instructor: { name: "" },
    location: { name: "", url: "" },
    offers: {
      price: "",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
    },
  };

  const [data, setData] = useState({
    name: "",
    description: "",
    provider: { name: "", url: "" },
    courseCode: "",
    educationalLevel: "",
    url: "",
    image: "",
    coursePrerequisites: [],
    hasCourseInstance: [initialInstance], // one instance initialized
    aggregateRating: {},
    review: [],
    occupationalCredentialAwarded: "",
    educationalCredentialAwarded: "",
    timeToComplete: "",
    inLanguage: "",
    syllabusSections: "",
    numberOfCredits: "",
    financialAidEligible: false,
    ...value,
    provider: {
      name: value?.provider?.name || "",
      url: value?.provider?.url || "",
    },
    hasCourseInstance: value?.hasCourseInstance?.length
      ? value.hasCourseInstance
      : [initialInstance],
    aggregateRating: value?.aggregateRating || {},
    review: value?.review || [],
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateProvider = (field, val) =>
    setData((prev) => ({
      ...prev,
      provider: { ...prev.provider, [field]: val },
    }));

  const addInstance = () =>
    setData((prev) => ({
      ...prev,
      hasCourseInstance: [...(prev.hasCourseInstance || []), initialInstance],
    }));

  const updateInstance = (index, field, val) => {
    const next = [...(data.hasCourseInstance || [])];
    if (field === "instructor")
      next[index].instructor = { ...next[index]?.instructor, ...val };
    else if (field === "location")
      next[index].location = { ...next[index]?.location, ...val };
    else if (field === "offers")
      next[index].offers = { ...next[index]?.offers, ...val };
    else next[index][field] = val;
    setData((prev) => ({ ...prev, hasCourseInstance: next }));
  };

  return (
    <div className={styles.schemaForm}>
      {/* General Info */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>General Information</div>

        <div className={styles.formGroup}>
          <label>Course Name *</label>
          <input
            type="text"
            className={styles.input}
            value={data.name || ""}
            placeholder="Official Course Name"
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description *</label>
          <Tooltip text="Provide a detailed summary of the course content." />
          <textarea
            className={styles.textarea}
            value={data.description || ""}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Course URL</label>
          <Tooltip text="The URL where this course can be found." />
          <input
            type="url"
            className={styles.input}
            value={data.url || ""}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://example.com/course"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Course Code</label>
          <Tooltip text="Unique identifier for the course if applicable." />
          <input
            type="text"
            className={styles.input}
            value={data.courseCode || ""}
            onChange={(e) => update("courseCode", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Educational Level</label>
          <Tooltip text="E.g., Beginner, Intermediate, Advanced, or degree level." />
          <input
            type="text"
            className={styles.input}
            value={data.educationalLevel || ""}
            onChange={(e) => update("educationalLevel", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Image URL</label>
          <Tooltip text="Thumbnail or cover image for the course." />
          <input
            type="url"
            className={styles.input}
            value={data.image || ""}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Provider Info */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Provider</div>
        <div className={styles.formGroup}>
          <label>Provider Name</label>
          <input
            type="text"
            className={styles.input}
            value={data.provider?.name || ""}
            onChange={(e) => updateProvider("name", e.target.value)}
            placeholder="Organization Name"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Provider URL</label>
          <Tooltip text="Website or profile link for the course provider." />
          <input
            type="url"
            className={styles.input}
            value={data.provider?.url || ""}
            onChange={(e) => updateProvider("url", e.target.value)}
            placeholder="https://example.com/provider"
          />
        </div>
      </div>

      {/* Course Instances */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Course Instances</div>
        {(data.hasCourseInstance || []).map((ci, i) => (
          <div key={i} className={styles.formGroup}>
            <label>Mode</label>
            <Tooltip text="Mode of delivery: Online or OnSite." />
            <input
              type="text"
              className={styles.input}
              value={ci.courseMode || ""}
              onChange={(e) => updateInstance(i, "courseMode", e.target.value)}
              placeholder="Online, OnSite"
            />

            <label>Start Date</label>
            <Tooltip text="Date when this course instance begins." />
            <input
              type="date"
              className={styles.input}
              value={ci.startDate || ""}
              onChange={(e) => updateInstance(i, "startDate", e.target.value)}
            />

            <label>End Date</label>
            <Tooltip text="Date when this course instance ends." />
            <input
              type="date"
              className={styles.input}
              value={ci.endDate || ""}
              onChange={(e) => updateInstance(i, "endDate", e.target.value)}
            />

            <label>Instructor Name</label>
            <Tooltip text="Name of the instructor leading this course instance." />
            <input
              type="text"
              className={styles.input}
              value={ci.instructor?.name || ""}
              onChange={(e) =>
                updateInstance(i, "instructor", { name: e.target.value })
              }
              placeholder="Instructor Name"
            />

            <label>Location Name</label>
            <Tooltip text="Physical or virtual location name for the course." />
            <input
              type="text"
              className={styles.input}
              value={ci.location?.name || ""}
              onChange={(e) =>
                updateInstance(i, "location", { name: e.target.value })
              }
              placeholder="Location Name"
            />

            <label>Location URL</label>
            <Tooltip text="Link to virtual classroom or venue information." />
            <input
              type="url"
              className={styles.input}
              value={ci.location?.url || ""}
              onChange={(e) =>
                updateInstance(i, "location", { url: e.target.value })
              }
              placeholder="https://example.com/location"
            />

            <label>Price</label>
            <Tooltip text="Cost of enrollment for this course instance." />
            <input
              type="number"
              className={styles.input}
              value={ci.offers?.price || ""}
              onChange={(e) =>
                updateInstance(i, "offers", { price: e.target.value })
              }
              placeholder="Price"
            />
          </div>
        ))}
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={addInstance}
        >
          + Add Instance
        </button>
      </div>

      {/* Optional Details */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Optional Details</div>

        <div className={styles.formGroup}>
          <label>Time to Complete</label>
          <Tooltip text="Estimated duration to complete the course." />
          <input
            type="text"
            className={styles.input}
            value={data.timeToComplete || ""}
            onChange={(e) => update("timeToComplete", e.target.value)}
            placeholder="e.g., 3 months, 40 hours"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Language</label>
          <Tooltip text="Primary language of instruction, e.g., 'en', 'fr-FR'." />
          <input
            type="text"
            className={styles.input}
            value={data.inLanguage || ""}
            onChange={(e) => update("inLanguage", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Number of Credits</label>
          <Tooltip text="Academic credit value for this course if applicable." />
          <input
            type="number"
            className={styles.input}
            value={data.numberOfCredits || ""}
            onChange={(e) => update("numberOfCredits", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Financial Aid Eligible</label>
          <Tooltip text="Indicate if the course is eligible for financial aid." />
          <input
            type="checkbox"
            checked={data.financialAidEligible || false}
            onChange={(e) => update("financialAidEligible", e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder (Null-safe) */
/* ================================================================== */
export function buildCourseJson(data) {
  if (!data?.name || !data?.description) return null;

  // Course Instances
  const hasCourseInstance = (data.hasCourseInstance || []).map((ci) => {
    const location = ci.location?.name
      ? {
          "@type": "Place",
          name: ci.location.name,
          ...(ci.location.url
            ? { address: { "@type": "VirtualLocation", url: ci.location.url } }
            : {}),
        }
      : undefined;

    const offers =
      ci.offers?.price || ci.offers?.price === 0
        ? {
            "@type": "Offer",
            price: ci.offers.price,
            priceCurrency: ci.offers.priceCurrency || "AUD",
            availability:
              ci.offers.availability || "https://schema.org/InStock",
          }
        : undefined;

    return {
      "@type": "CourseInstance",
      courseMode: ci.courseMode || undefined,
      startDate: ci.startDate || undefined,
      endDate: ci.endDate || undefined,
      instructor: ci.instructor?.name
        ? { "@type": "Person", name: ci.instructor.name }
        : undefined,
      ...(location && { location }),
      ...(offers && { offers }),
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: data.name,
    description: data.description,
    ...(data.courseCode && { courseCode: data.courseCode }),
    ...(data.educationalLevel && { educationalLevel: data.educationalLevel }),
    ...(data.url && { url: data.url }),
    provider: data.provider?.name
      ? {
          "@type": "Organization",
          name: data.provider.name,
          ...(data.provider.url && { url: data.provider.url }),
        }
      : undefined,
    ...(data.image && { image: { "@type": "ImageObject", url: data.image } }),
    ...(data.coursePrerequisites?.length && {
      coursePrerequisites: data.coursePrerequisites.map((pr) => ({
        "@type": "Course",
        name: pr.name || "",
      })),
    }),
    ...(hasCourseInstance.length && { hasCourseInstance }),
    ...(data.aggregateRating?.averageRating &&
      data.aggregateRating?.reviewCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: data.aggregateRating.averageRating,
          reviewCount: data.aggregateRating.reviewCount,
        },
      }),
    ...(data.review?.length && { review: data.review }),
    ...(data.occupationalCredentialAwarded && {
      occupationalCredentialAwarded: data.occupationalCredentialAwarded,
    }),
    ...(data.educationalCredentialAwarded && {
      educationalCredentialAwarded: data.educationalCredentialAwarded,
    }),
    ...(data.timeToComplete && { timeToComplete: data.timeToComplete }),
    ...(data.inLanguage && { inLanguage: data.inLanguage }),
    ...(data.syllabusSections && { syllabus: data.syllabusSections }),
    ...(data.numberOfCredits && { numberOfCredits: data.numberOfCredits }),
    ...(data.financialAidEligible !== undefined && {
      financialAidEligible: data.financialAidEligible,
    }),
  };
}
