import { useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

/* ================================================================== */
/* Recipe Schema Editor */
/* ================================================================== */
export default function RecipeSchema({ value, onChange }) {
  const [data, setData] = useState({
    name: "",
    description: "",
    author: "",
    recipeCategory: "",
    recipeCuisine: "",
    recipeYield: "",
    cookingMethod: "",
    prepTime: "",
    cookTime: "",
    totalTime: "",
    ingredients: [],
    instructions: [],
    image: { url: "", width: 1200, height: 1200 },
    nutrition: {},
    aggregateRating: {},
    review: [],
    video: {},
    suitableForDiet: [],
    keywords: "",
    ...value,
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateArray = (field, index, val) => {
    const arr = [...(data[field] || [])];
    arr[index] = val;
    setData((prev) => ({ ...prev, [field]: arr }));
  };
  const addArrayItem = (field, defaultValue = "") =>
    setData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue],
    }));
  const removeArrayItem = (field, index) =>
    setData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));

  const updateNutrition = (field, val) =>
    setData((prev) => ({
      ...prev,
      nutrition: { ...(prev.nutrition || {}), [field]: val },
    }));

  const updateImage = (field, val) =>
    setData((prev) => ({
      ...prev,
      image: { ...(prev.image || {}), [field]: val },
    }));

  const updateVideo = (field, val) =>
    setData((prev) => ({
      ...prev,
      video: { ...(prev.video || {}), [field]: val },
    }));

  return (
    <div className={styles.schemaForm}>
      {/* Core Fields */}
      <div className={styles.formGroup}>
        <label>Recipe Name *</label>
        <Tooltip text="The name of your recipe. Required for Google Rich Results." />
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={data.description || ""}
          onChange={(e) => update("description", e.target.value)}
        />

        <label>Author</label>
        <input
          type="text"
          value={data.author || ""}
          onChange={(e) => update("author", e.target.value)}
          placeholder="John Doe"
        />

        <label>Recipe Category</label>
        <input
          type="text"
          value={data.recipeCategory || ""}
          onChange={(e) => update("recipeCategory", e.target.value)}
          placeholder="Dessert"
        />

        <label>Recipe Cuisine</label>
        <input
          type="text"
          value={data.recipeCuisine || ""}
          onChange={(e) => update("recipeCuisine", e.target.value)}
          placeholder="American"
        />

        <label>Recipe Yield</label>
        <input
          type="text"
          value={data.recipeYield || ""}
          onChange={(e) => update("recipeYield", e.target.value)}
          placeholder="4 servings"
        />

        <label>Cooking Method</label>
        <input
          type="text"
          value={data.cookingMethod || ""}
          onChange={(e) => update("cookingMethod", e.target.value)}
          placeholder="Baked"
        />
      </div>

      {/* Times */}
      <div className={styles.formRow}>
        {["prepTime", "cookTime", "totalTime"].map((field) => (
          <div key={field} className={styles.formGroup}>
            <label>{field.replace("Time", " Time (minutes)")}</label>
            <input
              type="number"
              min="0"
              value={data[field] || ""}
              onChange={(e) => update(field, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Ingredients & Instructions */}
      {["ingredients", "instructions"].map((field) => (
        <div key={field} className={styles.fieldGroup}>
          <h4>{field.charAt(0).toUpperCase() + field.slice(1)}</h4>
          {(data[field] || []).map((item, i) => (
            <div key={i} className={styles.formRow}>
              {field === "ingredients" ? (
                <input
                  type="text"
                  value={item}
                  placeholder="1 cup flour"
                  onChange={(e) => updateArray(field, i, e.target.value)}
                />
              ) : (
                <textarea
                  value={item}
                  placeholder={`Step ${i + 1}`}
                  onChange={(e) => updateArray(field, i, e.target.value)}
                />
              )}
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => removeArrayItem(field, i)}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            className={styles.addButton}
            type="button"
            onClick={() => addArrayItem(field)}
          >
            + Add {field === "ingredients" ? "Ingredient" : "Step"}
          </button>
        </div>
      ))}

      {/* Image */}
      <div className={styles.formGroup}>
        <label>Recipe Image URL *</label>
        <input
          type="url"
          value={data.image?.url || ""}
          onChange={(e) => updateImage("url", e.target.value)}
          placeholder="https://example.com/recipe-image.jpg"
          required
        />
        {["width", "height"].map((dim) => (
          <div key={dim} className={styles.formRow}>
            <label>{dim.charAt(0).toUpperCase() + dim.slice(1)}</label>
            <input
              type="number"
              value={data.image?.[dim] || 1200}
              onChange={(e) => updateImage(dim, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Nutrition */}
      <div className={styles.formGroup}>
        <h4>Nutrition</h4>
        {[
          "calories",
          "fatContent",
          "saturatedFatContent",
          "carbohydrateContent",
          "sugarContent",
          "proteinContent",
          "fiberContent",
          "cholesterolContent",
          "sodiumContent",
          "servingSize",
        ].map((field) => (
          <div key={field} className={styles.formRow}>
            <label>{field}</label>
            <input
              type="text"
              value={data.nutrition?.[field] || ""}
              onChange={(e) => updateNutrition(field, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Aggregate Rating */}
      <div className={styles.formGroup}>
        <h4>Aggregate Rating</h4>
        {["ratingValue", "ratingCount"].map((field) => (
          <div key={field} className={styles.formRow}>
            <label>{field}</label>
            <input
              type="number"
              step={field === "ratingValue" ? "0.1" : "1"}
              value={data.aggregateRating?.[field] || ""}
              onChange={(e) =>
                update("aggregateRating", {
                  ...(data.aggregateRating || {}),
                  [field]: e.target.value,
                })
              }
            />
          </div>
        ))}
      </div>

      {/* Keywords & Diet */}
      <div className={styles.formGroup}>
        <label>Keywords (comma-separated)</label>
        <input
          type="text"
          value={data.keywords || ""}
          onChange={(e) => update("keywords", e.target.value)}
        />
        <label>Suitable For Diet (comma-separated URLs)</label>
        <input
          type="text"
          value={(data.suitableForDiet || []).join(",")}
          onChange={(e) =>
            update(
              "suitableForDiet",
              e.target.value.split(",").map((v) => v.trim()),
            )
          }
        />
      </div>

      {/* Video */}
      <div className={styles.formGroup}>
        <h4>Video</h4>
        {[
          "name",
          "description",
          "thumbnailUrl",
          "contentUrl",
          "uploadDate",
        ].map((field) => (
          <div key={field} className={styles.formRow}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={
                field.includes("Url")
                  ? "url"
                  : field === "uploadDate"
                    ? "date"
                    : "text"
              }
              value={data.video?.[field] || ""}
              onChange={(e) => updateVideo(field, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder for Recipe (Null Protected) */
export function buildRecipeJson(data) {
  if (!data?.name || !data?.ingredients?.length || !data?.instructions?.length)
    return null;

  const nutrition = data.nutrition?.["@type"]
    ? data.nutrition
    : { "@type": "NutritionInformation", ...(data.nutrition || {}) };

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: data.name,
    description: data.description || undefined,
    author: data.author ? { "@type": "Person", name: data.author } : undefined,
    prepTime: data.prepTime ? `PT${data.prepTime}M` : undefined,
    cookTime: data.cookTime ? `PT${data.cookTime}M` : undefined,
    totalTime: data.totalTime ? `PT${data.totalTime}M` : undefined,
    recipeYield: data.recipeYield || undefined,
    recipeCategory: data.recipeCategory || undefined,
    recipeCuisine: data.recipeCuisine || undefined,
    recipeIngredient: data.ingredients || undefined,
    recipeInstructions: (data.instructions || []).map((step) => ({
      "@type": "HowToStep",
      text: step,
    })),
    image: data.image?.url
      ? {
          "@type": "ImageObject",
          url: data.image.url,
          width: data.image.width,
          height: data.image.height,
        }
      : undefined,
    nutrition,
    aggregateRating: data.aggregateRating?.ratingValue
      ? { "@type": "AggregateRating", ...data.aggregateRating }
      : undefined,
    keywords: data.keywords || undefined,
    suitableForDiet: (data.suitableForDiet || []).length
      ? data.suitableForDiet
      : undefined,
    video: data.video?.name
      ? { "@type": "VideoObject", ...data.video }
      : undefined,
    cookingMethod: data.cookingMethod || undefined,
  };
}
