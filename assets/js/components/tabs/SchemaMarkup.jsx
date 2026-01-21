// // assets/js/components/tabs/SchemaMarkup.jsx
// import { useState, useEffect } from "react";
// import { useSettings } from "../../providers/SettingsProvider";
// import LoadingSpinner from "../common/LoadingSpinner";
// import ServiceCatalogInput from "../common/ServiceCatalogInput";
// import ProductCatalogInput from "../common/ProductCatalogInput";
// import { fieldDefinitions, schemaTypes } from "./schemaTypes";
// import styles from "@css/components/tabs/SocialMedia.module.scss"; // Reusing the collapsible styles
// import MultipleSchemaEntries from "../common/MultipleSchemaEntries";

// const SchemaMarkup = ({ tabId, config }) => {
//   const {
//     settings,
//     updateSetting,
//     loadPageSettings,
//     savePageSettings,
//     loadPages,
//     isSaving,
//   } = useSettings();

//   const [selectedPage, setSelectedPage] = useState("global");
//   const [pages, setPages] = useState([]);
//   const [isLoadingPages, setIsLoadingPages] = useState(true);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [showSaveAlert, setShowSaveAlert] = useState(false);
//   const [activeSchemaType, setActiveSchemaType] = useState("");
//   const [showPreview, setShowPreview] = useState(false);

//   // Load pages on component mount
//   useEffect(() => {
//     loadPagesFromWordPress();
//     loadPageSettings(selectedPage);
//   }, []);

//   // Load page settings when selection changes
//   useEffect(() => {
//     if (selectedPage) {
//       loadPageSettings(selectedPage);
//     }
//   }, [selectedPage]);

//   // Set active schema type based on current settings
//   useEffect(() => {
//     const currentSchemaType = getFieldValue("schemaType");

//     console.log("=== useEffect updating activeSchemaType ===");
//     console.log("currentSchemaType from getFieldValue:", currentSchemaType);

//     // Only set if it's a valid schema type, otherwise keep empty
//     if (currentSchemaType && schemaTypes[currentSchemaType]) {
//       console.log("Setting activeSchemaType to:", currentSchemaType);
//       setActiveSchemaType(currentSchemaType);
//     } else {
//       console.log("Setting activeSchemaType to empty");
//       setActiveSchemaType("");
//     }
//   }, [selectedPage, settings]); // Add settings as dependency!

//   const loadPagesFromWordPress = async () => {
//     try {
//       setIsLoadingPages(true);
//       setApiError(null);
//       const fetchedPages = await loadPages();
//       if (fetchedPages && fetchedPages.length > 0) {
//         setPages(fetchedPages);
//       } else {
//         setApiError(
//           "No pages found. The WordPress API might not be working properly.",
//         );
//         setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
//       }
//     } catch (error) {
//       setApiError(`API Error: ${error.message}`);
//       setPages([{ id: "global", title: "Global Defaults", type: "global" }]);
//     } finally {
//       setIsLoadingPages(false);
//     }
//   };

//   const getFieldValue = (fieldKey) => {
//     const pageKey = `page_${selectedPage}`;
//     const pageSettings = settings[pageKey] || {};
//     const globalSettings = settings["page_global"] || {};

//     console.log(`getFieldValue(${fieldKey}):`, {
//       selectedPage,
//       pageKey,
//       activeSchemaType,
//     });

//     // If requesting schemaType, return it directly (not namespaced)
//     if (fieldKey === "schemaType") {
//       if (selectedPage === "global") {
//         return globalSettings.schemaType || "";
//       } else {
//         return pageSettings.schemaType || globalSettings.schemaType || "";
//       }
//     }

//     // For all other fields, look in the namespaced schema data
//     if (selectedPage === "global") {
//       const globalSchemas = globalSettings.schemas || {};
//       const schemaData = globalSchemas[activeSchemaType] || {};
//       return schemaData[fieldKey] || "";
//     } else {
//       // For specific pages, check page-specific data first, then global
//       const pageSchemas = pageSettings.schemas || {};
//       const globalSchemas = globalSettings.schemas || {};

//       const pageSchemaData = pageSchemas[activeSchemaType] || {};
//       const globalSchemaData = globalSchemas[activeSchemaType] || {};

//       // Return page value if it exists, otherwise global value
//       if (
//         pageSchemaData[fieldKey] !== undefined &&
//         pageSchemaData[fieldKey] !== ""
//       ) {
//         return pageSchemaData[fieldKey];
//       } else {
//         return globalSchemaData[fieldKey] || "";
//       }
//     }
//   };

//   const getFieldStatus = (fieldKey) => {
//     if (selectedPage === "global") return "global";

//     const pageKey = `page_${selectedPage}`;
//     const pageSettings = settings[pageKey] || {};
//     const globalSettings = settings["page_global"] || {};

//     // Handle schemaType field (not namespaced)
//     if (fieldKey === "schemaType") {
//       const pageValue = pageSettings.schemaType;
//       const globalValue = globalSettings.schemaType;

//       if (pageValue !== undefined && pageValue !== "") {
//         if (pageValue === globalValue) {
//           return "inherited";
//         } else {
//           return "unique";
//         }
//       } else {
//         return "using_global";
//       }
//     }

//     // Handle namespaced schema data
//     const pageSchemas = pageSettings.schemas || {};
//     const globalSchemas = globalSettings.schemas || {};

//     const pageSchemaData = pageSchemas[activeSchemaType] || {};
//     const globalSchemaData = globalSchemas[activeSchemaType] || {};

//     const pageValue = pageSchemaData[fieldKey];
//     const globalValue = globalSchemaData[fieldKey];

//     if (pageValue !== undefined && pageValue !== "") {
//       if (JSON.stringify(pageValue) === JSON.stringify(globalValue)) {
//         return "inherited";
//       } else {
//         return "unique";
//       }
//     } else {
//       return "using_global";
//     }
//   };

//   const handleFieldChange = (fieldKey, value) => {
//     console.log("=== handleFieldChange called ===");
//     console.log("fieldKey:", fieldKey);
//     console.log("value:", value);
//     console.log("activeSchemaType:", activeSchemaType);
//     console.log("selectedPage:", selectedPage);

//     const pageKey = `page_${selectedPage}`;
//     console.log("pageKey:", pageKey);

//     // Get current page settings
//     const currentPageSettings = settings[pageKey] || {};

//     // IMPORTANT: If changing schemaType, just update that field directly
//     if (fieldKey === "schemaType") {
//       const updatedPageSettings = {
//         ...currentPageSettings,
//         schemaType: value,
//       };
//       console.log("Updating schemaType to:", value);
//       updateSetting(pageKey, updatedPageSettings);
//       setHasChanges(true);
//       setActiveSchemaType(value);
//       return;
//     }

//     // Check if activeSchemaType is set
//     if (!activeSchemaType) {
//       console.error(
//         "❌ ERROR: activeSchemaType is empty! Cannot save field:",
//         fieldKey,
//       );
//       console.error("This means schemaType hasn't been selected yet.");
//       console.error("Current settings:", currentPageSettings);
//       // Don't save if we don't know which schema type this belongs to
//       return;
//     }

//     // For all other fields, store them namespaced under the schema type
//     // Structure: { schemas: { Organization: { name: "...", url: "..." }, Article: { ... } } }
//     const currentSchemas = currentPageSettings.schemas || {};
//     const currentSchemaData = currentSchemas[activeSchemaType] || {};

//     console.log("Current schemas object:", currentSchemas);
//     console.log(`Current data for ${activeSchemaType}:`, currentSchemaData);

//     // Update the field within this schema type's data
//     const updatedSchemaData = {
//       ...currentSchemaData,
//       [fieldKey]: value,
//     };

//     // Update the schemas object
//     const updatedSchemas = {
//       ...currentSchemas,
//       [activeSchemaType]: updatedSchemaData,
//     };

//     // Update the page settings with the new schemas object
//     const updatedPageSettings = {
//       ...currentPageSettings,
//       schemas: updatedSchemas,
//     };

//     console.log("✅ Saving in namespaced format:");
//     console.log("updatedSchemaData:", updatedSchemaData);
//     console.log("updatedSchemas:", updatedSchemas);
//     console.log("updatedPageSettings:", updatedPageSettings);

//     updateSetting(pageKey, updatedPageSettings);
//     setHasChanges(true);
//   };

//   const handlePageChange = (pageId) => {
//     setSelectedPage(pageId);
//     setHasChanges(false);
//   };

//   const handleSave = async () => {
//     const pageSettings = settings[`page_${selectedPage}`] || {};

//     console.log("=== Saving Schema Settings ===");
//     console.log("selectedPage:", selectedPage);
//     console.log("pageSettings:", pageSettings);

//     try {
//       const result = await savePageSettings(selectedPage, pageSettings);

//       console.log("Save result:", result);

//       if (result.success) {
//         setHasChanges(false);
//         setShowSaveAlert(true);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         setTimeout(() => setShowSaveAlert(false), 3000);

//         // Reload the page settings to show the saved data
//         await loadPageSettings(selectedPage);
//       } else {
//         setApiError(
//           `Failed to save settings: ${result.message || "Unknown error"}`,
//         );
//       }
//     } catch (error) {
//       console.error("Save failed:", error);
//       setApiError(`Save failed: ${error.message}`);
//     }
//   };

//   const TooltipHelper = ({ tooltipText }) => (
//     <span className={styles.mediaHelper}>
//       <span className={styles.tooltipTrigger} data-tooltip={tooltipText}>
//         â„¹ï¸
//       </span>
//     </span>
//   );

//   const generateSchemaJSON = () => {
//     const pageSettings = settings[`page_${selectedPage}`] || {};
//     const globalSettings = settings["page_global"] || {};

//     // === DEBUG LOGGING ===
//     console.log("=== generateSchemaJSON called ===");
//     console.log("selectedPage:", selectedPage);
//     console.log("activeSchemaType:", activeSchemaType);
//     console.log("pageSettings:", pageSettings);
//     console.log("globalSettings:", globalSettings);
//     console.log("globalSettings.schemas:", globalSettings.schemas);
//     console.log("pageSettings.schemas:", pageSettings.schemas);
//     // === END DEBUG ===

//     // Get the schemas objects
//     const globalSchemas = globalSettings.schemas || {};
//     const pageSchemas = pageSettings.schemas || {};

//     console.log("globalSchemas keys:", Object.keys(globalSchemas));
//     console.log("pageSchemas keys:", Object.keys(pageSchemas));

//     // Function to generate a single schema from schema data
//     const generateSingleSchema = (schemaType, schemaData) => {
//       if (!schemaType || !schemaData || Object.keys(schemaData).length === 0) {
//         return null;
//       }

//       // Handle Product schema type
//       if (schemaType === "Product") {
//         const products = schemaData.products;
//         if (!Array.isArray(products) || products.length === 0) {
//           return null;
//         }

//         // If only one product, return single Product schema
//         if (products.length === 1) {
//           const product = products[0];
//           return {
//             "@context": "https://schema.org",
//             "@type": "Product",
//             name: product.name || "Unnamed Product",
//             description: product.description || undefined,
//             image: product.image || undefined,
//             brand: product.brand
//               ? { "@type": "Brand", name: product.brand }
//               : undefined,
//             sku: product.sku || undefined,
//             offers: {
//               "@type": "Offer",
//               price: product.price || undefined,
//               priceCurrency: product.currency || "USD",
//               availability: `https://schema.org/${
//                 product.availability || "InStock"
//               }`,
//             },
//           };
//         }

//         // If multiple products, return ItemList of Products
//         return {
//           "@context": "https://schema.org",
//           "@type": "ItemList",
//           name: "Product Catalog",
//           numberOfItems: products.length,
//           itemListElement: products.map((product, index) => ({
//             "@type": "ListItem",
//             position: index + 1,
//             item: {
//               "@type": "Product",
//               name: product.name || `Product ${index + 1}`,
//               description: product.description || undefined,
//               image: product.image || undefined,
//               brand: product.brand
//                 ? { "@type": "Brand", name: product.brand }
//                 : undefined,
//               sku: product.sku || undefined,
//               offers: {
//                 "@type": "Offer",
//                 price: product.price || undefined,
//                 priceCurrency: product.currency || "USD",
//                 availability: `https://schema.org/${
//                   product.availability || "InStock"
//                 }`,
//               },
//             },
//           })),
//         };
//       }

//       // Handle other schema types (Organization, LocalBusiness, etc.)
//       const schema = {
//         "@context": "https://schema.org",
//         "@type": schemaType,
//       };

//       // Get available fields for this schema type
//       const typeConfig = schemaTypes[schemaType];
//       if (!typeConfig) return null;

//       const fieldsToInclude = typeConfig.fields || [];

//       fieldsToInclude.forEach((fieldKey) => {
//         const fieldDef = fieldDefinitions[fieldKey];
//         if (!fieldDef) return;

//         const value = schemaData[fieldKey];
//         if (!value) return;

//         // Handle different field types
//         if (
//           fieldDef.type === "serviceArray" &&
//           Array.isArray(value) &&
//           value.length > 0
//         ) {
//           // Convert service array to proper schema format
//           schema.hasOfferCatalog = {
//             "@type": "OfferCatalog",
//             name: "Our Services",
//             itemListElement: value.map((service, index) => ({
//               "@type": "Offer",
//               "@id": `#service-${index + 1}`,
//               itemOffered: {
//                 "@type": "Service",
//                 name: service.name,
//                 description: service.description || undefined,
//               },
//             })),
//           };
//         } else if (fieldDef.type === "object" && typeof value === "object") {
//           // Handle object fields
//           const objValue = {};
//           Object.keys(fieldDef.subfields || {}).forEach((subKey) => {
//             if (value[subKey]) {
//               objValue[subKey] = value[subKey];
//             }
//           });
//           if (Object.keys(objValue).length > 0) {
//             if (fieldKey === "author" || fieldKey === "publisher") {
//               schema[fieldKey] = {
//                 "@type": fieldKey === "author" ? "Person" : "Organization",
//                 ...objValue,
//               };
//             } else {
//               schema[fieldKey] = objValue;
//             }
//           }
//         } else if (fieldDef.type === "array") {
//           // Handle arrays
//           if (Array.isArray(value) && value.length > 0) {
//             schema[fieldKey] = value;
//           }
//         } else {
//           // Handle simple fields
//           schema[fieldKey] = value;
//         }
//       });

//       // Only return if schema has more than just @context and @type
//       if (Object.keys(schema).length > 2) {
//         return schema;
//       }
//       return null;
//     };

//     // Collect all schemas
//     const allSchemas = [];

//     console.log("=== Collecting Global Schemas ===");
//     // Get all schema types configured globally
//     Object.keys(globalSchemas).forEach((schemaType) => {
//       console.log(
//         `Processing global schema type: ${schemaType}`,
//         globalSchemas[schemaType],
//       );
//       const schema = generateSingleSchema(
//         schemaType,
//         globalSchemas[schemaType],
//       );
//       console.log(`Generated schema for ${schemaType}:`, schema);
//       if (schema) {
//         allSchemas.push({
//           source: "Global",
//           type: schemaType,
//           schema,
//         });
//       }
//     });

//     console.log("=== Collecting Page Schemas ===");
//     // Get all schema types configured for this specific page (if not global)
//     if (selectedPage !== "global") {
//       Object.keys(pageSchemas).forEach((schemaType) => {
//         console.log(
//           `Processing page schema type: ${schemaType}`,
//           pageSchemas[schemaType],
//         );
//         const schema = generateSingleSchema(
//           schemaType,
//           pageSchemas[schemaType],
//         );
//         console.log(`Generated schema for ${schemaType}:`, schema);
//         if (schema) {
//           allSchemas.push({
//             source: `Page: ${pages.find((p) => p.id === selectedPage)?.title || selectedPage}`,
//             type: schemaType,
//             schema,
//           });
//         }
//       });
//     }

//     console.log("=== Final allSchemas array ===", allSchemas);
//     console.log("Total schemas collected:", allSchemas.length);

//     // If no schemas, return a helpful message
//     if (allSchemas.length === 0) {
//       return {
//         "@context": "https://schema.org",
//         "@type": "Thing",
//         name: "No schemas configured yet. Select a schema type and fill in the fields to get started.",
//       };
//     }

//     // If only one schema, return it directly
//     if (allSchemas.length === 1) {
//       return allSchemas[0].schema;
//     }

//     // If multiple schemas, return as an array
//     return allSchemas.map((s) => s.schema);
//   };

//   const renderField = (fieldKey, fieldDef) => {
//     if (!fieldDef) return null;

//     // Check field dependencies
//     if (fieldDef.dependsOn) {
//       const dependencyValue = getFieldValue(fieldDef.dependsOn.field);
//       if (!fieldDef.dependsOn.values.includes(dependencyValue)) {
//         return null;
//       }
//     }

//     const currentValue = getFieldValue(fieldKey);
//     const fieldStatus = getFieldStatus(fieldKey);
//     const isInherited = fieldStatus === "inherited";
//     const isUsingGlobal = fieldStatus === "using_global";
//     const isUnique = fieldStatus === "unique";

//     const currentPage = pages.find((p) => p.id === selectedPage);
//     const pageSlug = currentPage?.title || selectedPage;

//     return (
//       <div key={fieldKey} className={styles.field}>
//         <label className={styles.label}>
//           {fieldDef.label}
//           {fieldDef.hasTooltip && (
//             <TooltipHelper tooltipText={fieldDef.tooltipText} />
//           )}

//           {/* Only show badges when NOT on global page */}
//           {selectedPage !== "global" && (
//             <>
//               {isInherited && (
//                 <span
//                   className={styles.inheritedBadge}
//                   title="This value matches the global setting"
//                 >
//                   ðŸ“‹ Inherited
//                 </span>
//               )}
//               {isUsingGlobal && (
//                 <span
//                   className={styles.usingGlobalBadge}
//                   title="Using global default - start typing to customize for this page"
//                 >
//                   ðŸŒ Global
//                 </span>
//               )}
//               {isUnique && (
//                 <span
//                   className={styles.uniqueBadge}
//                   title="This value is unique to this page"
//                 >
//                   â­ Custom
//                 </span>
//               )}
//             </>
//           )}
//         </label>

//         {renderFieldInput(
//           fieldKey,
//           fieldDef,
//           currentValue,
//           isUsingGlobal,
//           isInherited,
//         )}
//       </div>
//     );
//   };

//   const renderFieldInput = (
//     fieldKey,
//     fieldDef,
//     currentValue,
//     isUsingGlobal,
//     isInherited,
//   ) => {
//     const baseClasses = `${isUsingGlobal ? styles.usingGlobal : ""} ${
//       isInherited ? styles.inherited : ""
//     }`;

//     switch (fieldDef.type) {
//       case "multipleProducts":
//         // Render multiple individual product forms
//         const products = Array.isArray(currentValue) ? currentValue : [{}]; // Start with at least one product

//         return (
//           <div className={styles.multipleProductsContainer}>
//             {products.map((product, index) => (
//               <div key={index} className={styles.productForm}>
//                 <div className={styles.productHeader}>
//                   <h4>Product {index + 1}</h4>
//                   {products.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const newProducts = products.filter(
//                           (_, i) => i !== index,
//                         );
//                         handleFieldChange(fieldKey, newProducts);
//                       }}
//                       className={styles.removeProductButton}
//                     >
//                       Remove Product
//                     </button>
//                   )}
//                 </div>

//                 <div className={styles.productFields}>
//                   {/* Product Name */}
//                   <div className={styles.field}>
//                     <label className={styles.label}>
//                       Product Name
//                       <TooltipHelper tooltipText="Name of the specific product" />
//                     </label>
//                     <input
//                       type="text"
//                       className={`${styles.input} ${baseClasses}`}
//                       value={product.name || ""}
//                       onChange={(e) => {
//                         const newProducts = [...products];
//                         newProducts[index] = {
//                           ...product,
//                           name: e.target.value,
//                         };
//                         handleFieldChange(fieldKey, newProducts);
//                       }}
//                       placeholder="product name"
//                     />
//                   </div>

//                   {/* Product Description */}
//                   <div className={styles.field}>
//                     <label className={styles.label}>
//                       Description
//                       <TooltipHelper tooltipText="Detailed description of the product" />
//                     </label>
//                     <textarea
//                       className={`${styles.textarea} ${baseClasses}`}
//                       value={product.description || ""}
//                       onChange={(e) => {
//                         const newProducts = [...products];
//                         newProducts[index] = {
//                           ...product,
//                           description: e.target.value,
//                         };
//                         handleFieldChange(fieldKey, newProducts);
//                       }}
//                       placeholder="A detailed description of the product"
//                       rows={3}
//                     />
//                   </div>

//                   {/* Product Image */}
//                   <div className={styles.field}>
//                     <label className={styles.label}>
//                       Image URL
//                       <TooltipHelper tooltipText="High-quality product image (1200x630px recommended)" />
//                     </label>
//                     <input
//                       type="url"
//                       className={`${styles.input} ${baseClasses}`}
//                       value={product.image || ""}
//                       onChange={(e) => {
//                         const newProducts = [...products];
//                         newProducts[index] = {
//                           ...product,
//                           image: e.target.value,
//                         };
//                         handleFieldChange(fieldKey, newProducts);
//                       }}
//                       placeholder="https://example.com/product-image.jpg"
//                     />
//                   </div>

//                   {/* Brand */}
//                   <div className={styles.field}>
//                     <label className={styles.label}>
//                       Brand
//                       <TooltipHelper tooltipText="Brand or manufacturer of the product" />
//                     </label>
//                     <input
//                       type="text"
//                       className={`${styles.input} ${baseClasses}`}
//                       value={product.brand || ""}
//                       onChange={(e) => {
//                         const newProducts = [...products];
//                         newProducts[index] = {
//                           ...product,
//                           brand: e.target.value,
//                         };
//                         handleFieldChange(fieldKey, newProducts);
//                       }}
//                       placeholder="Apple, Nike, Sony"
//                     />
//                   </div>

//                   {/* SKU */}
//                   <div className={styles.field}>
//                     <label className={styles.label}>
//                       SKU
//                       <TooltipHelper tooltipText="Stock Keeping Unit - your internal product identifier" />
//                     </label>
//                     <input
//                       type="text"
//                       className={`${styles.input} ${baseClasses}`}
//                       value={product.sku || ""}
//                       onChange={(e) => {
//                         const newProducts = [...products];
//                         newProducts[index] = {
//                           ...product,
//                           sku: e.target.value,
//                         };
//                         handleFieldChange(fieldKey, newProducts);
//                       }}
//                       placeholder="ABC123XYZ"
//                     />
//                   </div>

//                   {/* Price and Currency Row */}
//                   <div className={styles.fieldRow}>
//                     <div className={styles.field}>
//                       <label className={styles.label}>
//                         Price
//                         <TooltipHelper tooltipText="Current price of the product" />
//                       </label>
//                       <input
//                         type="number"
//                         className={`${styles.input} ${baseClasses}`}
//                         value={product.price || ""}
//                         onChange={(e) => {
//                           const newProducts = [...products];
//                           newProducts[index] = {
//                             ...product,
//                             price: e.target.value,
//                           };
//                           handleFieldChange(fieldKey, newProducts);
//                         }}
//                         placeholder="29.99"
//                         step="0.01"
//                       />
//                     </div>
//                     <div className={styles.field}>
//                       <label className={styles.label}>
//                         Currency
//                         <TooltipHelper tooltipText="Currency for the product price" />
//                       </label>
//                       <select
//                         className={`${styles.select} ${baseClasses}`}
//                         value={product.currency || "USD"}
//                         onChange={(e) => {
//                           const newProducts = [...products];
//                           newProducts[index] = {
//                             ...product,
//                             currency: e.target.value,
//                           };
//                           handleFieldChange(fieldKey, newProducts);
//                         }}
//                       >
//                         <option value="USD">USD ($)</option>
//                         <option value="EUR">EUR (â‚¬)</option>
//                         <option value="GBP">GBP (Â£)</option>
//                         <option value="CAD">CAD (C$)</option>
//                         <option value="AUD">AUD (A$)</option>
//                         <option value="JPY">JPY (Â¥)</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Availability */}
//                   <div className={styles.field}>
//                     <label className={styles.label}>
//                       Availability
//                       <TooltipHelper tooltipText="Current availability status of the product" />
//                     </label>
//                     <select
//                       className={`${styles.select} ${baseClasses}`}
//                       value={product.availability || "InStock"}
//                       onChange={(e) => {
//                         const newProducts = [...products];
//                         newProducts[index] = {
//                           ...product,
//                           availability: e.target.value,
//                         };
//                         handleFieldChange(fieldKey, newProducts);
//                       }}
//                     >
//                       <option value="InStock">In Stock</option>
//                       <option value="OutOfStock">Out of Stock</option>
//                       <option value="PreOrder">Pre-Order</option>
//                       <option value="Discontinued">Discontinued</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Add More Products Button */}
//             <button
//               type="button"
//               onClick={() => {
//                 const newProducts = [...products, {}];
//                 handleFieldChange(fieldKey, newProducts);
//               }}
//               className={styles.addProductButton}
//             >
//               + Add More Products
//             </button>
//           </div>
//         );

//       case "serviceArray":
//         const currentServices = Array.isArray(currentValue) ? currentValue : [];
//         return (
//           <ServiceCatalogInput
//             value={currentServices}
//             onChange={(services) => handleFieldChange(fieldKey, services)}
//             schemaType={activeSchemaType}
//             className={baseClasses}
//           />
//         );

//       case "textarea":
//         return (
//           <div className={styles.textareaWrapper}>
//             <textarea
//               className={`${styles.textarea} ${baseClasses}`}
//               value={currentValue || ""}
//               onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
//               placeholder={fieldDef.placeholder}
//               maxLength={fieldDef.maxLength}
//               rows={fieldDef.rows || 3}
//             />
//             {fieldDef.maxLength && (
//               <div className={styles.charCount}>
//                 {(currentValue || "").length}/{fieldDef.maxLength}
//               </div>
//             )}
//           </div>
//         );

//       case "select":
//         return (
//           <select
//             className={`${styles.select} ${baseClasses}`}
//             value={currentValue || ""}
//             onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
//           >
//             {fieldDef.options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         );

//       case "array":
//         if (fieldDef.arrayType === "url") {
//           const arrayValue = Array.isArray(currentValue)
//             ? currentValue.join("\n")
//             : currentValue || "";
//           return (
//             <textarea
//               className={`${styles.textarea} ${baseClasses}`}
//               value={arrayValue}
//               onChange={(e) => {
//                 const urls = e.target.value
//                   .split("\n")
//                   .filter((url) => url.trim());
//                 handleFieldChange(fieldKey, urls);
//               }}
//               placeholder={fieldDef.placeholder + "\n(one URL per line)"}
//               rows={4}
//             />
//           );
//         }
//         break;

//       case "object":
//         if (fieldDef.subfields) {
//           // Get the ACTUAL page value, not the inherited one
//           const pageKey = `page_${selectedPage}`;
//           const pageSettings = settings[pageKey] || {};
//           const actualPageValue = pageSettings[fieldKey] || {};

//           // For display, we still use currentValue (which includes inheritance)
//           const displayValue = currentValue || {};

//           return (
//             <div className={styles.objectFields}>
//               {Object.keys(fieldDef.subfields).map((subKey) => {
//                 const subField = fieldDef.subfields[subKey];
//                 return (
//                   <div key={subKey} className={styles.subField}>
//                     <label className={styles.subLabel}>{subField.label}</label>
//                     <input
//                       type={subField.type}
//                       className={`${styles.input} ${baseClasses}`}
//                       value={displayValue[subKey] || ""}
//                       onChange={(e) => {
//                         // Start with current page value, fall back to inherited structure
//                         const baseValue =
//                           Object.keys(actualPageValue).length > 0
//                             ? actualPageValue
//                             : currentValue || {};

//                         const newObjectValue = {
//                           ...baseValue,
//                           [subKey]: e.target.value,
//                         };
//                         handleFieldChange(fieldKey, newObjectValue);
//                       }}
//                       placeholder={subField.placeholder}
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//           );
//         }
//         break;

//       case "date":
//         return (
//           <input
//             type="date"
//             className={`${styles.input} ${baseClasses}`}
//             value={currentValue || ""}
//             onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
//           />
//         );

//       case "number":
//         return (
//           <input
//             type="number"
//             className={`${styles.input} ${baseClasses}`}
//             value={currentValue || ""}
//             onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
//             placeholder={fieldDef.placeholder}
//             step="0.01"
//           />
//         );

//       default:
//         return (
//           <input
//             type={fieldDef.type}
//             className={`${styles.input} ${baseClasses}`}
//             value={currentValue || ""}
//             onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
//             placeholder={fieldDef.placeholder}
//             maxLength={fieldDef.maxLength}
//           />
//         );
//     }
//   };

//   if (isLoadingPages) {
//     return <LoadingSpinner message="Loading schema settings..." />;
//   }

//   // Get available fields for current schema type
//   const availableFields =
//     activeSchemaType && schemaTypes[activeSchemaType]
//       ? schemaTypes[activeSchemaType].fields || []
//       : [];

//   return (
//     <div className={styles.socialMedia}>
//       {/* Success Alert */}
//       {showSaveAlert && (
//         <div className={styles.successAlert}>
//           <div className={styles.alertContent}>
//             <span className={styles.alertIcon}>âœ…</span>
//             <span className={styles.alertText}>
//               Schema settings saved successfully!
//             </span>
//             <button
//               className={styles.alertClose}
//               onClick={() => setShowSaveAlert(false)}
//             >
//               Ã—
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Page Selector */}
//       <div className={styles.pageSelector}>
//         <label className={styles.selectorLabel}>
//           Configure schema markup for:
//         </label>
//         <select
//           className={styles.pageSelect}
//           value={selectedPage}
//           onChange={(e) => handlePageChange(e.target.value)}
//         >
//           <option value="global">ðŸŒ Global Defaults (All Pages)</option>
//           {pages
//             .filter((page) => page.id !== "global")
//             .map((page) => (
//               <option key={page.id} value={page.id}>
//                 ðŸ“„ {page.title}
//                 {page.url ? ` (${page.url})` : ""}
//               </option>
//             ))}
//         </select>

//         {selectedPage !== "global" && (
//           <div className={styles.inheritanceInfo}>
//             {selectedPage !== "global" && (
//               <div className={styles.pageEditingInfo}>
//                 <p>
//                   <strong>
//                     Editing: {pages.find((p) => p.id === selectedPage)?.title}
//                   </strong>
//                 </p>
//                 <p className={styles.helpText}>
//                   Fields marked with ðŸŒ are using global defaults. Start typing
//                   in any field to create a custom value for this page only.
//                   Fields marked â­ are custom to this page.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Error Display */}
//       {apiError && (
//         <div className={styles.errorAlert}>
//           <p>{apiError}</p>
//         </div>
//       )}

//       {/* Schema Type Selection */}
//       <div className={styles.pageSelector}>
//         <label className={styles.selectorLabel}>Select Schema Type:</label>
//         <select
//           className={styles.pageSelect}
//           value={activeSchemaType || ""}
//           onChange={(e) => handleFieldChange("schemaType", e.target.value)}
//         >
//           <option value="">-- Select a Schema Type --</option>
//           {Object.keys(schemaTypes).map((typeKey) => (
//             <option key={typeKey} value={typeKey}>
//               {schemaTypes[typeKey].label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Schema Fields */}
//       {activeSchemaType && availableFields.length > 0 && (
//         <div className={styles.sectionsContainer}>
//           <div className={styles.section}>
//             <div className={styles.sectionContent}>
//               <div className={styles.fieldsContainer}>
//                 {/* Check if this schema type allows multiple entries */}
//                 {schemaTypes[activeSchemaType]?.allowMultiple ? (
//                   <MultipleSchemaEntries
//                     schemaType={activeSchemaType}
//                     fieldDefinitions={fieldDefinitions}
//                     fields={availableFields}
//                     value={getFieldValue(
//                       `${activeSchemaType.toLowerCase()}_entries`,
//                     )}
//                     onChange={(entries) =>
//                       handleFieldChange(
//                         `${activeSchemaType.toLowerCase()}_entries`,
//                         entries,
//                       )
//                     }
//                     baseClasses=""
//                   />
//                 ) : (
//                   // Single entry - render fields normally
//                   availableFields.map((fieldKey) => {
//                     const fieldDef = fieldDefinitions[fieldKey];
//                     return renderField(fieldKey, fieldDef);
//                   })
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Schema Preview */}
//       {(activeSchemaType || selectedPage !== "global") && (
//         <div className={styles.pageSelector}>
//           <button
//             type="button"
//             className={styles.saveButton}
//             onClick={() => setShowPreview(!showPreview)}
//             style={{ marginRight: "1rem" }}
//           >
//             {showPreview ? "Hide Preview" : "Show JSON-LD Preview"}
//           </button>

//           {selectedPage !== "global" && (
//             <div
//               className={styles.inheritanceInfo}
//               style={{ marginTop: "0.5rem" }}
//             >
//               <small>
//                 This preview shows ALL schemas that will be applied to this
//                 page (both Global and Page-specific schemas, if any).
//               </small>
//             </div>
//           )}
//         </div>
//       )}

//       {showPreview && (
//         <div className={styles.pageSelector} style={{ background: "#f8f9fa" }}>
//           <label className={styles.selectorLabel}>
//             Generated JSON-LD Schema
//             {Array.isArray(generateSchemaJSON()) ? "s" : ""}:
//           </label>
//           {selectedPage !== "global" && (
//             <div
//               style={{
//                 padding: "0.75rem",
//                 background: "#e3f2fd",
//                 borderRadius: "4px",
//                 marginBottom: "1rem",
//                 fontSize: "0.9rem",
//               }}
//             >
//               <strong>What you're seeing:</strong>
//               <ul style={{ margin: "0.5rem 0 0 1.5rem", paddingLeft: 0 }}>
//                 <li>
//                   ✅ <strong>Global schemas</strong> that apply to all pages
//                 </li>
//                 <li>
//                   ✅ <strong>Page-specific schemas</strong> (if configured for
//                   this page)
//                 </li>
//                 <li>
//                   All of these will be output together when this page is
//                   rendered
//                 </li>
//               </ul>
//             </div>
//           )}
//           <pre
//             style={{
//               background: "#282c34",
//               color: "#abb2bf",
//               padding: "1rem",
//               borderRadius: "4px",
//               overflow: "auto",
//               fontSize: "0.85rem",
//               lineHeight: "1.4",
//               maxHeight: "600px",
//             }}
//           >
//             {JSON.stringify(generateSchemaJSON(), null, 2)}
//           </pre>
//         </div>
//       )}

//       {/* Save Button */}
//       <div className={styles.saveSection}>
//         <button
//           className={`${styles.saveButton} ${
//             hasChanges ? styles.hasChanges : ""
//           }`}
//           onClick={handleSave}
//           disabled={isSaving || !hasChanges}
//         >
//           {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SchemaMarkup;

// assets/js/components/tabs/SchemaMarkup.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import LoadingSpinner from "../common/LoadingSpinner";
import ServiceCatalogInput from "../common/ServiceCatalogInput";
import ProductCatalogInput from "../common/ProductCatalogInput";
import { fieldDefinitions, schemaTypes } from "./schemaTypes";
import styles from "@css/components/tabs/SocialMedia.module.scss"; // Reusing the collapsible styles
import MultipleSchemaEntries from "../common/MultipleSchemaEntries";

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
  const [showPreview, setShowPreview] = useState(false);

  // CRITICAL DEBUG - Log every render
  console.log("🔍 SCHEMA COMPONENT RENDER");
  console.log("  activeSchemaType:", activeSchemaType);
  console.log("  selectedPage:", selectedPage);
  console.log("  settings:", settings);

  // Initialize on mount
  useEffect(() => {
    loadPagesFromWordPress();
    loadPageSettings(selectedPage);
  }, []);

  // Reload when page changes
  useEffect(() => {
    if (selectedPage) {
      loadPageSettings(selectedPage);
    }
  }, [selectedPage]);

  // Debug: Log activeSchemaType changes
  useEffect(() => {
    console.log("🔄 activeSchemaType changed to:", activeSchemaType);
  }, [activeSchemaType]);

  const loadPagesFromWordPress = async () => {
    try {
      setIsLoadingPages(true);
      setApiError(null);
      const fetchedPages = await loadPages();
      if (fetchedPages && fetchedPages.length > 0) {
        setPages(fetchedPages);
      } else {
        setApiError(
          "No pages found. The WordPress API might not be working properly.",
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

    // Get the schema key for current type
    const schemaKey = `schema_${activeSchemaType}`;

    console.log(
      `getFieldValue(${fieldKey}): activeSchemaType=${activeSchemaType}, schemaKey=${schemaKey}`,
    );

    if (selectedPage === "global") {
      const schemaData = globalSettings[schemaKey] || {};
      return schemaData[fieldKey] || "";
    } else {
      // For specific pages, check page data first, then global
      const pageSchemaData = pageSettings[schemaKey] || {};
      const globalSchemaData = globalSettings[schemaKey] || {};

      const pageValue = pageSchemaData[fieldKey];
      const globalValue = globalSchemaData[fieldKey];

      // Return page value if it exists, otherwise global value
      if (pageValue !== undefined && pageValue !== "") {
        return pageValue;
      } else {
        return globalValue || "";
      }
    }
  };

  const getFieldStatus = (fieldKey) => {
    if (selectedPage === "global") return "global";

    const pageKey = `page_${selectedPage}`;
    const pageSettings = settings[pageKey] || {};
    const globalSettings = settings["page_global"] || {};

    const schemaKey = `schema_${activeSchemaType}`;
    const pageSchemaData = pageSettings[schemaKey] || {};
    const globalSchemaData = globalSettings[schemaKey] || {};

    const pageValue = pageSchemaData[fieldKey];
    const globalValue = globalSchemaData[fieldKey];

    if (pageValue !== undefined && pageValue !== "") {
      if (JSON.stringify(pageValue) === JSON.stringify(globalValue)) {
        return "inherited";
      } else {
        return "unique";
      }
    } else {
      return "using_global";
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    console.log("=== handleFieldChange called ===");
    console.log("fieldKey:", fieldKey);
    console.log("value:", value);
    console.log("activeSchemaType:", activeSchemaType);

    const pageKey = `page_${selectedPage}`;
    const currentPageSettings = settings[pageKey] || {};

    // Special handling for schema type selection (UI only, not stored)
    if (fieldKey === "schemaType") {
      console.log("✅ Changing active schema type to:", value);
      setActiveSchemaType(value);
      setHasChanges(false); // Switching schema type doesn't create changes
      return;
    }

    // For all other fields: save to schema_[TypeName] key
    if (!activeSchemaType) {
      console.error("❌ No schema type selected! Select a schema type first.");
      return;
    }

    const schemaKey = `schema_${activeSchemaType}`;
    const currentSchemaData = currentPageSettings[schemaKey] || {};

    console.log(`✅ Saving to key: ${schemaKey}`);
    console.log("Current schema data:", currentSchemaData);

    // Update just this one schema's data
    const updatedSchemaData = {
      ...currentSchemaData,
      [fieldKey]: value,
    };

    // Update the page settings with the new schema data
    const updatedPageSettings = {
      ...currentPageSettings,
      [schemaKey]: updatedSchemaData,
    };

    console.log("Updated schema data:", updatedSchemaData);
    console.log("Updated page settings:", updatedPageSettings);

    updateSetting(pageKey, updatedPageSettings);
    setHasChanges(true);
  };

  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
    setHasChanges(false);
  };

  const handleSave = async () => {
    const pageSettings = settings[`page_${selectedPage}`] || {};

    console.log("=== Saving Schema Settings ===");
    console.log("selectedPage:", selectedPage);
    console.log("pageSettings:", pageSettings);

    try {
      const result = await savePageSettings(selectedPage, pageSettings);

      console.log("Save result:", result);

      if (result.success) {
        setHasChanges(false);
        setShowSaveAlert(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setShowSaveAlert(false), 3000);

        // Reload the page settings to show the saved data
        await loadPageSettings(selectedPage);
      } else {
        setApiError(
          `Failed to save settings: ${result.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Save failed:", error);
      setApiError(`Save failed: ${error.message}`);
    }
  };

  const TooltipHelper = ({ tooltipText }) => (
    <span className={styles.mediaHelper}>
      <span className={styles.tooltipTrigger} data-tooltip={tooltipText}>
        â„¹ï¸
      </span>
    </span>
  );

  const generateSchemaJSON = () => {
    const pageSettings = settings[`page_${selectedPage}`] || {};
    const globalSettings = settings["page_global"] || {};

    console.log("=== generateSchemaJSON (SIMPLE APPROACH) ===");
    console.log("pageSettings:", pageSettings);
    console.log("globalSettings:", globalSettings);

    const schemas = [];

    // Helper function to build JSON-LD from schema data
    const buildSchema = (schemaType, schemaData) => {
      if (!schemaData || Object.keys(schemaData).length === 0) {
        return null;
      }

      console.log(`Building schema for ${schemaType}:`, schemaData);

      const schema = {
        "@context": "https://schema.org",
        "@type": schemaType,
      };

      // For Product, handle the products array specially
      if (schemaType === "Product" && schemaData.products) {
        const products = schemaData.products;
        if (!Array.isArray(products) || products.length === 0) {
          return null;
        }

        if (products.length === 1) {
          const product = products[0];
          return {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name || "Unnamed Product",
            description: product.description || undefined,
            image: product.image || undefined,
            brand: product.brand
              ? { "@type": "Brand", name: product.brand }
              : undefined,
            sku: product.sku || undefined,
            offers: {
              "@type": "Offer",
              price: product.price || undefined,
              priceCurrency: product.currency || "USD",
              availability: `https://schema.org/${product.availability || "InStock"}`,
            },
          };
        }

        return {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Product Catalog",
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: product.name || `Product ${index + 1}`,
              description: product.description || undefined,
              image: product.image || undefined,
              brand: product.brand
                ? { "@type": "Brand", name: product.brand }
                : undefined,
              sku: product.sku || undefined,
              offers: {
                "@type": "Offer",
                price: product.price || undefined,
                priceCurrency: product.currency || "USD",
                availability: `https://schema.org/${product.availability || "InStock"}`,
              },
            },
          })),
        };
      }

      // For other schema types, just copy the data
      const typeConfig = schemaTypes[schemaType];
      if (!typeConfig) return null;

      const fieldsToInclude = typeConfig.fields || [];
      let hasData = false;

      fieldsToInclude.forEach((fieldKey) => {
        const fieldDef = fieldDefinitions[fieldKey];
        if (!fieldDef) return;

        const value = schemaData[fieldKey];
        if (!value) return;

        hasData = true;

        // Handle object fields (like author, publisher, address)
        if (fieldDef.type === "object" && typeof value === "object") {
          const objValue = {};
          Object.keys(fieldDef.subfields || {}).forEach((subKey) => {
            if (value[subKey]) {
              objValue[subKey] = value[subKey];
            }
          });
          if (Object.keys(objValue).length > 0) {
            if (fieldKey === "author" || fieldKey === "publisher") {
              schema[fieldKey] = {
                "@type": fieldKey === "author" ? "Person" : "Organization",
                ...objValue,
              };
            } else {
              schema[fieldKey] = objValue;
            }
          }
        }
        // Handle service arrays
        else if (
          fieldDef.type === "serviceArray" &&
          Array.isArray(value) &&
          value.length > 0
        ) {
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
              },
            })),
          };
        }
        // Handle arrays
        else if (
          fieldDef.type === "array" &&
          Array.isArray(value) &&
          value.length > 0
        ) {
          schema[fieldKey] = value;
        }
        // Simple fields
        else {
          schema[fieldKey] = value;
        }
      });

      return hasData ? schema : null;
    };

    // Get all schema_ keys from global settings
    console.log("=== Checking Global Settings ===");
    Object.keys(globalSettings).forEach((key) => {
      if (key.startsWith("schema_")) {
        const schemaType = key.replace("schema_", "");
        const schemaData = globalSettings[key];
        console.log(`Found global schema: ${schemaType}`, schemaData);

        const schema = buildSchema(schemaType, schemaData);
        if (schema) {
          schemas.push({ source: "Global", type: schemaType, schema });
        }
      }
    });

    // Get all schema_ keys from page settings (if not global)
    if (selectedPage !== "global") {
      console.log("=== Checking Page Settings ===");
      Object.keys(pageSettings).forEach((key) => {
        if (key.startsWith("schema_")) {
          const schemaType = key.replace("schema_", "");
          const schemaData = pageSettings[key];
          console.log(`Found page schema: ${schemaType}`, schemaData);

          const schema = buildSchema(schemaType, schemaData);
          if (schema) {
            schemas.push({
              source: `Page: ${pages.find((p) => p.id === selectedPage)?.title || selectedPage}`,
              type: schemaType,
              schema,
            });
          }
        }
      });
    }

    console.log("=== Final Schemas ===", schemas);
    console.log("Total schemas:", schemas.length);

    // Return appropriate format
    if (schemas.length === 0) {
      return {
        "@context": "https://schema.org",
        "@type": "Thing",
        name: "No schemas configured yet. Select a schema type and fill in the fields to get started.",
      };
    }

    if (schemas.length === 1) {
      return schemas[0].schema;
    }

    return schemas.map((s) => s.schema);
  };

  const renderField = (fieldKey, fieldDef) => {
    if (!fieldDef) return null;

    // Check field dependencies
    if (fieldDef.dependsOn) {
      const dependencyValue = getFieldValue(fieldDef.dependsOn.field);
      if (!fieldDef.dependsOn.values.includes(dependencyValue)) {
        return null;
      }
    }

    const currentValue = getFieldValue(fieldKey);
    const fieldStatus = getFieldStatus(fieldKey);
    const isInherited = fieldStatus === "inherited";
    const isUsingGlobal = fieldStatus === "using_global";
    const isUnique = fieldStatus === "unique";

    const currentPage = pages.find((p) => p.id === selectedPage);
    const pageSlug = currentPage?.title || selectedPage;

    return (
      <div key={fieldKey} className={styles.field}>
        <label className={styles.label}>
          {fieldDef.label}
          {fieldDef.hasTooltip && (
            <TooltipHelper tooltipText={fieldDef.tooltipText} />
          )}

          {/* Only show badges when NOT on global page */}
          {selectedPage !== "global" && (
            <>
              {isInherited && (
                <span
                  className={styles.inheritedBadge}
                  title="This value matches the global setting"
                >
                  ðŸ“‹ Inherited
                </span>
              )}
              {isUsingGlobal && (
                <span
                  className={styles.usingGlobalBadge}
                  title="Using global default - start typing to customize for this page"
                >
                  ðŸŒ Global
                </span>
              )}
              {isUnique && (
                <span
                  className={styles.uniqueBadge}
                  title="This value is unique to this page"
                >
                  â­ Custom
                </span>
              )}
            </>
          )}
        </label>

        {renderFieldInput(
          fieldKey,
          fieldDef,
          currentValue,
          isUsingGlobal,
          isInherited,
        )}
      </div>
    );
  };

  const renderFieldInput = (
    fieldKey,
    fieldDef,
    currentValue,
    isUsingGlobal,
    isInherited,
  ) => {
    const baseClasses = `${isUsingGlobal ? styles.usingGlobal : ""} ${
      isInherited ? styles.inherited : ""
    }`;

    switch (fieldDef.type) {
      case "multipleProducts":
        // Render multiple individual product forms
        const products = Array.isArray(currentValue) ? currentValue : [{}]; // Start with at least one product

        return (
          <div className={styles.multipleProductsContainer}>
            {products.map((product, index) => (
              <div key={index} className={styles.productForm}>
                <div className={styles.productHeader}>
                  <h4>Product {index + 1}</h4>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newProducts = products.filter(
                          (_, i) => i !== index,
                        );
                        handleFieldChange(fieldKey, newProducts);
                      }}
                      className={styles.removeProductButton}
                    >
                      Remove Product
                    </button>
                  )}
                </div>

                <div className={styles.productFields}>
                  {/* Product Name */}
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Product Name
                      <TooltipHelper tooltipText="Name of the specific product" />
                    </label>
                    <input
                      type="text"
                      className={`${styles.input} ${baseClasses}`}
                      value={product.name || ""}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[index] = {
                          ...product,
                          name: e.target.value,
                        };
                        handleFieldChange(fieldKey, newProducts);
                      }}
                      placeholder="product name"
                    />
                  </div>

                  {/* Product Description */}
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Description
                      <TooltipHelper tooltipText="Detailed description of the product" />
                    </label>
                    <textarea
                      className={`${styles.textarea} ${baseClasses}`}
                      value={product.description || ""}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[index] = {
                          ...product,
                          description: e.target.value,
                        };
                        handleFieldChange(fieldKey, newProducts);
                      }}
                      placeholder="A detailed description of the product"
                      rows={3}
                    />
                  </div>

                  {/* Product Image */}
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Image URL
                      <TooltipHelper tooltipText="High-quality product image (1200x630px recommended)" />
                    </label>
                    <input
                      type="url"
                      className={`${styles.input} ${baseClasses}`}
                      value={product.image || ""}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[index] = {
                          ...product,
                          image: e.target.value,
                        };
                        handleFieldChange(fieldKey, newProducts);
                      }}
                      placeholder="https://example.com/product-image.jpg"
                    />
                  </div>

                  {/* Brand */}
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Brand
                      <TooltipHelper tooltipText="Brand or manufacturer of the product" />
                    </label>
                    <input
                      type="text"
                      className={`${styles.input} ${baseClasses}`}
                      value={product.brand || ""}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[index] = {
                          ...product,
                          brand: e.target.value,
                        };
                        handleFieldChange(fieldKey, newProducts);
                      }}
                      placeholder="Apple, Nike, Sony"
                    />
                  </div>

                  {/* SKU */}
                  <div className={styles.field}>
                    <label className={styles.label}>
                      SKU
                      <TooltipHelper tooltipText="Stock Keeping Unit - your internal product identifier" />
                    </label>
                    <input
                      type="text"
                      className={`${styles.input} ${baseClasses}`}
                      value={product.sku || ""}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[index] = {
                          ...product,
                          sku: e.target.value,
                        };
                        handleFieldChange(fieldKey, newProducts);
                      }}
                      placeholder="ABC123XYZ"
                    />
                  </div>

                  {/* Price and Currency Row */}
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        Price
                        <TooltipHelper tooltipText="Current price of the product" />
                      </label>
                      <input
                        type="number"
                        className={`${styles.input} ${baseClasses}`}
                        value={product.price || ""}
                        onChange={(e) => {
                          const newProducts = [...products];
                          newProducts[index] = {
                            ...product,
                            price: e.target.value,
                          };
                          handleFieldChange(fieldKey, newProducts);
                        }}
                        placeholder="29.99"
                        step="0.01"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        Currency
                        <TooltipHelper tooltipText="Currency for the product price" />
                      </label>
                      <select
                        className={`${styles.select} ${baseClasses}`}
                        value={product.currency || "USD"}
                        onChange={(e) => {
                          const newProducts = [...products];
                          newProducts[index] = {
                            ...product,
                            currency: e.target.value,
                          };
                          handleFieldChange(fieldKey, newProducts);
                        }}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (â‚¬)</option>
                        <option value="GBP">GBP (Â£)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                        <option value="JPY">JPY (Â¥)</option>
                      </select>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Availability
                      <TooltipHelper tooltipText="Current availability status of the product" />
                    </label>
                    <select
                      className={`${styles.select} ${baseClasses}`}
                      value={product.availability || "InStock"}
                      onChange={(e) => {
                        const newProducts = [...products];
                        newProducts[index] = {
                          ...product,
                          availability: e.target.value,
                        };
                        handleFieldChange(fieldKey, newProducts);
                      }}
                    >
                      <option value="InStock">In Stock</option>
                      <option value="OutOfStock">Out of Stock</option>
                      <option value="PreOrder">Pre-Order</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Products Button */}
            <button
              type="button"
              onClick={() => {
                const newProducts = [...products, {}];
                handleFieldChange(fieldKey, newProducts);
              }}
              className={styles.addProductButton}
            >
              + Add More Products
            </button>
          </div>
        );

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
        if (fieldDef.arrayType === "url") {
          const arrayValue = Array.isArray(currentValue)
            ? currentValue.join("\n")
            : currentValue || "";
          return (
            <textarea
              className={`${styles.textarea} ${baseClasses}`}
              value={arrayValue}
              onChange={(e) => {
                const urls = e.target.value
                  .split("\n")
                  .filter((url) => url.trim());
                handleFieldChange(fieldKey, urls);
              }}
              placeholder={fieldDef.placeholder + "\n(one URL per line)"}
              rows={4}
            />
          );
        }
        break;

      case "object":
        if (fieldDef.subfields) {
          // Get the ACTUAL page value, not the inherited one
          const pageKey = `page_${selectedPage}`;
          const pageSettings = settings[pageKey] || {};
          const actualPageValue = pageSettings[fieldKey] || {};

          // For display, we still use currentValue (which includes inheritance)
          const displayValue = currentValue || {};

          return (
            <div className={styles.objectFields}>
              {Object.keys(fieldDef.subfields).map((subKey) => {
                const subField = fieldDef.subfields[subKey];
                return (
                  <div key={subKey} className={styles.subField}>
                    <label className={styles.subLabel}>{subField.label}</label>
                    <input
                      type={subField.type}
                      className={`${styles.input} ${baseClasses}`}
                      value={displayValue[subKey] || ""}
                      onChange={(e) => {
                        // Start with current page value, fall back to inherited structure
                        const baseValue =
                          Object.keys(actualPageValue).length > 0
                            ? actualPageValue
                            : currentValue || {};

                        const newObjectValue = {
                          ...baseValue,
                          [subKey]: e.target.value,
                        };
                        handleFieldChange(fieldKey, newObjectValue);
                      }}
                      placeholder={subField.placeholder}
                    />
                  </div>
                );
              })}
            </div>
          );
        }
        break;

      case "date":
        return (
          <input
            type="date"
            className={`${styles.input} ${baseClasses}`}
            value={currentValue || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );

      case "number":
        return (
          <input
            type="number"
            className={`${styles.input} ${baseClasses}`}
            value={currentValue || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            placeholder={fieldDef.placeholder}
            step="0.01"
          />
        );

      default:
        return (
          <input
            type={fieldDef.type}
            className={`${styles.input} ${baseClasses}`}
            value={currentValue || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            placeholder={fieldDef.placeholder}
            maxLength={fieldDef.maxLength}
          />
        );
    }
  };

  if (isLoadingPages) {
    return <LoadingSpinner message="Loading schema settings..." />;
  }

  // Get available fields for current schema type
  const availableFields =
    activeSchemaType && schemaTypes[activeSchemaType]
      ? schemaTypes[activeSchemaType].fields || []
      : [];

  return (
    <div className={styles.socialMedia}>
      {/* Success Alert */}
      {showSaveAlert && (
        <div className={styles.successAlert}>
          <div className={styles.alertContent}>
            <span className={styles.alertIcon}>âœ…</span>
            <span className={styles.alertText}>
              Schema settings saved successfully!
            </span>
            <button
              className={styles.alertClose}
              onClick={() => setShowSaveAlert(false)}
            >
              Ã—
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
          <option value="global">ðŸŒ Global Defaults (All Pages)</option>
          {pages
            .filter((page) => page.id !== "global")
            .map((page) => (
              <option key={page.id} value={page.id}>
                ðŸ“„ {page.title}
                {page.url ? ` (${page.url})` : ""}
              </option>
            ))}
        </select>

        {selectedPage !== "global" && (
          <div className={styles.inheritanceInfo}>
            {selectedPage !== "global" && (
              <div className={styles.pageEditingInfo}>
                <p>
                  <strong>
                    Editing: {pages.find((p) => p.id === selectedPage)?.title}
                  </strong>
                </p>
                <p className={styles.helpText}>
                  Fields marked with ðŸŒ are using global defaults. Start typing
                  in any field to create a custom value for this page only.
                  Fields marked â­ are custom to this page.
                </p>
              </div>
            )}
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
        <label className={styles.selectorLabel}>Select Schema Type:</label>
        <select
          className={styles.pageSelect}
          value={activeSchemaType || ""}
          onChange={(e) => handleFieldChange("schemaType", e.target.value)}
        >
          <option value="">-- Select a Schema Type --</option>
          {Object.keys(schemaTypes).map((typeKey) => (
            <option key={typeKey} value={typeKey}>
              {schemaTypes[typeKey].label}
            </option>
          ))}
        </select>
      </div>

      {/* Schema Fields */}
      {activeSchemaType && availableFields.length > 0 && (
        <div className={styles.sectionsContainer}>
          <div className={styles.section}>
            <div className={styles.sectionContent}>
              <div className={styles.fieldsContainer}>
                {/* Check if this schema type allows multiple entries */}
                {schemaTypes[activeSchemaType]?.allowMultiple ? (
                  <MultipleSchemaEntries
                    schemaType={activeSchemaType}
                    fieldDefinitions={fieldDefinitions}
                    fields={availableFields}
                    value={getFieldValue(
                      `${activeSchemaType.toLowerCase()}_entries`,
                    )}
                    onChange={(entries) =>
                      handleFieldChange(
                        `${activeSchemaType.toLowerCase()}_entries`,
                        entries,
                      )
                    }
                    baseClasses=""
                  />
                ) : (
                  // Single entry - render fields normally
                  availableFields.map((fieldKey) => {
                    const fieldDef = fieldDefinitions[fieldKey];
                    return renderField(fieldKey, fieldDef);
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schema Preview */}
      {(activeSchemaType || selectedPage !== "global") && (
        <div className={styles.pageSelector}>
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => setShowPreview(!showPreview)}
            style={{ marginRight: "1rem" }}
          >
            {showPreview ? "Hide Preview" : "Show JSON-LD Preview"}
          </button>

          {selectedPage !== "global" && (
            <div
              className={styles.inheritanceInfo}
              style={{ marginTop: "0.5rem" }}
            >
              <small>
                This preview shows ALL schemas that will be applied to this page
                (both Global and Page-specific schemas, if any).
              </small>
            </div>
          )}
        </div>
      )}

      {showPreview && (
        <div className={styles.pageSelector} style={{ background: "#f8f9fa" }}>
          <label className={styles.selectorLabel}>
            Generated JSON-LD Schema
            {Array.isArray(generateSchemaJSON()) ? "s" : ""}:
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
                  ✅ <strong>Page-specific schemas</strong> (if configured for
                  this page)
                </li>
                <li>
                  All of these will be output together when this page is
                  rendered
                </li>
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
            {JSON.stringify(generateSchemaJSON(), null, 2)}
          </pre>
        </div>
      )}

      {/* Save Button */}
      <div className={styles.saveSection}>
        <button
          className={`${styles.saveButton} ${
            hasChanges ? styles.hasChanges : ""
          }`}
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
        </button>
      </div>
    </div>
  );
};

export default SchemaMarkup;
