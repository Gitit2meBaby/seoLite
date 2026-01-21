// /components/schemaTypes/VideoObjectSchema.jsx

import { useState, useEffect } from "react";

/**
 * VideoObject Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function VideoObjectSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="schema-form schema-videoobject">
      <label>
        Video Title *
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
        Upload Date
        <input
          type="date"
          value={data.uploadDate || ""}
          onChange={(e) => handleChange("uploadDate", e.target.value)}
        />
      </label>

      <label>
        Thumbnail URL(s) (comma separated)
        <input
          type="text"
          value={data.thumbnailUrl || ""}
          onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
          placeholder="https://example.com/thumb1.jpg, https://example.com/thumb2.jpg"
        />
      </label>

      <label>
        Video URL
        <input
          type="url"
          value={data.contentUrl || ""}
          onChange={(e) => handleChange("contentUrl", e.target.value)}
          placeholder="https://example.com/video.mp4"
        />
      </label>

      <label>
        Embed URL
        <input
          type="url"
          value={data.embedUrl || ""}
          onChange={(e) => handleChange("embedUrl", e.target.value)}
          placeholder="https://example.com/embed/video"
        />
      </label>

      <label>
        Duration (ISO 8601)
        <input
          type="text"
          value={data.duration || ""}
          onChange={(e) => handleChange("duration", e.target.value)}
          placeholder="PT2M30S"
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
        Author URL
        <input
          type="url"
          value={data.authorUrl || ""}
          onChange={(e) => handleChange("authorUrl", e.target.value)}
          placeholder="https://example.com"
        />
      </label>

      <label>
        Publisher Name
        <input
          type="text"
          value={data.publisherName || ""}
          onChange={(e) => handleChange("publisherName", e.target.value)}
          placeholder="Organization Name"
        />
      </label>

      <label>
        Publisher Logo URL
        <input
          type="url"
          value={data.publisherLogo || ""}
          onChange={(e) => handleChange("publisherLogo", e.target.value)}
          placeholder="https://example.com/logo.png"
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
 * JSON-LD builder for VideoObject
 */
export function buildVideoObjectJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const thumbnailArray = data.thumbnailUrl
    ? data.thumbnailUrl
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.uploadDate && { uploadDate: data.uploadDate }),
    ...(thumbnailArray && { thumbnailUrl: thumbnailArray }),
    ...(data.contentUrl && { contentUrl: data.contentUrl }),
    ...(data.embedUrl && { embedUrl: data.embedUrl }),
    ...(data.duration && { duration: data.duration }),
    ...(data.author && {
      author: {
        "@type": "Person",
        name: data.author,
        ...(data.authorUrl && { url: data.authorUrl }),
      },
    }),
    ...(data.publisherName
      ? {
          publisher: {
            "@type": "Organization",
            name: data.publisherName,
            ...(data.publisherLogo && {
              logo: { "@type": "ImageObject", url: data.publisherLogo },
            }),
          },
        }
      : undefined),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return json;
}
