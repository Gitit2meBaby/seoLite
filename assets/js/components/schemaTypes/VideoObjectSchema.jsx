import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

export default function VideoObjectSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    description: "",
    contentUrl: "",
    embedUrl: "",
    thumbnailUrl: "",
    uploadDate: "",
    duration: "",
    keywords: "",
    requiresSubscription: false,
    regionsAllowed: [],
    inLanguage: "",
    caption: "",
    videoQuality: "",
    encodingFormat: "",
    bitrate: "",
    videoFrameSize: "",
    startOffset: "",
    endOffset: "",
    expires: "",
    viewCount: 0,
    likeCount: 0,
    publisherName: "",
    publisherLogo: "",
    transcriptUrl: "",
    hasPart: [],
    isPartOf: [],
    ...value,
    regionsAllowed: value?.regionsAllowed || [],
    hasPart: value?.hasPart || [],
    isPartOf: value?.isPartOf || [],
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

  const addArrayItem = (field) =>
    setData((prev) => ({ ...prev, [field]: [...(prev[field] || []), ""] }));

  const removeArrayItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Video Fields */}
      <div className={styles.formGroup}>
        <label>Video Title *</label>
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

        <label>Content URL</label>
        <input
          type="url"
          value={data.contentUrl || ""}
          onChange={(e) => update("contentUrl", e.target.value)}
        />

        <label>Embed URL</label>
        <input
          type="url"
          value={data.embedUrl || ""}
          onChange={(e) => update("embedUrl", e.target.value)}
        />

        <label>Thumbnail URL</label>
        <input
          type="url"
          value={data.thumbnailUrl || ""}
          onChange={(e) => update("thumbnailUrl", e.target.value)}
        />
      </div>

      {/* Optional Metadata */}
      <div className={styles.formGroup}>
        <label>Upload Date</label>
        <input
          type="date"
          value={data.uploadDate || ""}
          onChange={(e) => update("uploadDate", e.target.value)}
        />

        <label>Duration</label>
        <input
          type="text"
          value={data.duration || ""}
          onChange={(e) => update("duration", e.target.value)}
          placeholder="PT2M30S"
        />

        <label>Keywords (comma-separated)</label>
        <input
          type="text"
          value={data.keywords || ""}
          onChange={(e) => update("keywords", e.target.value)}
        />

        <label>Requires Subscription?</label>
        <select
          value={data.requiresSubscription ? "true" : "false"}
          onChange={(e) =>
            update("requiresSubscription", e.target.value === "true")
          }
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>

        <label>Regions Allowed (comma-separated ISO codes)</label>
        <input
          type="text"
          value={(data.regionsAllowed || []).join(",")}
          onChange={(e) =>
            update(
              "regionsAllowed",
              e.target.value
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean),
            )
          }
          placeholder="US,CA,GB"
        />

        <label>Language (inLanguage)</label>
        <input
          type="text"
          value={data.inLanguage || ""}
          onChange={(e) => update("inLanguage", e.target.value)}
          placeholder="en"
        />

        <label>Caption URL</label>
        <input
          type="url"
          value={data.caption || ""}
          onChange={(e) => update("caption", e.target.value)}
        />

        <label>Video Quality</label>
        <input
          type="text"
          value={data.videoQuality || ""}
          onChange={(e) => update("videoQuality", e.target.value)}
          placeholder="HD, SD, 4K"
        />

        <label>Encoding Format</label>
        <input
          type="text"
          value={data.encodingFormat || ""}
          onChange={(e) => update("encodingFormat", e.target.value)}
          placeholder="video/mp4"
        />

        <label>Bitrate</label>
        <input
          type="text"
          value={data.bitrate || ""}
          onChange={(e) => update("bitrate", e.target.value)}
        />

        <label>Video Frame Size</label>
        <input
          type="text"
          value={data.videoFrameSize || ""}
          onChange={(e) => update("videoFrameSize", e.target.value)}
          placeholder="1920x1080"
        />

        <label>Start Offset</label>
        <input
          type="text"
          value={data.startOffset || ""}
          onChange={(e) => update("startOffset", e.target.value)}
        />

        <label>End Offset</label>
        <input
          type="text"
          value={data.endOffset || ""}
          onChange={(e) => update("endOffset", e.target.value)}
        />

        <label>Expires</label>
        <input
          type="date"
          value={data.expires || ""}
          onChange={(e) => update("expires", e.target.value)}
        />
      </div>

      {/* Video series / playlist */}
      <div className={styles.formGroup}>
        <h4>Has Part (Videos in Series)</h4>
        {(data.hasPart || []).map((item, i) => (
          <div key={i}>
            <input
              type="text"
              value={item || ""}
              onChange={(e) => updateArray("hasPart", i, e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("hasPart", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addArrayItem("hasPart")}
        >
          + Add Part
        </button>

        <h4>Is Part Of (Playlist / Series)</h4>
        {(data.isPartOf || []).map((item, i) => (
          <div key={i}>
            <input
              type="text"
              value={item || ""}
              onChange={(e) => updateArray("isPartOf", i, e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("isPartOf", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addArrayItem("isPartOf")}
        >
          + Add Series
        </button>
      </div>
    </div>
  );
}

/* JSON-LD Builder (Null-safe) */
export function buildVideoObjectJson(data) {
  if (!data?.name || !data?.description) return null;

  const keywordsArray = data.keywords
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const interactionStats = [];
  if (data.viewCount) {
    interactionStats.push({
      "@type": "InteractionCounter",
      interactionType: { "@type": "http://schema.org/WatchAction" },
      userInteractionCount: Number(data.viewCount),
    });
  }
  if (data.likeCount) {
    interactionStats.push({
      "@type": "InteractionCounter",
      interactionType: { "@type": "http://schema.org/LikeAction" },
      userInteractionCount: Number(data.likeCount),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: data.name,
    description: data.description,
    ...(data.contentUrl && { contentUrl: data.contentUrl }),
    ...(data.embedUrl && { embedUrl: data.embedUrl }),
    ...(data.thumbnailUrl && { thumbnailUrl: data.thumbnailUrl }),
    ...(data.uploadDate && { uploadDate: data.uploadDate }),
    ...(data.duration && { duration: data.duration }),
    ...(keywordsArray?.length && { keywords: keywordsArray }),
    ...(interactionStats.length && { interactionStatistic: interactionStats }),
    ...(data.publisherName && {
      publisher: {
        "@type": "Organization",
        name: data.publisherName,
        ...(data.publisherLogo && {
          logo: { "@type": "ImageObject", url: data.publisherLogo },
        }),
      },
    }),
    ...(data.transcriptUrl && { transcript: data.transcriptUrl }),
    ...(data.requiresSubscription !== undefined && {
      requiresSubscription: data.requiresSubscription,
    }),
    ...(data.regionsAllowed?.length && { regionsAllowed: data.regionsAllowed }),
    ...(data.inLanguage && { inLanguage: data.inLanguage }),
    ...(data.caption && { caption: data.caption }),
    ...(data.videoQuality && { videoQuality: data.videoQuality }),
    ...(data.encodingFormat && { encodingFormat: data.encodingFormat }),
    ...(data.bitrate && { bitrate: data.bitrate }),
    ...(data.videoFrameSize && { videoFrameSize: data.videoFrameSize }),
    ...(data.startOffset && { startOffset: data.startOffset }),
    ...(data.endOffset && { endOffset: data.endOffset }),
    ...(data.expires && { expires: data.expires }),
    ...(data.hasPart?.length && {
      hasPart: data.hasPart.map((url) => ({
        "@type": "VideoObject",
        contentUrl: url || "",
      })),
    }),
    ...(data.isPartOf?.length && {
      isPartOf: data.isPartOf.map((url) => ({
        "@type": "VideoObject",
        contentUrl: url || "",
      })),
    }),
  };
}
