import { useEffect, useState } from "react";

import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Event Schema Editor (Null-Safe & Styled) */
/* ================================================================== */
export default function EventSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    description: "",
    url: "",
    startDate: "",
    endDate: "",
    location: { name: "", address: "" },
    performer: "",
    eventStatus: "EventScheduled",
    eventAttendanceMode: "OfflineEventAttendanceMode",
    image: "",
    offers: [],
    organizer: { name: "", url: "" },
    sponsor: [],
    maximumAttendeeCapacity: "",
    remainingAttendeeCapacity: "",
    isAccessibleForFree: false,
    inLanguage: "",
    typicalAgeRange: "",
    subEvent: [],
    virtualLocation: "",
    ...value,
    location: {
      name: value?.location?.name || "",
      address: value?.location?.address || "",
    },
    organizer: {
      name: value?.organizer?.name || "",
      url: value?.organizer?.url || "",
    },
    offers: value?.offers || [],
    sponsor: value?.sponsor || [],
    subEvent: value?.subEvent || [],
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateLocation = (field, val) =>
    setData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: val },
    }));
  const updateOrganizer = (field, val) =>
    setData((prev) => ({
      ...prev,
      organizer: { ...prev.organizer, [field]: val },
    }));

  /* ======================= Offers ======================= */
  const addOffer = () =>
    setData((prev) => ({
      ...prev,
      offers: [
        ...(prev.offers || []),
        { name: "", price: "", priceCurrency: "USD", url: "" },
      ],
    }));
  const updateOffer = (index, field, val) => {
    const next = [...(data.offers || [])];
    next[index] = { ...next[index], [field]: val };
    setData((prev) => ({ ...prev, offers: next }));
  };
  const removeOffer = (index) =>
    setData((prev) => ({
      ...prev,
      offers: (prev.offers || []).filter((_, i) => i !== index),
    }));

  /* ======================= Sponsors ======================= */
  const addSponsor = () =>
    setData((prev) => ({
      ...prev,
      sponsor: [...(prev.sponsor || []), { name: "", url: "" }],
    }));
  const updateSponsor = (index, field, val) => {
    const next = [...(data.sponsor || [])];
    next[index] = { ...next[index], [field]: val };
    setData((prev) => ({ ...prev, sponsor: next }));
  };
  const removeSponsor = (index) =>
    setData((prev) => ({
      ...prev,
      sponsor: (prev.sponsor || []).filter((_, i) => i !== index),
    }));

  /* ======================= Sub Events ======================= */
  const addSubEvent = () =>
    setData((prev) => ({
      ...prev,
      subEvent: [
        ...(prev.subEvent || []),
        { name: "", startDate: "", endDate: "" },
      ],
    }));
  const updateSubEvent = (index, field, val) => {
    const next = [...(data.subEvent || [])];
    next[index] = { ...next[index], [field]: val };
    setData((prev) => ({ ...prev, subEvent: next }));
  };
  const removeSubEvent = (index) =>
    setData((prev) => ({
      ...prev,
      subEvent: (prev.subEvent || []).filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Event Info */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Event Information</div>

        <label>Event Name *</label>
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          required
        />

        <label>Description *</label>
        <textarea
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          required
        />

        <label>Event URL</label>
        <input
          type="url"
          value={data.url || ""}
          onChange={(e) => update("url", e.target.value)}
        />

        <label>Start Date & Time *</label>
        <input
          type="datetime-local"
          value={data.startDate || ""}
          onChange={(e) => update("startDate", e.target.value)}
          required
        />

        <label>End Date & Time</label>
        <input
          type="datetime-local"
          value={data.endDate || ""}
          onChange={(e) => update("endDate", e.target.value)}
        />

        <label>Attendance Mode</label>
        <select
          value={data.eventAttendanceMode || "OfflineEventAttendanceMode"}
          onChange={(e) => update("eventAttendanceMode", e.target.value)}
        >
          <option value="OfflineEventAttendanceMode">Offline</option>
          <option value="OnlineEventAttendanceMode">Online</option>
          <option value="MixedEventAttendanceMode">Mixed</option>
        </select>

        <label>Event Status</label>
        <select
          value={data.eventStatus || "EventScheduled"}
          onChange={(e) => update("eventStatus", e.target.value)}
        >
          <option value="EventScheduled">Scheduled</option>
          <option value="EventCancelled">Cancelled</option>
          <option value="EventPostponed">Postponed</option>
          <option value="EventMovedOnline">Moved Online</option>
        </select>
      </div>

      {/* Location */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Location</div>
        <label>Venue Name</label>
        <input
          type="text"
          value={data.location?.name || ""}
          onChange={(e) => updateLocation("name", e.target.value)}
        />
        <label>Address</label>
        <input
          type="text"
          value={data.location?.address || ""}
          onChange={(e) => updateLocation("address", e.target.value)}
        />
        <label>Virtual Location URL</label>
        <input
          type="url"
          value={data.virtualLocation || ""}
          onChange={(e) => update("virtualLocation", e.target.value)}
        />
      </div>

      {/* Organizer */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Organizer</div>
        <label>Name</label>
        <input
          type="text"
          value={data.organizer?.name || ""}
          onChange={(e) => updateOrganizer("name", e.target.value)}
        />
        <label>URL</label>
        <input
          type="url"
          value={data.organizer?.url || ""}
          onChange={(e) => updateOrganizer("url", e.target.value)}
        />
      </div>

      {/* Sponsors */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Sponsors</div>
        {(data.sponsor || []).map((s, i) => (
          <div key={i} className={styles.formGroup}>
            <input
              type="text"
              placeholder="Name"
              value={s.name || ""}
              onChange={(e) => updateSponsor(i, "name", e.target.value)}
            />
            <input
              type="url"
              placeholder="URL"
              value={s.url || ""}
              onChange={(e) => updateSponsor(i, "url", e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeSponsor(i)}
            >
              Delete Sponsor
            </button>
          </div>
        ))}
        <button className={styles.addButton} type="button" onClick={addSponsor}>
          + Add Sponsor
        </button>
      </div>

      {/* Offers */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Offers / Tickets</div>
        {(data.offers || []).map((o, i) => (
          <div key={i} className={styles.formGroup}>
            <input
              type="text"
              placeholder="Offer Name"
              value={o.name || ""}
              onChange={(e) => updateOffer(i, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={o.price || ""}
              onChange={(e) => updateOffer(i, "price", e.target.value)}
            />
            <input
              type="text"
              placeholder="Currency"
              value={o.priceCurrency || "USD"}
              onChange={(e) => updateOffer(i, "priceCurrency", e.target.value)}
            />
            <input
              type="url"
              placeholder="URL"
              value={o.url || ""}
              onChange={(e) => updateOffer(i, "url", e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeOffer(i)}
            >
              Delete Offer
            </button>
          </div>
        ))}
        <button className={styles.addButton} type="button" onClick={addOffer}>
          + Add Offer
        </button>
      </div>

      {/* Sub Events */}
      <div className={styles.fieldGroup}>
        <div className={styles.fieldGroupTitle}>Sub Events</div>
        {(data.subEvent || []).map((s, i) => (
          <div key={i} className={styles.formGroup}>
            <input
              type="text"
              placeholder="Name"
              value={s.name || ""}
              onChange={(e) => updateSubEvent(i, "name", e.target.value)}
            />
            <input
              type="datetime-local"
              placeholder="Start"
              value={s.startDate || ""}
              onChange={(e) => updateSubEvent(i, "startDate", e.target.value)}
            />
            <input
              type="datetime-local"
              placeholder="End"
              value={s.endDate || ""}
              onChange={(e) => updateSubEvent(i, "endDate", e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeSubEvent(i)}
            >
              Delete Sub Event
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={addSubEvent}
        >
          + Add Sub Event
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder (Null-Safe) */
/* ================================================================== */
export function buildEventJson(data) {
  if (!data?.name || !data?.startDate) return null;

  let duration;
  if (data.startDate && data.endDate) {
    const diffMs = new Date(data.endDate) - new Date(data.startDate);
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    duration = `PT${hours}H${mins}M`;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: data.name,
    description: data.description || "",
    url: data.url || undefined,
    startDate: data.startDate,
    ...(data.endDate && { endDate: data.endDate }),
    ...(duration && { duration }),
    location: data.virtualLocation
      ? { "@type": "VirtualLocation", url: data.virtualLocation }
      : data.location?.name || data.location?.address
        ? {
            "@type": "Place",
            name: data.location?.name || "",
            address: data.location?.address || "",
          }
        : undefined,
    performer: data.performer
      ? { "@type": "Person", name: data.performer }
      : undefined,
    eventStatus: `https://schema.org/${data.eventStatus || "EventScheduled"}`,
    eventAttendanceMode: `https://schema.org/${data.eventAttendanceMode || "OfflineEventAttendanceMode"}`,
    image: data.image ? { "@type": "ImageObject", url: data.image } : undefined,
    offers: (data.offers || []).map((o) => ({
      "@type": "Offer",
      name: o.name || "",
      price: o.price || "",
      priceCurrency: o.priceCurrency || "USD",
      url: o.url || undefined,
    })),
    organizer: data.organizer?.name
      ? {
          "@type": "Organization",
          name: data.organizer.name,
          url: data.organizer?.url || undefined,
        }
      : undefined,
    sponsor: (data.sponsor || []).map((s) => ({
      "@type": "Organization",
      name: s.name || "",
      url: s.url || undefined,
    })),
    maximumAttendeeCapacity: data.maximumAttendeeCapacity || undefined,
    remainingAttendeeCapacity: data.remainingAttendeeCapacity || undefined,
    isAccessibleForFree: data.isAccessibleForFree || undefined,
    inLanguage: data.inLanguage || undefined,
    typicalAgeRange: data.typicalAgeRange || undefined,
    subEvent: (data.subEvent || []).map((se) => ({
      "@type": "Event",
      name: se.name || "",
      startDate: se.startDate || undefined,
      endDate: se.endDate || undefined,
    })),
  };
}
