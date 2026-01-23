/* ================================================================== */
/* LocalBusiness Schema Editor */
/* ================================================================== */
import { useState, useEffect } from "react";
import Tooltip from "./Tooltip";
import styles from "@css/components/tabs/SchemaTab.module.scss";

const businessTypes = [
  "LocalBusiness",
  "Restaurant",
  "CafeOrCoffeeShop",
  "Bakery",
  "BarOrPub",
  "NightClub",
  "Store",
  "RetailStore",
  "HealthAndBeautyBusiness",
  "MedicalBusiness",
  "AutomotiveBusiness",
  "ProfessionalService",
  "NonprofitOrganization",
  "EducationalOrganization",
  "GovernmentOrganization",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CURRENCIES = ["AUD", "USD", "EUR", "GBP", "JPY"];

export default function LocalBusinessSchema({ value, onChange }) {
  const [data, setData] = useState({
    address: {},
    geo: {},
    businessType: "LocalBusiness",
    openingHoursSpecification: DAYS.map((day) => ({
      dayOfWeek: day,
      opens: "09:00",
      closes: "17:00",
    })),
    offerCatalog: [{ name: "", price: "", currency: "AUD" }],
    ...value,
    address: value?.address || {},
    geo: value?.geo || {},
    businessType: value?.businessType || "LocalBusiness",
    openingHoursSpecification:
      value?.openingHoursSpecification?.length > 0
        ? value.openingHoursSpecification
        : DAYS.map((day) => ({
            dayOfWeek: day,
            opens: "09:00",
            closes: "17:00",
          })),
    offerCatalog:
      value?.offerCatalog?.length > 0
        ? value.offerCatalog
        : [{ name: "", price: "", currency: "AUD" }],
  });

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const update = (field, val) => setData((prev) => ({ ...prev, [field]: val }));
  const updateAddress = (field, val) =>
    setData((prev) => ({
      ...prev,
      address: { ...(prev.address || {}), [field]: val },
    }));
  const updateGeo = (field, val) =>
    setData((prev) => ({
      ...prev,
      geo: { ...(prev.geo || {}), [field]: val },
    }));

  /* Conditional Fields by Business Type */
  const showMenuFields = [
    "Restaurant",
    "CafeOrCoffeeShop",
    "Bakery",
    "BarOrPub",
    "NightClub",
  ].includes(data.businessType);
  const showCuisineFields = [
    "Restaurant",
    "CafeOrCoffeeShop",
    "Bakery",
  ].includes(data.businessType);

  return (
    <div className={styles.schemaForm}>
      {/* Core Identity */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Business Name</label>
        <input
          className={styles.input}
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          autoComplete="organization"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Business Type</label>
        <select
          className={styles.select}
          value={data.businessType}
          onChange={(e) => update("businessType", e.target.value)}
        >
          {businessTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div className={styles.fieldGroup}>
        <h4>Address</h4>
        {[
          {
            field: "streetAddress",
            label: "Street Address",
            autoComplete: "street-address",
          },
          {
            field: "addressLocality",
            label: "City",
            autoComplete: "address-level2",
          },
          {
            field: "addressRegion",
            label: "State / Region",
            autoComplete: "address-level1",
          },
          {
            field: "postalCode",
            label: "Postal Code",
            autoComplete: "postal-code",
          },
          {
            field: "addressCountry",
            label: "Country",
            placeholder: "Australia",
            autoComplete: "country",
          },
        ].map(({ field, label, placeholder, autoComplete }) => (
          <div className={styles.formGroup} key={field}>
            <label className={styles.label}>{label}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={placeholder || ""}
              value={data.address[field] || ""}
              onChange={(e) => updateAddress(field, e.target.value)}
              autoComplete={autoComplete}
            />
          </div>
        ))}
      </div>

      {/* Geo */}
      <div className={styles.fieldGroup}>
        <h4>Geo Coordinates</h4>
        <div className={styles.formRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Latitude (e.g., -37.8136)"
            value={data.geo.latitude || ""}
            onChange={(e) => updateGeo("latitude", e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Longitude (e.g., 144.9631)"
            value={data.geo.longitude || ""}
            onChange={(e) => updateGeo("longitude", e.target.value)}
          />
        </div>
      </div>

      {/* Contact */}
      <div className={styles.fieldGroup}>
        <h4>Contact & Website</h4>
        <input
          type="tel"
          className={styles.input}
          placeholder="Telephone"
          value={data.telephone || ""}
          onChange={(e) => update("telephone", e.target.value)}
          autoComplete="tel"
        />
        <input
          type="url"
          className={styles.input}
          placeholder="Website URL"
          value={data.url || ""}
          onChange={(e) => update("url", e.target.value)}
          autoComplete="organization-url"
        />
        <input
          type="text"
          className={styles.input}
          placeholder="@id (Unique Identifier)"
          value={data["@id"] || ""}
          onChange={(e) => update("@id", e.target.value)}
        />
      </div>

      {/* Images */}
      <div className={styles.fieldGroup}>
        <h4>Images</h4>
        <input
          type="text"
          className={styles.input}
          placeholder="Image URL"
          value={data.image || ""}
          onChange={(e) => update("image", e.target.value)}
        />
      </div>

      {/* Opening Hours */}
      <OpeningHoursEditor
        value={data.openingHoursSpecification}
        onChange={(val) => update("openingHoursSpecification", val)}
      />

      {/* Offer Catalog */}
      <OfferCatalogEditor
        value={data.offerCatalog}
        onChange={(val) => update("offerCatalog", val)}
      />

      {/* Details Section (conditional) */}
      <div className={styles.fieldGroup}>
        <h4>Details</h4>
        {showCuisineFields && (
          <input
            type="text"
            className={styles.input}
            placeholder="Serves Cuisine"
            value={data.servesCuisine || ""}
            onChange={(e) => update("servesCuisine", e.target.value)}
          />
        )}
        {showMenuFields && (
          <input
            type="url"
            className={styles.input}
            placeholder="Menu URL"
            value={data.menuUrl || ""}
            onChange={(e) => update("menuUrl", e.target.value)}
          />
        )}
        <input
          type="text"
          className={styles.input}
          placeholder="Price Range (e.g., $$$)"
          value={data.priceRange || ""}
          onChange={(e) => update("priceRange", e.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Payment Accepted (e.g., Cash, Credit Card)"
          value={data.paymentAccepted || ""}
          onChange={(e) => update("paymentAccepted", e.target.value)}
        />
        <select
          className={styles.select}
          value={data.currenciesAccepted || "AUD"}
          onChange={(e) => update("currenciesAccepted", e.target.value)}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Opening Hours Editor */
/* ================================================================== */
function OpeningHoursEditor({ value = [], onChange }) {
  const updateDay = (i, field, val) => {
    const next = [...value];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const addDay = (day = "Monday") => {
    onChange([...value, { dayOfWeek: day, opens: "09:00", closes: "17:00" }]);
  };
  return (
    <div className={styles.fieldGroup}>
      <h4>Opening Hours</h4>
      {value.map((row, i) => (
        <div key={i} className={styles.formRow}>
          <select
            className={styles.select}
            value={row.dayOfWeek}
            onChange={(e) => updateDay(i, "dayOfWeek", e.target.value)}
          >
            {DAYS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input
            type="time"
            className={styles.input}
            value={row.opens}
            onChange={(e) => updateDay(i, "opens", e.target.value)}
          />
          <input
            type="time"
            className={styles.input}
            value={row.closes}
            onChange={(e) => updateDay(i, "closes", e.target.value)}
          />
        </div>
      ))}
      <button
        type="button"
        className={styles.addButton}
        onClick={() => addDay()}
      >
        + Add Opening Day
      </button>
    </div>
  );
}

/* ================================================================== */
/* Offer Catalog Editor */
/* ================================================================== */
function OfferCatalogEditor({ value = [], onChange }) {
  const addOffer = () =>
    onChange([...value, { name: "", price: "", currency: "AUD" }]);
  const updateOffer = (i, field, val) => {
    const next = [...value];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  return (
    <div className={styles.fieldGroup}>
      <h4>Offer Catalog</h4>
      {value.map((o, i) => (
        <div key={i} className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="Offer Name"
            value={o.name}
            onChange={(e) => updateOffer(i, "name", e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Price"
            value={o.price}
            onChange={(e) => updateOffer(i, "price", e.target.value)}
          />
          <select
            className={styles.select}
            value={o.currency}
            onChange={(e) => updateOffer(i, "currency", e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      ))}
      <button type="button" className={styles.addButton} onClick={addOffer}>
        + Add Offer
      </button>
    </div>
  );
}

/* ================================================================== */
/* JSON-LD Builder (Crash-Safe & Conditional) */
/* ================================================================== */
export function buildLocalBusinessJson(data) {
  if (!data?.name || !data?.businessType) return null;

  // Default opening hours if none exist
  const openingHours =
    data.openingHoursSpecification?.length > 0
      ? data.openingHoursSpecification
      : [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: day,
          opens: "09:00",
          closes: "17:00",
        }));

  // Default offer catalog
  const offers =
    data.offerCatalog?.length > 0
      ? data.offerCatalog
      : [{ name: "Default Offer", price: "", currency: "AUD" }];

  // Conditional fields based on business type
  const isFood = [
    "Restaurant",
    "CafeOrCoffeeShop",
    "Bakery",
    "BarOrPub",
    "NightClub",
  ].includes(data.businessType);
  const isCuisine = ["Restaurant", "CafeOrCoffeeShop", "Bakery"].includes(
    data.businessType,
  );

  return {
    "@context": "https://schema.org",
    "@type": data.businessType,
    "@id": data["@id"] || undefined,
    name: data.name,
    address: data.address?.streetAddress
      ? { "@type": "PostalAddress", ...data.address }
      : undefined,
    geo:
      data.geo?.latitude && data.geo?.longitude
        ? { "@type": "GeoCoordinates", ...data.geo }
        : undefined,
    telephone: data.telephone || undefined,
    url: data.url || undefined,
    image: data.image ? [data.image] : undefined,
    openingHoursSpecification: openingHours.map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: d.dayOfWeek,
      opens: d.opens,
      closes: d.closes,
    })),
    hasOfferCatalog: offers.length
      ? {
          "@type": "OfferCatalog",
          itemListElement: offers.map((o) => ({
            "@type": "Offer",
            name: o.name,
            price: o.price || undefined,
            priceCurrency: o.currency || "AUD",
            availability: "https://schema.org/InStock",
          })),
        }
      : undefined,
    servesCuisine: isCuisine ? data.servesCuisine || undefined : undefined,
    menu: isFood ? data.menuUrl || undefined : undefined,
    acceptsReservations:
      isFood && data.acceptsReservations !== undefined
        ? data.acceptsReservations
        : undefined,
    paymentAccepted: data.paymentAccepted || undefined,
    priceRange: data.priceRange || undefined,
    currenciesAccepted: data.currenciesAccepted || "AUD",
    medicalSpecialty:
      data.businessType === "MedicalBusiness"
        ? data.medicalSpecialty || undefined
        : undefined,
    donationUrl:
      data.businessType === "NonprofitOrganization"
        ? data.donationUrl || undefined
        : undefined,
    volunteerUrl:
      data.businessType === "NonprofitOrganization"
        ? data.volunteerUrl || undefined
        : undefined,
    mission:
      data.businessType === "NonprofitOrganization"
        ? data.mission || undefined
        : undefined,
    taxID:
      data.businessType === "NonprofitOrganization"
        ? data.taxID || undefined
        : undefined,
    nonprofitStatus:
      data.businessType === "NonprofitOrganization"
        ? data.nonprofitStatus || undefined
        : undefined,
  };
}
