// /components/schemaTypes/CourseSchema.jsx

import { useState, useEffect } from "react";

/**
 * Course Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function CourseSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  const conditionalFields = [
    "courseCode",
    "description",
    "provider",
    "educationalCredentialAwarded",
    "hasCourseInstance",
    "sameAs",
  ];

  const showField = (field) => conditionalFields.includes(field);

  return (
    <form className="schema-form schema-course">
      <label>
        Course Name *
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
        Course Code
        <input
          type="text"
          value={data.courseCode || ""}
          onChange={(e) => handleChange("courseCode", e.target.value)}
          placeholder="CS101"
        />
      </label>

      <label>
        Provider Name
        <input
          type="text"
          value={data.provider || ""}
          onChange={(e) => handleChange("provider", e.target.value)}
          placeholder="Organization Name"
        />
      </label>

      <label>
        Credential Awarded
        <input
          type="text"
          value={data.educationalCredentialAwarded || ""}
          onChange={(e) =>
            handleChange("educationalCredentialAwarded", e.target.value)
          }
          placeholder="Certificate, Diploma, Degree"
        />
      </label>

      <label>
        Course Instance
        <input
          type="text"
          value={data.hasCourseInstance || ""}
          onChange={(e) => handleChange("hasCourseInstance", e.target.value)}
          placeholder="Schedule or session info"
        />
      </label>

      <label>
        Social Profiles / URLs
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
 * JSON-LD builder for Course
 */
export function buildCourseJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: data.name,
    description: data.description,
    courseCode: data.courseCode,
    provider: { "@type": "Organization", name: data.provider },
    educationalCredentialAwarded: data.educationalCredentialAwarded,
    hasCourseInstance: {
      "@type": "CourseInstance",
      name: data.hasCourseInstance,
      sameAs: sameAsArray,
    },
  };

  return json;
}
