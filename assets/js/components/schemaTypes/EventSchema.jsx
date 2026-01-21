// /components/schemaTypes/EventSchema.jsx

import { useState, useEffect } from "react";

/**
 * Event Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function EventSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="schema-form schema-event">
      <label>
        Event Name *
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
        Start Date/Time
        <input
          type="datetime-local"
          value={data.startDate || ""}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />
      </label>

      <label>
        End Date/Time
        <input
          type="datetime-local"
          value={data.endDate || ""}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </label>

      <label>
        Event Status
        <select
          value={data.eventStatus || ""}
          onChange={(e) => handleChange("eventStatus", e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="https://schema.org/EventScheduled">Scheduled</option>
          <option value="https://schema.org/EventCancelled">Cancelled</option>
          <option value="https://schema.org/EventPostponed">Postponed</option>
          <option value="https://schema.org/EventRescheduled">
            Rescheduled
          </option>
        </select>
      </label>

      <label>
        Location Name
        <input
          type="text"
          value={data.locationName || ""}
          onChange={(e) => handleChange("locationName", e.target.value)}
          placeholder="Venue Name"
        />
      </label>

      <label>
        Location Address
        <input
          type="text"
          value={data.locationAddress || ""}
          onChange={(e) => handleChange("locationAddress", e.target.value)}
          placeholder="123 Main St, City, Country"
        />
      </label>

      <label>
        Organizer Name
        <input
          type="text"
          value={data.organizerName || ""}
          onChange={(e) => handleChange("organizerName", e.target.value)}
          placeholder="Organizer Name"
        />
      </label>

      <label>
        Organizer URL
        <input
          type="url"
          value={data.organizerUrl || ""}
          onChange={(e) => handleChange("organizerUrl", e.target.value)}
          placeholder="https://example.com"
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
        Event URL
        <input
          type="url"
          value={data.url || ""}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder="https://example.com/event"
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
 * JSON-LD builder for Event
 */
export function buildEventJson(data) {
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

  const json = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.startDate && { startDate: data.startDate }),
    ...(data.endDate && { endDate: data.endDate }),
    ...(data.eventStatus && { eventStatus: data.eventStatus }),
    ...(data.locationName || data.locationAddress
      ? {
          location: {
            "@type": "Place",
            ...(data.locationName && { name: data.locationName }),
            ...(data.locationAddress && { address: data.locationAddress }),
          },
        }
      : undefined),
    ...(data.organizerName || data.organizerUrl
      ? {
          organizer: {
            "@type": "Organization",
            ...(data.organizerName && { name: data.organizerName }),
            ...(data.organizerUrl && { url: data.organizerUrl }),
          },
        }
      : undefined),
    ...(imageArray && { image: imageArray }),
    ...(data.url && { url: data.url }),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return json;
}
