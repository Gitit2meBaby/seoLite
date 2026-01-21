// /components/schemaTypes/ArticleSchema.jsx

import { useEffect, useState } from "react";

/**
 * Article Schema Editor
 * - Page-level content schema
 * - Links to WebPage, Organization, Person
 * - Foundation for BlogPosting & NewsArticle
 */
export default function ArticleSchema({ value, onChange }) {
  const [data, setData] = useState(value || {});

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  function update(field, val) {
    setData((prev) => ({
      ...prev,
      [field]: val,
    }));
  }

  return (
    <form className="schema-form schema-article">
      {/* Core */}
      <label>
        Headline *
        <input
          type="text"
          id="headline"
          value={data.headline || ""}
          onChange={(e) => update("headline", e.target.value)}
          required
        />
      </label>

      <label>
        Article URL *
        <input
          type="url"
          id="url"
          value={data.url || ""}
          onChange={(e) => update("url", e.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          id="description"
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
          maxLength={300}
        />
      </label>

      {/* Identity */}
      <label>
        Article @id
        <input
          type="url"
          id="id"
          placeholder="https://example.com/article#article"
          value={data.id || ""}
          onChange={(e) => update("id", e.target.value)}
        />
      </label>

      <label>
        Main Entity of Page (WebPage URL)
        <input
          type="url"
          id="mainEntityOfPage"
          placeholder="https://example.com/article"
          value={data.mainEntityOfPage || ""}
          onChange={(e) => update("mainEntityOfPage", e.target.value)}
        />
      </label>

      {/* Media */}
      <label>
        Featured Image URL
        <input
          type="url"
          id="image"
          value={data.image || ""}
          onChange={(e) => update("image", e.target.value)}
        />
      </label>

      {/* Dates */}
      <label>
        Date Published
        <input
          type="date"
          id="datePublished"
          value={data.datePublished || ""}
          onChange={(e) => update("datePublished", e.target.value)}
        />
      </label>

      <label>
        Date Modified
        <input
          type="date"
          id="dateModified"
          value={data.dateModified || ""}
          onChange={(e) => update("dateModified", e.target.value)}
        />
      </label>

      {/* Author */}
      <label>
        Author Name
        <input
          type="text"
          id="author"
          value={data.author || ""}
          onChange={(e) => update("author", e.target.value)}
        />
      </label>

      <label>
        Author URL
        <input
          type="url"
          id="authorUrl"
          value={data.authorUrl || ""}
          onChange={(e) => update("authorUrl", e.target.value)}
        />
      </label>

      {/* Publisher */}
      <label>
        Publisher Name
        <input
          type="text"
          id="publisher"
          value={data.publisher || ""}
          onChange={(e) => update("publisher", e.target.value)}
        />
      </label>

      <label>
        Publisher Logo URL
        <input
          type="url"
          id="publisherLogo"
          value={data.publisherLogo || ""}
          onChange={(e) => update("publisherLogo", e.target.value)}
        />
      </label>

      {/* Classification */}
      <label>
        Article Type
        <select
          id="articleType"
          value={data.articleType || "Article"}
          onChange={(e) => update("articleType", e.target.value)}
        >
          <option value="Article">Article</option>
          <option value="BlogPosting">BlogPosting</option>
          <option value="NewsArticle">NewsArticle</option>
        </select>
      </label>

      <label>
        Keywords (comma separated)
        <input
          type="text"
          id="keywords"
          value={data.keywords || ""}
          onChange={(e) => update("keywords", e.target.value)}
        />
      </label>
    </form>
  );
}

/**
 * JSON-LD builder for Article
 */
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

    // Core
    headline: data.headline,
    url: data.url,
    description: data.description,

    // Relationships
    mainEntityOfPage: data.mainEntityOfPage
      ? {
          "@type": "WebPage",
          "@id": data.mainEntityOfPage,
        }
      : undefined,

    // Media
    image: data.image
      ? {
          "@type": "ImageObject",
          url: data.image,
        }
      : undefined,

    // Dates
    datePublished: data.datePublished,
    dateModified: data.dateModified,

    // Author
    author: data.author
      ? {
          "@type": "Person",
          name: data.author,
          url: data.authorUrl,
        }
      : undefined,

    // Publisher
    publisher: data.publisher
      ? {
          "@type": "Organization",
          name: data.publisher,
          logo: data.publisherLogo
            ? {
                "@type": "ImageObject",
                url: data.publisherLogo,
              }
            : undefined,
        }
      : undefined,

    // SEO
    keywords: keywordsArray,
  };
}
