// assets/js/components/tabs/SchemaTab.jsx
import React, { useEffect, useState } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import ReviewPublishButton from "../common/ReviewPublishButton";

import styles from "@css/components/tabs/SocialMedia.module.scss";

// Import schema components
import OrganizationSchema, {
  buildOrganizationJson,
} from "../schemaTypes/OrganizationSchema";
import ServiceSchema, { buildServiceJson } from "../schemaTypes/ServiceSchema";
import ArticleSchema, { buildArticleJson } from "../schemaTypes/ArticleSchema";
import ProductSchema, { buildProductJson } from "../schemaTypes/ProductSchema";
import LocalBusinessSchema, {
  buildLocalBusinessJson,
} from "../schemaTypes/LocalBusinessSchema";
import WebSiteSchema, { buildWebSiteJson } from "../schemaTypes/WebSiteSchema";
import WebPageSchema, { buildWebPageJson } from "../schemaTypes/WebPageSchema";
import PersonSchema, { buildPersonJson } from "../schemaTypes/PersonSchema";
import EventSchema, { buildEventJson } from "../schemaTypes/EventSchema";
import RecipeSchema, { buildRecipeJson } from "../schemaTypes/RecipeSchema";
import VideoObjectSchema, {
  buildVideoObjectJson,
} from "../schemaTypes/VideoObjectSchema";
import HowToSchema, { buildHowToJson } from "../schemaTypes/HowToSchema";
import FaqPageSchema, { buildFaqPageJson } from "../schemaTypes/FaqPageSchema";
import ReviewSchema, { buildReviewJson } from "../schemaTypes/ReviewSchema";
import CourseSchema, { buildCourseJson } from "../schemaTypes/CourseSchema";
import NonProfitOrganizationSchema, {
  buildNonProfitOrganizationJson,
} from "../schemaTypes/NonProfitOrganizationSchema";
import CustomSchema, { buildCustomJson } from "../schemaTypes/CustomSchema";
import JobPostingSchema, {
  buildJobPostingJson,
} from "../schemaTypes/JobPostingSchema";
import OnlineMarketplaceSchema, {
  buildOnlineMarketplaceJson,
} from "../schemaTypes/OnlineMarketplaceSchema";

const SCHEMA_TYPES = {
  Article: {
    label: "Article/Blog Post",
    component: ArticleSchema,
    builder: buildArticleJson,
    allowMultiple: false,
  },
  Course: {
    label: "Course/Educational",
    component: CourseSchema,
    builder: buildCourseJson,
    allowMultiple: true,
  },
  Custom: {
    label: "Custom Schema",
    component: CustomSchema,
    builder: buildCustomJson,
    allowMultiple: true,
  },
  Event: {
    label: "Event",
    component: EventSchema,
    builder: buildEventJson,
    allowMultiple: true,
  },
  FaqPage: {
    label: "FAQ Page",
    component: FaqPageSchema,
    builder: buildFaqPageJson,
    allowMultiple: false,
  },
  HowTo: {
    label: "How-To Guide",
    component: HowToSchema,
    builder: buildHowToJson,
    allowMultiple: true,
  },
  JobPosting: {
    label: "Job Posting",
    component: JobPostingSchema,
    builder: buildJobPostingJson,
    allowMultiple: true,
  },
  LocalBusiness: {
    label: "Local Business",
    component: LocalBusinessSchema,
    builder: buildLocalBusinessJson,
    allowMultiple: false,
  },
  NonProfit: {
    label: "Non-Profit Organization",
    component: NonProfitOrganizationSchema,
    builder: buildNonProfitOrganizationJson,
    allowMultiple: false,
  },
  OnlineMarketplace: {
    label: "Online Marketplace",
    component: OnlineMarketplaceSchema,
    builder: buildOnlineMarketplaceJson,
    allowMultiple: false,
  },
  Organization: {
    label: "Organization/Business",
    component: OrganizationSchema,
    builder: buildOrganizationJson,
    allowMultiple: false,
  },
  Person: {
    label: "Person/Author",
    component: PersonSchema,
    builder: buildPersonJson,
    allowMultiple: false,
  },
  Product: {
    label: "Product",
    component: ProductSchema,
    builder: buildProductJson,
    allowMultiple: true,
  },
  Recipe: {
    label: "Recipe",
    component: RecipeSchema,
    builder: buildRecipeJson,
    allowMultiple: true,
  },
  Review: {
    label: "Review",
    component: ReviewSchema,
    builder: buildReviewJson,
    allowMultiple: true,
  },
  Service: {
    label: "Service",
    component: ServiceSchema,
    builder: buildServiceJson,
    allowMultiple: true,
  },
  VideoObject: {
    label: "Video",
    component: VideoObjectSchema,
    builder: buildVideoObjectJson,
    allowMultiple: true,
  },
  WebPage: {
    label: "Web Page",
    component: WebPageSchema,
    builder: buildWebPageJson,
    allowMultiple: false,
  },
  WebSite: {
    label: "Website",
    component: WebSiteSchema,
    builder: buildWebSiteJson,
    allowMultiple: false,
  },
};

const SchemaTab = ({ tabId, config }) => {
  const { settings, updateSetting, loadPages } = useSettings();

  // UI State
  const [selectedPage, setSelectedPage] = useState("global");
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Schema Form State
  const [selectedSchemaType, setSelectedSchemaType] = useState("");
  const [currentSchemaData, setCurrentSchemaData] = useState({});
  const [editingSchemaId, setEditingSchemaId] = useState(null);

  // Saved Schemas - directly from settings, no separate loading
  const pageKey = `page_${selectedPage}`;
  const pageSettings = settings[pageKey] || {};
  const savedSchemas = pageSettings.schemas || [];

  // Preview State
  const [previewSchemaId, setPreviewSchemaId] = useState(null);
  const [showAllPreview, setShowAllPreview] = useState(false);

  // Load pages ONCE on mount
  useEffect(() => {
    const loadPagesOnce = async () => {
      try {
        setIsLoadingPages(true);
        const fetchedPages = await loadPages();
        if (fetchedPages && fetchedPages.length > 0) {
          setPages(fetchedPages);
        } else {
          setPages([
            { id: "global", title: "Global Defaults", type: "global" },
          ]);
        }
      } catch (error) {
        setApiError(`API Error: ${error.message}`);
        setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
      } finally {
        setIsLoadingPages(false);
      }
    };

    loadPagesOnce();
  }, []); // Only run once!

  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
    setSelectedSchemaType("");
    setCurrentSchemaData({});
    setEditingSchemaId(null);
    setPreviewSchemaId(null);
  };

  const handleSchemaTypeChange = (type) => {
    setSelectedSchemaType(type);
    setCurrentSchemaData({});
    setEditingSchemaId(null);
  };

  const canAddMoreOfType = (type) => {
    const schemaConfig = SCHEMA_TYPES[type];
    if (!schemaConfig) return false;
    if (schemaConfig.allowMultiple) return true;
    return savedSchemas.filter((s) => s.type === type).length === 0;
  };

  const getSchemaTypeCount = (type) => {
    return savedSchemas.filter((s) => s.type === type).length;
  };

  const handleSchemaSave = () => {
    console.log("=== SAVE CLICKED ===");
    console.log("Selected Type:", selectedSchemaType);
    console.log("Current Data:", currentSchemaData);

    if (!selectedSchemaType) {
      alert("Please select a schema type");
      return;
    }

    if (Object.keys(currentSchemaData).length === 0) {
      alert("Please fill in at least one field");
      return;
    }

    const schemaEntry = {
      id: editingSchemaId || `schema_${Date.now()}`,
      type: selectedSchemaType,
      data: { ...currentSchemaData },
      createdAt: editingSchemaId
        ? savedSchemas.find((s) => s.id === editingSchemaId)?.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Creating schema entry:", schemaEntry);

    let updatedSchemas;
    if (editingSchemaId) {
      updatedSchemas = savedSchemas.map((schema) =>
        schema.id === editingSchemaId ? schemaEntry : schema,
      );
    } else {
      updatedSchemas = [...savedSchemas, schemaEntry];
    }

    console.log("Updated schemas array:", updatedSchemas);

    // Save to WordPress settings
    const updatedPageSettings = {
      ...pageSettings,
      schemas: updatedSchemas,
    };

    console.log("Saving to settings:", pageKey, updatedPageSettings);
    updateSetting(pageKey, updatedPageSettings);

    // Reset form
    setSelectedSchemaType("");
    setCurrentSchemaData({});
    setEditingSchemaId(null);

    // Show success message
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const handleEditSchema = (schema) => {
    console.log("Editing schema:", schema);
    setSelectedSchemaType(schema.type);
    setCurrentSchemaData({ ...schema.data });
    setEditingSchemaId(schema.id);
    setPreviewSchemaId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSchema = (schemaId) => {
    if (!confirm("Are you sure you want to delete this schema?")) {
      return;
    }

    const updatedSchemas = savedSchemas.filter((s) => s.id !== schemaId);

    const updatedPageSettings = {
      ...pageSettings,
      schemas: updatedSchemas,
    };

    updateSetting(pageKey, updatedPageSettings);

    if (editingSchemaId === schemaId) {
      setSelectedSchemaType("");
      setCurrentSchemaData({});
      setEditingSchemaId(null);
    }

    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const toggleSchemaPreview = (schemaId) => {
    setPreviewSchemaId(previewSchemaId === schemaId ? null : schemaId);
  };

  const generateSchemaJSON = (schema) => {
    const schemaConfig = SCHEMA_TYPES[schema.type];
    if (!schemaConfig?.builder) return null;
    return schemaConfig.builder(schema.data);
  };

  const generateAllSchemasJSON = () => {
    const allSchemas = [];

    // Add global schemas if viewing a specific page
    if (selectedPage !== "global") {
      const globalSettings = settings.page_global || {};
      const globalSchemas = globalSettings.schemas || [];
      globalSchemas.forEach((schema) => {
        const json = generateSchemaJSON(schema);
        if (json) allSchemas.push(json);
      });
    }

    // Add current page schemas
    savedSchemas.forEach((schema) => {
      const json = generateSchemaJSON(schema);
      if (json) allSchemas.push(json);
    });

    return allSchemas;
  };

  const handleCancelEdit = () => {
    setSelectedSchemaType("");
    setCurrentSchemaData({});
    setEditingSchemaId(null);
  };

  const SchemaComponent = selectedSchemaType
    ? SCHEMA_TYPES[selectedSchemaType]?.component
    : null;
  const currentSchemaConfig = selectedSchemaType
    ? SCHEMA_TYPES[selectedSchemaType]
    : null;

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading schema settings..." />;
  }

  console.log("=== RENDER ===");
  console.log("Saved Schemas:", savedSchemas);
  console.log("Saved Schemas Length:", savedSchemas.length);

  return (
    <div className={styles.socialMedia}>
      {/* Success Alert */}
      {showSaveAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>✓</span>
            <span className={styles.alertText}>
              Schema {editingSchemaId ? "updated" : "saved"} successfully!
            </span>
            <button
              className={styles.alertClose}
              onClick={() => setShowSaveAlert(false)}
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Page Selector */}
      <div className={styles.pageSelector}>
        <label className={styles.selectorLabel}>
          Configure schema markup for:
        </label>
        <select
          className={styles.pageSelect}
          value={selectedPage}
          onChange={(e) => handlePageChange(e.target.value)}
        >
          <option value="global">🌍 Global Defaults (All Pages)</option>
          {pages
            .filter((page) => page.id !== "global")
            .map((page) => (
              <option key={page.id} value={page.id}>
                📄 {page.title}
                {page.url ? ` (${page.url})` : ""}
              </option>
            ))}
        </select>

        {selectedPage !== "global" && (
          <div className={styles.inheritanceInfo}>
            <p>
              <strong>
                Editing: {pages.find((p) => p.id === selectedPage)?.title}
              </strong>
            </p>
            <p className={styles.helpText}>
              Page-specific schemas will be combined with global schemas.
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {apiError && (
        <div className={styles.errorAlert}>
          <p>{apiError}</p>
        </div>
      )}

      {/* Schema Type Selection */}
      <div className={styles.pageSelector}>
        <label className={styles.selectorLabel}>
          {editingSchemaId ? "Edit Schema" : "Add New Schema"}
        </label>

        <select
          className={styles.pageSelect}
          value={selectedSchemaType || ""}
          onChange={(e) => handleSchemaTypeChange(e.target.value)}
        >
          <option value="">-- Select a Schema Type --</option>
          {Object.keys(SCHEMA_TYPES).map((typeKey) => {
            const config = SCHEMA_TYPES[typeKey];
            const count = getSchemaTypeCount(typeKey);
            const canAdd = canAddMoreOfType(typeKey);

            return (
              <option
                key={typeKey}
                value={typeKey}
                disabled={!editingSchemaId && !canAdd}
              >
                {config.label}
                {count > 0 ? ` (${count} existing)` : ""}
                {!canAdd && !editingSchemaId ? " - Limit reached" : ""}
              </option>
            );
          })}
        </select>

        {currentSchemaConfig?.allowMultiple && !editingSchemaId && (
          <div className={styles.inheritanceInfo} style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: "0.9rem", margin: 0 }}>
              💡 <strong>Multiple schemas allowed:</strong> You can add as many{" "}
              {currentSchemaConfig.label} schemas as needed.
            </p>
          </div>
        )}
      </div>

      {/* Schema Form */}
      {SchemaComponent && (
        <div className={styles.sectionsContainer}>
          <div className={styles.section}>
            <div className={styles.sectionContent}>
              <div className={styles.fieldsContainer}>
                <SchemaComponent
                  value={currentSchemaData}
                  onChange={setCurrentSchemaData}
                />
              </div>
            </div>
          </div>

          <div className={styles.saveSection}>
            <button
              className={`${styles.saveButton} ${styles.hasChanges}`}
              onClick={handleSchemaSave}
            >
              {editingSchemaId ? "Update Schema" : "Save Schema"}
            </button>

            {editingSchemaId && (
              <button
                className={styles.saveButton}
                onClick={handleCancelEdit}
                style={{ marginLeft: "1rem", background: "#6c757d" }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* SAVED SCHEMAS LIST */}
      {savedSchemas.length > 0 && (
        <div className={styles.sectionsContainer}>
          <div className={styles.pageSelector}>
            <label className={styles.selectorLabel}>
              Saved Schemas ({savedSchemas.length})
            </label>
          </div>

          {savedSchemas.map((schema) => {
            const schemaConfig = SCHEMA_TYPES[schema.type];
            const schemaName =
              schema.data?.name ||
              schema.data?.headline ||
              schema.data?.title ||
              "Untitled";
            const scopeLabel =
              selectedPage === "global"
                ? "Global"
                : pages.find((p) => p.id === selectedPage)?.title ||
                  selectedPage;

            return (
              <div key={schema.id} className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <h3>{schemaConfig?.label || schema.type}</h3>
                    <span className={styles.sectionCount}>
                      {schemaName} • {scopeLabel}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className={styles.saveButton}
                      onClick={() => toggleSchemaPreview(schema.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.9rem",
                        background:
                          previewSchemaId === schema.id ? "#0073aa" : "#6c757d",
                      }}
                    >
                      {previewSchemaId === schema.id
                        ? "Hide Preview"
                        : "Preview"}
                    </button>

                    <button
                      className={styles.saveButton}
                      onClick={() => handleEditSchema(schema)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.9rem",
                        background: "#ffc107",
                        color: "#000",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.saveButton}
                      onClick={() => handleDeleteSchema(schema.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "0.9rem",
                        background: "#dc3545",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Individual Schema Preview */}
                {previewSchemaId === schema.id && (
                  <div className={styles.sectionContent}>
                    <label className={styles.selectorLabel}>
                      JSON-LD Output:
                    </label>
                    <pre
                      style={{
                        background: "#282c34",
                        color: "#abb2bf",
                        padding: "1rem",
                        borderRadius: "4px",
                        overflow: "auto",
                        fontSize: "0.85rem",
                        lineHeight: "1.4",
                        maxHeight: "400px",
                        margin: 0,
                      }}
                    >
                      {JSON.stringify(generateSchemaJSON(schema), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ALL SCHEMAS PREVIEW */}
      <div className={styles.pageSelector}>
        <button
          type="button"
          className={styles.saveButton}
          onClick={() => setShowAllPreview(!showAllPreview)}
          style={{ marginRight: "1rem" }}
        >
          {showAllPreview ? "Hide Full Preview" : "Show All Schemas Preview"}
        </button>

        {selectedPage !== "global" && (
          <div
            className={styles.inheritanceInfo}
            style={{ marginTop: "0.5rem" }}
          >
            <small>
              This preview shows ALL schemas that will be output on this page
              (Global + Page-specific).
            </small>
          </div>
        )}
      </div>

      {showAllPreview && (
        <div className={styles.pageSelector} style={{ background: "#f8f9fa" }}>
          <label className={styles.selectorLabel}>
            Complete JSON-LD Output
          </label>

          {selectedPage !== "global" && (
            <div
              style={{
                padding: "0.75rem",
                background: "#e3f2fd",
                borderRadius: "4px",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <strong>What you're seeing:</strong>
              <ul style={{ margin: "0.5rem 0 0 1.5rem", paddingLeft: 0 }}>
                <li>
                  ✅ <strong>Global schemas</strong> that apply to all pages
                </li>
                <li>
                  ✅ <strong>Page-specific schemas</strong> for this page
                </li>
                <li>All schemas will be combined in the output</li>
              </ul>
            </div>
          )}

          <pre
            style={{
              background: "#282c34",
              color: "#abb2bf",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "0.85rem",
              lineHeight: "1.4",
              maxHeight: "600px",
            }}
          >
            {JSON.stringify(generateAllSchemasJSON(), null, 2)}
          </pre>
        </div>
      )}

      {/* ADD THIS: */}
      <ReviewPublishButton
        onSave={handleSchemaSave}
        hasChanges={true}
        isSaving={false}
      />
    </div>
  );
};

export default SchemaTab;
