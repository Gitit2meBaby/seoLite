// assets/js/components/tabs/SchemaMarkup.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import ServiceCatalogInput from "../common/ServiceCatalogInput";
import { fieldDefinitions, schemaTypes, serviceOptions } from "./schemaTypes";
import styles from "@css/components/tabs/GeneralMeta.module.scss";

const SchemaMarkup = ({ tabId, config }) => {
  const {
    settings,
    updateSetting,
    loadPageSettings,
    savePageSettings,
    loadPages,
    isSaving,
  } = useSettings();

  const [selectedPage, setSelectedPage] = useState("global");
  const [pages, setPages] = useState([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [activeSchemaType, setActiveSchemaType] = useState("");

  // Load pages on component mount
  useEffect(() => {
    loadPagesFromWordPress();
    loadPageSettings(selectedPage);
  }, []);

  // Load page settings when selection changes
  useEffect(() => {
    if (selectedPage) {
      loadPageSettings(selectedPage);
    }
  }, [selectedPage]);

  // Set active schema type based on current settings
  useEffect(() => {
    const currentSchemaType = getFieldValue("schemaType");
    setActiveSchemaType(currentSchemaType);
  }, [settings, selectedPage]);

  const loadPagesFromWordPress = async () => {
    try {
      setIsLoadingPages(true);
      setApiError(null);
      const fetchedPages = await loadPages();
      if (fetchedPages && fetchedPages.length > 0) {
        setPages(fetchedPages);
      } else {
        setApiError(
          "No pages found. The WordPress API might not be working properly."
        );
        setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
      }
    } catch (error) {
      setApiError(`API Error: ${error.message}`);
      setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const getFieldValue = (fieldKey) => {
    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    if (selectedPage === "global") {
      return globalSettings[fieldKey] || "";
    } else {
      if (
        pageSettings[fieldKey] !== undefined &&
        pageSettings[fieldKey] !== ""
      ) {
        return pageSettings[fieldKey];
      } else {
        return globalSettings[fieldKey] || "";
      }
    }
  };

  const getFieldStatus = (fieldKey) => {
    if (selectedPage === "global") return "global";

    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    const pageValue = pageSettings[fieldKey];
    const globalValue = globalSettings[fieldKey];

    if (pageValue !== undefined && pageValue !== "") {
      if (JSON.stringify(pageValue) === JSON.stringify(globalValue)) {
        return "inherited";
      } else {
        return "unique";
      }
    }

    if (globalValue) {
      return "using_global";
    }

    return "empty";
  };

  const handleFieldChange = (fieldKey, value) => {
    const pageKey = `page_${selectedPage}`;
    const currentPageSettings = settings[pageKey] || {};

    // Handle schema type change specially
    if (fieldKey === "schemaType") {
      setActiveSchemaType(value);
    }

    const updatedPageSettings = {
      ...currentPageSettings,
      [fieldKey]: value,
    };

    updateSetting(pageKey, updatedPageSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    const pageSettings = settings[`page_${selectedPage}`] || {};

    try {
      const result = await savePageSettings(selectedPage, pageSettings);

      if (result.success) {
        setHasChanges(false);
        setShowSaveAlert(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setShowSaveAlert(false), 3000);

        // Verify what was actually saved by re-loading
        const reloadedSettings = await loadPageSettings(selectedPage);
      } else {
        console.error("❌ Save failed:", result.message);
        alert(`Failed to save settings: ${result.message}`);
      }
    } catch (error) {
      console.error("💥 Exception in handleSave:", error);
      alert(`Error during save: ${error.message}`);
    }
  };

  const generateSchemaJSON = () => {
    const pageSettings = settings[`page_${selectedPage}`] || {};
    const globalSettings = settings["page_global"] || {};

    const getValue = (key) => {
      if (pageSettings[key] !== undefined && pageSettings[key] !== "") {
        return pageSettings[key];
      }
      return globalSettings[key] || "";
    };

    const schemaType = getValue("schemaType");
    if (!schemaType) {
      return {
        "@context": "https://schema.org",
        "@type": "Thing",
        name: "Please select a schema type first",
      };
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": schemaType,
    };

    // Get available fields for this schema type
    const typeConfig = schemaTypes[schemaType];
    if (!typeConfig) return schema;

    const fieldsToInclude = typeConfig.fields || [];

    fieldsToInclude.forEach((fieldKey) => {
      const fieldDef = fieldDefinitions[fieldKey];
      if (!fieldDef) return;

      const value = getValue(fieldKey);
      if (!value) return;

      // Handle different field types
      if (
        fieldDef.type === "serviceArray" &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        // Convert service array to proper schema format
        schema.hasOfferCatalog = {
          "@type": "OfferCatalog",
          name: "Our Services",
          itemListElement: value.map((service, index) => ({
            "@type": "Offer",
            "@id": `#service-${index + 1}`,
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.description || undefined,
              serviceType: service.serviceType || undefined,
              areaServed: service.areaServed || undefined,
            },
          })),
        };
      } else if (fieldDef.type === "object" && typeof value === "object") {
        const objValue = {};
        Object.keys(fieldDef.subfields || {}).forEach((subKey) => {
          if (value[subKey]) {
            objValue[subKey] = value[subKey];
          }
        });
        if (Object.keys(objValue).length > 0) {
          schema[fieldKey] = objValue;
        }
      } else if (fieldDef.type === "array") {
        if (Array.isArray(value) && value.length > 0) {
          schema[fieldKey] = value;
        } else if (typeof value === "string" && value.trim()) {
          // Convert string to array (split by newlines for text arrays)
          schema[fieldKey] = value.split("\n").filter((item) => item.trim());
        }
      } else if (value) {
        schema[fieldKey] = value;
      }
    });

    // Add special computed fields
    if (schemaType === "WebSite") {
      schema.potentialAction = {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: getValue("url") + "/?s={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      };
    }

    return schema;
  };

  const generateSchemaCode = () => {
    const schema = generateSchemaJSON();
    return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
  };

  const MediaHelper = () => (
    <span
      className={styles.mediaHelper}
      title="Upload your image to WordPress Media Library, then copy the URL here"
      style={{
        marginLeft: "8px",
        cursor: "help",
        color: "#666",
        fontSize: "14px",
      }}
    >
      ❓
    </span>
  );

  const shouldShowField = (fieldKey) => {
    const fieldDef = fieldDefinitions[fieldKey];
    if (!fieldDef) return false;

    // Check dependencies
    if (fieldDef.dependsOn) {
      const { field, values } = fieldDef.dependsOn;
      const dependentValue = getFieldValue(field);
      return values.includes(dependentValue);
    }

    return true;
  };

  const renderField = (fieldKey) => {
    if (!shouldShowField(fieldKey)) return null;

    const fieldDef = fieldDefinitions[fieldKey];
    if (!fieldDef) return null;

    const currentValue = getFieldValue(fieldKey);
    const fieldStatus = getFieldStatus(fieldKey);
    const isInherited = fieldStatus === "inherited";
    const isUsingGlobal = fieldStatus === "using_global";
    const isUnique = fieldStatus === "unique";

    if (fieldDef.global && selectedPage !== "global") {
      return null;
    }

    const currentPage = pages.find((p) => p.id === selectedPage);
    const pageSlug = currentPage?.title || selectedPage;

    return (
      <div key={fieldKey} className={styles.field}>
        <label className={styles.label}>
          {fieldDef.label}
          {fieldDef.required && <span style={{ color: "red" }}> *</span>}
          {fieldDef.hasMediaHelper && <MediaHelper />}
          {fieldDef.global && (
            <span className={styles.globalBadge}>Global Only</span>
          )}
          {isInherited && (
            <span className={styles.inheritedBadge}>Inherited from Global</span>
          )}
          {isUsingGlobal && (
            <span className={styles.usingGlobalBadge}>Using Global Value</span>
          )}
          {isUnique && (
            <span className={styles.uniqueBadge}>Unique to {pageSlug}</span>
          )}
          {fieldDef.description && (
            <span className={styles.description}>{fieldDef.description}</span>
          )}
          {fieldDef.helpText && (
            <div
              style={{
                marginTop: "4px",
                padding: "8px",
                background: "#fff3cd",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#856404",
              }}
            >
              💡 {fieldDef.helpText}
            </div>
          )}
        </label>

        {renderFieldInput(
          fieldKey,
          fieldDef,
          currentValue,
          isUsingGlobal,
          isInherited
        )}

        {isUsingGlobal && (
          <div className={styles.usingGlobalNote}>
            This page will automatically use the global value. Start typing to
            customize it specifically for this page.
          </div>
        )}

        {isUnique && (
          <div className={styles.uniqueNote}>
            This value is customized specifically for this page.
          </div>
        )}
      </div>
    );
  };

  const renderFieldInput = (
    fieldKey,
    fieldDef,
    currentValue,
    isUsingGlobal,
    isInherited
  ) => {
    const baseClasses = `${isUsingGlobal ? styles.usingGlobal : ""} ${
      isInherited ? styles.inherited : ""
    }`;

    switch (fieldDef.type) {
      case "serviceArray":
        const currentServices = Array.isArray(currentValue) ? currentValue : [];
        return (
          <ServiceCatalogInput
            value={currentServices}
            onChange={(services) => handleFieldChange(fieldKey, services)}
            schemaType={activeSchemaType}
            className={baseClasses}
          />
        );

      case "textarea":
        return (
          <div className={styles.textareaWrapper}>
            <textarea
              className={`${styles.textarea} ${baseClasses}`}
              value={currentValue || ""}
              onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              placeholder={fieldDef.placeholder}
              maxLength={fieldDef.maxLength}
              rows={fieldDef.rows || 3}
            />
            {fieldDef.maxLength && (
              <div className={styles.charCount}>
                {(currentValue || "").length}/{fieldDef.maxLength}
              </div>
            )}
          </div>
        );

      case "select":
        return (
          <select
            className={`${styles.select} ${baseClasses}`}
            value={currentValue || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          >
            {fieldDef.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "array":
        if (fieldDef.arrayType === "select") {
          // Multi-select for arrays
          return (
            <div>
              <select
                className={`${styles.select} ${baseClasses}`}
                multiple
                value={Array.isArray(currentValue) ? currentValue : []}
                onChange={(e) => {
                  const selectedValues = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  handleFieldChange(fieldKey, selectedValues);
                }}
                style={{ height: "120px" }}
              >
                {fieldDef.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <small
                style={{ display: "block", marginTop: "4px", color: "#666" }}
              >
                Hold Ctrl/Cmd to select multiple options
              </small>
            </div>
          );
        } else {
          // Text area for arrays (one item per line)
          const arrayValue = Array.isArray(currentValue)
            ? currentValue.join("\n")
            : currentValue || "";
          return (
            <div className={styles.textareaWrapper}>
              <textarea
                className={`${styles.textarea} ${baseClasses}`}
                value={arrayValue}
                onChange={(e) => {
                  const lines = e.target.value
                    .split("\n")
                    .filter((line) => line.trim());
                  handleFieldChange(fieldKey, lines);
                }}
                placeholder={fieldDef.placeholder + "\n(one per line)"}
                rows={4}
              />
              <small
                style={{ display: "block", marginTop: "4px", color: "#666" }}
              >
                Enter one item per line
              </small>
            </div>
          );
        }

      case "object":
        const objValue = currentValue || {};
        return (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "4px",
              background: "#fafafa",
            }}
          >
            {Object.entries(fieldDef.subfields || {}).map(
              ([subKey, subField]) => (
                <div key={subKey} style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {subField.label}
                  </label>
                  {subField.type === "select" ? (
                    <select
                      className={styles.select}
                      value={objValue[subKey] || subField.value || ""}
                      onChange={(e) => {
                        const newObjValue = {
                          ...objValue,
                          [subKey]: e.target.value,
                        };
                        handleFieldChange(fieldKey, newObjValue);
                      }}
                      style={{ width: "100%" }}
                    >
                      {subField.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : subField.type === "textarea" ? (
                    <textarea
                      className={styles.textarea}
                      value={objValue[subKey] || ""}
                      onChange={(e) => {
                        const newObjValue = {
                          ...objValue,
                          [subKey]: e.target.value,
                        };
                        handleFieldChange(fieldKey, newObjValue);
                      }}
                      placeholder={subField.placeholder}
                      rows={2}
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <input
                      type={subField.type}
                      className={styles.input}
                      value={objValue[subKey] || ""}
                      onChange={(e) => {
                        const newObjValue = {
                          ...objValue,
                          [subKey]: e.target.value,
                        };
                        handleFieldChange(fieldKey, newObjValue);
                      }}
                      placeholder={subField.placeholder}
                      min={subField.min}
                      max={subField.max}
                      step={subField.step}
                      style={{ width: "100%" }}
                    />
                  )}
                </div>
              )
            )}
          </div>
        );

      default:
        return (
          <div className={styles.inputWrapper}>
            <input
              type={fieldDef.type}
              className={`${styles.input} ${baseClasses}`}
              value={currentValue || ""}
              onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              placeholder={fieldDef.placeholder}
              maxLength={fieldDef.maxLength}
              min={fieldDef.min}
              max={fieldDef.max}
              step={fieldDef.step}
            />
            {fieldDef.maxLength && (
              <div className={styles.charCount}>
                {(currentValue || "").length}/{fieldDef.maxLength}
              </div>
            )}
          </div>
        );
    }
  };

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading pages..." />;
  }

  return (
    <div className={styles.generalMeta}>
      {/* Success Alert */}
      {showSaveAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>✅</span>
            <span className={styles.alertText}>
              Schema settings saved successfully!
            </span>
            <button
              className={styles.alertClose}
              onClick={() => setShowSaveAlert(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {apiError && (
        <div className={styles.apiError}>
          <h4>⚠️ API Connection Issue</h4>
          <p>{apiError}</p>
          <p>Only Global settings are available until this is resolved.</p>
          <button onClick={loadPagesFromWordPress}>
            🔄 Retry Loading Pages
          </button>
        </div>
      )}

      <div className={styles.pageSelector}>
        <label className={styles.selectorLabel}>
          Configure schema markup for:
        </label>
        <select
          className={styles.pageSelect}
          value={selectedPage}
          onChange={(e) => {
            setSelectedPage(e.target.value);
            setHasChanges(false);
          }}
        >
          {pages.map((page) => {
            let icon = "";
            let prefix = "";

            if (page.type === "global") {
              icon = "🌐";
              prefix = "Global";
            } else if (page.type === "page") {
              icon = "📄";
              prefix = "Page";
            } else if (page.type === "post") {
              icon = "📝";
              prefix = "Post";
            } else if (page.type === "special") {
              icon = "⭐";
              prefix = "Special";
            }

            return (
              <option key={page.id} value={page.id}>
                {icon} {prefix}: {page.title.replace(/^🌐\s*/, "")}
                {page.url && page.url !== "/" ? ` (${page.url})` : ""}
              </option>
            );
          })}
        </select>

        {selectedPage !== "global" && (
          <div className={styles.inheritanceInfo}>
            <small>
              💡 This page inherits schema settings from Global. Override any
              field to customize it specifically for this page.
            </small>
          </div>
        )}
      </div>

      {/* Schema Type Selection */}
      <div
        className={styles.field}
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f0f8ff",
          borderRadius: "6px",
          border: "2px solid #0073aa",
        }}
      >
        <label
          className={styles.label}
          style={{ fontSize: "1.1rem", fontWeight: "bold" }}
        >
          Schema Type
          <span className={styles.description}>
            Choose the type of content/entity you want to mark up. This
            determines which fields are available.
          </span>
        </label>
        <select
          className={styles.select}
          value={activeSchemaType}
          onChange={(e) => {
            handleFieldChange("schemaType", e.target.value);
          }}
          style={{ fontSize: "1rem", padding: "0.75rem" }}
        >
          {Object.entries(schemaTypes).map(([value, config]) => (
            <option key={value} value={value}>
              {config.label}
            </option>
          ))}
        </select>

        {activeSchemaType && schemaTypes[activeSchemaType]?.extends && (
          <div
            style={{
              marginTop: "8px",
              padding: "8px",
              background: "#fff3cd",
              borderRadius: "4px",
            }}
          >
            <small>
              ℹ️ This schema type extends{" "}
              <strong>{schemaTypes[activeSchemaType].extends}</strong> and
              inherits all its properties.
            </small>
          </div>
        )}
      </div>

      {/* Schema Preview */}
      {activeSchemaType && (
        <div className={styles.previewSection}>
          <h4>Schema Markup Preview</h4>

          <div style={{ marginBottom: "1.5rem" }}>
            <h5 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
              📄 HTML Code:
            </h5>
            <div className={styles.codePreview}>
              <pre className={styles.codeBlock}>
                <code>{generateSchemaCode()}</code>
              </pre>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(generateSchemaCode());
                }}
              >
                📋 Copy HTML
              </button>
            </div>
          </div>

          <div>
            <h5 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
              🔧 JSON Structure:
            </h5>
            <div className={styles.codePreview}>
              <pre
                className={styles.codeBlock}
                style={{ background: "#1a1a1a", color: "#00ff41" }}
              >
                <code>{JSON.stringify(generateSchemaJSON(), null, 2)}</code>
              </pre>
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(generateSchemaJSON(), null, 2)
                  );
                }}
              >
                📋 Copy JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schema Fields */}
      {activeSchemaType && (
        <div className={styles.fieldsContainer}>
          <h4
            style={{
              margin: "2rem 0 1rem 0",
              padding: "0.5rem 0",
              borderBottom: "2px solid #0073aa",
              color: "#0073aa",
            }}
          >
            {schemaTypes[activeSchemaType]?.label} Properties
          </h4>

          {schemaTypes[activeSchemaType]?.fields?.map((fieldKey) =>
            fieldDefinitions[fieldKey] ? renderField(fieldKey) : null
          )}
        </div>
      )}

      {!activeSchemaType && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            color: "#666",
            background: "#f9f9f9",
            borderRadius: "8px",
            margin: "2rem 0",
          }}
        >
          <h3 style={{ color: "#333", marginBottom: "1rem" }}>
            👆 Select a Schema Type
          </h3>
          <p>
            Choose a schema type above to configure structured data for your
            content.
          </p>
          <p>
            Schema markup helps search engines understand your content and can
            improve your search results with rich snippets.
          </p>
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? "Saving..." : "Save Schema Settings"}
        </button>

        {hasChanges && (
          <span className={styles.unsavedChanges}>
            You have unsaved changes
          </span>
        )}
      </div>
    </div>
  );
};

export default SchemaMarkup;
