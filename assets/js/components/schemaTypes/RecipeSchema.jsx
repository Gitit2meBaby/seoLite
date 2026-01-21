// /components/schemaTypes/RecipeSchema.jsx

import { useState, useEffect } from "react";

/**
 * Recipe Schema Editor
 * Fully dynamic form with JSON-LD output
 */
export default function RecipeSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form className="schema-form schema-recipe">
      <label>
        Recipe Name *
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
        Cuisine
        <input
          type="text"
          value={data.recipeCuisine || ""}
          onChange={(e) => handleChange("recipeCuisine", e.target.value)}
          placeholder="Italian, Mexican, etc."
        />
      </label>

      <label>
        Category
        <input
          type="text"
          value={data.recipeCategory || ""}
          onChange={(e) => handleChange("recipeCategory", e.target.value)}
          placeholder="Dessert, Main Course, etc."
        />
      </label>

      <label>
        Keywords (comma separated)
        <input
          type="text"
          value={data.keywords || ""}
          onChange={(e) => handleChange("keywords", e.target.value)}
          placeholder="easy, quick, vegetarian"
        />
      </label>

      <label>
        Prep Time (ISO 8601)
        <input
          type="text"
          value={data.prepTime || ""}
          onChange={(e) => handleChange("prepTime", e.target.value)}
          placeholder="PT20M"
        />
      </label>

      <label>
        Cook Time (ISO 8601)
        <input
          type="text"
          value={data.cookTime || ""}
          onChange={(e) => handleChange("cookTime", e.target.value)}
          placeholder="PT45M"
        />
      </label>

      <label>
        Total Time (ISO 8601)
        <input
          type="text"
          value={data.totalTime || ""}
          onChange={(e) => handleChange("totalTime", e.target.value)}
          placeholder="PT1H5M"
        />
      </label>

      <label>
        Yield / Servings
        <input
          type="text"
          value={data.recipeYield || ""}
          onChange={(e) => handleChange("recipeYield", e.target.value)}
          placeholder="4 servings"
        />
      </label>

      <label>
        Ingredients (comma separated)
        <textarea
          value={data.recipeIngredient || ""}
          onChange={(e) => handleChange("recipeIngredient", e.target.value)}
          placeholder="2 eggs, 1 cup flour, ..."
        />
      </label>

      <label>
        Instructions (step by step)
        <textarea
          value={data.recipeInstructions || ""}
          onChange={(e) => handleChange("recipeInstructions", e.target.value)}
          placeholder="Step 1: ..., Step 2: ..."
        />
      </label>

      <label>
        Nutrition (JSON format)
        <textarea
          value={data.nutrition || ""}
          onChange={(e) => handleChange("nutrition", e.target.value)}
          placeholder='{"calories":"250 kcal","fatContent":"10 g","proteinContent":"5 g"}'
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
        Aggregate Rating (JSON format)
        <textarea
          value={data.aggregateRating || ""}
          onChange={(e) => handleChange("aggregateRating", e.target.value)}
          placeholder='{"@type":"AggregateRating","ratingValue":"4.5","reviewCount":"25"}'
        />
      </label>

      <label>
        Video URL (optional)
        <input
          type="url"
          value={data.video || ""}
          onChange={(e) => handleChange("video", e.target.value)}
          placeholder="https://youtube.com/..."
        />
      </label>

      <label>
        Image URL
        <input
          type="url"
          value={data.image || ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </label>

      <label>
        Social Profiles (comma separated)
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
 * JSON-LD builder for Recipe
 */
export function buildRecipeJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const ingredientsArray = data.recipeIngredient
    ? data.recipeIngredient
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
    : undefined;

  const instructionsArray = data.recipeInstructions
    ? data.recipeInstructions
        .split(/(?:Step \d+:)/i)
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  let nutritionObj;
  try {
    nutritionObj = data.nutrition ? JSON.parse(data.nutrition) : undefined;
  } catch {
    nutritionObj = undefined;
  }

  let aggregateRatingObj;
  try {
    aggregateRatingObj = data.aggregateRating
      ? JSON.parse(data.aggregateRating)
      : undefined;
  } catch {
    aggregateRatingObj = undefined;
  }

  const json = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: data.name,
    description: data.description,
    ...(data.recipeCuisine && { recipeCuisine: data.recipeCuisine }),
    ...(data.recipeCategory && { recipeCategory: data.recipeCategory }),
    ...(data.keywords && { keywords: data.keywords }),
    ...(data.prepTime && { prepTime: data.prepTime }),
    ...(data.cookTime && { cookTime: data.cookTime }),
    ...(data.totalTime && { totalTime: data.totalTime }),
    ...(data.recipeYield && { recipeYield: data.recipeYield }),
    ...(ingredientsArray && { recipeIngredient: ingredientsArray }),
    ...(instructionsArray && {
      recipeInstructions: instructionsArray.map((step) => ({
        "@type": "HowToStep",
        text: step,
      })),
    }),
    ...(nutritionObj && {
      nutrition: { "@type": "NutritionInformation", ...nutritionObj },
    }),
    ...(data.author && { author: { "@type": "Person", name: data.author } }),
    ...(aggregateRatingObj && { aggregateRating: aggregateRatingObj }),
    ...(data.video && { video: { "@type": "VideoObject", url: data.video } }),
    ...(data.image && { image: data.image }),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return json;
}
