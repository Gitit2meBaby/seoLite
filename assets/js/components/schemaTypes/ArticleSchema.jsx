import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

export default function ArticleSchema({ value, onChange }) {
  const [data, setData] = useState({
    availableContributors: [],
    citation: [],
    video: [],
    audio: [],
    ...value,
    availableContributors: value?.availableContributors || [],
    citation: value?.citation || [],
    video: value?.video || [],
    audio: value?.audio || [],
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
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Article Fields */}
      <div className={styles.fieldGroup}>
        <h4>Core Article Info</h4>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Headline *
            <Tooltip text="Title of the article" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.headline || ""}
            onChange={(e) => update("headline", e.target.value)}
            placeholder="Article headline"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            URL *
            <Tooltip text="Canonical URL of the article" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.url || ""}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://example.com/article"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Description
            <Tooltip text="Short summary of the article" />
          </label>
          <textarea
            className={styles.textarea}
            value={data.description || ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Summary of the article"
          />
        </div>
      </div>

      {/* Author, Editor, Publisher */}
      <div className={styles.fieldGroup}>
        <h4>People & Publisher</h4>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Author
            <Tooltip text="Main author of the article" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.author || ""}
            onChange={(e) => update("author", e.target.value)}
            placeholder="Author name"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Author URL
            <Tooltip text="Optional URL to author page" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.authorUrl || ""}
            onChange={(e) => update("authorUrl", e.target.value)}
            placeholder="https://example.com/author"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Editor
            <Tooltip text="Person who edited the article" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.editor || ""}
            onChange={(e) => update("editor", e.target.value)}
            placeholder="Editor name"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Publisher Name
            <Tooltip text="Organization publishing the article" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.publisher || ""}
            onChange={(e) => update("publisher", e.target.value)}
            placeholder="Publisher Name"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Publisher Logo URL
            <Tooltip text="Logo image URL for publisher" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.publisherLogo || ""}
            onChange={(e) => update("publisherLogo", e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>

      {/* Article Metadata */}
      <div className={styles.fieldGroup}>
        <h4>Article Metadata</h4>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Date Published
            <Tooltip text="When the article was first published" />
          </label>
          <input
            type="datetime-local"
            className={styles.input}
            value={data.datePublished || ""}
            onChange={(e) => update("datePublished", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Date Modified
            <Tooltip text="Last modification date of the article" />
          </label>
          <input
            type="datetime-local"
            className={styles.input}
            value={data.dateModified || ""}
            onChange={(e) => update("dateModified", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Keywords
            <Tooltip text="Comma-separated keywords" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.keywords || ""}
            onChange={(e) => update("keywords", e.target.value)}
            placeholder="technology, finance, health"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Word Count
            <Tooltip text="Total words in the article" />
          </label>
          <input
            type="number"
            className={styles.input}
            value={data.wordCount || ""}
            onChange={(e) => update("wordCount", e.target.value)}
            placeholder="e.g., 1200"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Article Section / Category
            <Tooltip text="Section/category of the article" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.articleSection || ""}
            onChange={(e) => update("articleSection", e.target.value)}
            placeholder="Technology, Health..."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Article Body
            <Tooltip text="Full article content" />
          </label>
          <textarea
            className={styles.textarea}
            value={data.articleBody || ""}
            onChange={(e) => update("articleBody", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Language (BCP-47)
            <Tooltip text="Language code of the article, e.g., en-AU" />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.inLanguage || ""}
            onChange={(e) => update("inLanguage", e.target.value)}
            placeholder="en-AU"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Thumbnail URL
            <Tooltip text="Preview thumbnail image" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.thumbnailUrl || ""}
            onChange={(e) => update("thumbnailUrl", e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
      </div>

      {/* Contributors */}
      <div className={styles.fieldGroup}>
        <h4>Contributors & Citation</h4>
        {(data.availableContributors || []).map((c, i) => (
          <div key={i} className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Contributor Name"
              value={c || ""}
              onChange={(e) =>
                updateArray("availableContributors", i, e.target.value)
              }
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("availableContributors", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addArrayItem("availableContributors", "")}
        >
          + Add Contributor
        </button>

        {(data.citation || []).map((c, i) => (
          <div key={`cite-${i}`} className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Citation"
              value={c || ""}
              onChange={(e) => updateArray("citation", i, e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("citation", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addArrayItem("citation", "")}
        >
          + Add Citation
        </button>
      </div>

      {/* Media */}
      <div className={styles.fieldGroup}>
        <h4>Media</h4>

        {(data.video || []).map((v, i) => (
          <div key={`video-${i}`} className={styles.formRow}>
            <input
              type="url"
              className={styles.input}
              placeholder="Video URL"
              value={v || ""}
              onChange={(e) => updateArray("video", i, e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("video", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addArrayItem("video", "")}
        >
          + Add Video
        </button>

        {(data.audio || []).map((a, i) => (
          <div key={`audio-${i}`} className={styles.formRow}>
            <input
              type="url"
              className={styles.input}
              placeholder="Audio URL"
              value={a || ""}
              onChange={(e) => updateArray("audio", i, e.target.value)}
            />
            <button
              className={styles.removeButton}
              type="button"
              onClick={() => removeArrayItem("audio", i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={() => addArrayItem("audio", "")}
        >
          + Add Audio
        </button>
      </div>

      {/* Additional SEO / Misc */}
      <div className={styles.fieldGroup}>
        <h4>SEO & Extras</h4>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Genre
            <Tooltip text="Type of content: news, blog, opinion..." />
          </label>
          <input
            type="text"
            className={styles.input}
            value={data.genre || ""}
            onChange={(e) => update("genre", e.target.value)}
            placeholder="News, Opinion, Blog..."
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            License URL
            <Tooltip text="Link to copyright/license information" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.license || ""}
            onChange={(e) => update("license", e.target.value)}
            placeholder="https://example.com/license"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Discussion / Comments URL
            <Tooltip text="Optional link to article discussion or forum" />
          </label>
          <input
            type="url"
            className={styles.input}
            value={data.discussionUrl || ""}
            onChange={(e) => update("discussionUrl", e.target.value)}
            placeholder="https://example.com/discussion"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Backstory
            <Tooltip text="Background information for context" />
          </label>
          <textarea
            className={styles.textarea}
            value={data.backstory || ""}
            onChange={(e) => update("backstory", e.target.value)}
            placeholder="Article backstory"
          />
        </div>
      </div>
    </div>
  );
}

export function buildArticleJson(data) {
  if (!data?.headline || !data?.url) return null;

  const keywordsArray = data.keywords
    ? data.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": data.articleType || "Article",
    ...(data.id && { "@id": data.id }),
    headline: data.headline,
    url: data.url,
    description: data.description,
    mainEntityOfPage: data.mainEntityOfPage
      ? { "@type": "WebPage", "@id": data.mainEntityOfPage }
      : undefined,
    image: data.image ? { "@type": "ImageObject", url: data.image } : undefined,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: data.author
      ? { "@type": "Person", name: data.author, url: data.authorUrl }
      : undefined,
    contributor: data.contributor
      ? data.contributor
          .split(",")
          .map((c) => ({ "@type": "Person", name: c.trim() }))
      : undefined,
    editor: data.editor ? { "@type": "Person", name: data.editor } : undefined,
    publisher: data.publisher
      ? {
          "@type": "Organization",
          name: data.publisher,
          logo: data.publisherLogo
            ? { "@type": "ImageObject", url: data.publisherLogo }
            : undefined,
        }
      : undefined,
    keywords: keywordsArray,
    wordCount: data.wordCount ? parseInt(data.wordCount, 10) : undefined,
    articleSection: data.articleSection,
    articleBody: data.articleBody,
    inLanguage: data.inLanguage,
    thumbnailUrl: data.thumbnailUrl,
    commentCount: data.commentCount
      ? parseInt(data.commentCount, 10)
      : undefined,
    speakable: data.speakable
      ? {
          "@type": "SpeakableSpecification",
          cssSelector: data.speakable.split(",").map((s) => s.trim()),
        }
      : undefined,
    genre: data.genre,
    license: data.license,
    video: data.video,
    audio: data.audio,
    citation: data.citation?.length > 0 ? data.citation : undefined,
    discussionUrl: data.discussionUrl,
    backstory: data.backstory,
    hasPart: data.hasPart,
    isPartOf: data.isPartOf,
  };
}
