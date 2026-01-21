// /components/schemaTypes/LocalBusinessSchema.jsx

import { useState, useEffect } from "react";

/**
 * LocalBusiness Schema Editor
 * Fully dynamic with subtype dropdown and conditional fields
 */
export default function LocalBusinessSchema({ value = {}, onChange }) {
  const [data, setData] = useState(value);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  const businessTypes = [
    "LocalBusiness",
    "Restaurant",
    "FoodEstablishment",
    "CafeOrCoffeeShop",
    "Bakery",
    "BarOrPub",
    "NightClub",
    "Store",
    "RetailStore",
    "ClothingStore",
    "GroceryStore",
    "HardwareStore",
    "BookStore",
    "ElectronicsStore",
    "JewelryStore",
    "FurnitureStore",
    "HomeGoodsStore",
    "SportingGoodsStore",
    "HealthAndBeautyBusiness",
    "HairSalon",
    "Spa",
    "Gym",
    "MedicalBusiness",
    "Dentist",
    "Physician",
    "VeterinaryCare",
    "AutomotiveBusiness",
    "AutoRepair",
    "CarDealer",
    "CarRental",
    "RealEstateAgent",
    "ProfessionalService",
    "LegalService",
    "AccountingService",
    "ITService",
    "FinancialService",
    "NonprofitOrganization",
    "EducationalOrganization",
    "School",
    "University",
    "PlaceOfWorship",
    "GovernmentOrganization",
  ];

  // Comprehensive conditional fields
  const conditionalFields = {
    Restaurant: [
      "servesCuisine",
      "menuUrl",
      "acceptsReservations",
      "priceRange",
      "openingHours",
      "paymentAccepted",
      "hasMenu",
    ],
    CafeOrCoffeeShop: [
      "servesCuisine",
      "menuUrl",
      "priceRange",
      "openingHours",
      "paymentAccepted",
      "acceptsReservations",
    ],
    Bakery: [
      "servesCuisine",
      "menuUrl",
      "priceRange",
      "openingHours",
      "paymentAccepted",
    ],
    BarOrPub: [
      "servesCuisine",
      "menuUrl",
      "priceRange",
      "openingHours",
      "paymentAccepted",
      "acceptsReservations",
    ],
    NightClub: [
      "openingHours",
      "priceRange",
      "paymentAccepted",
      "acceptsReservations",
    ],
    Store: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    RetailStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    ClothingStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    GroceryStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    HardwareStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    BookStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    ElectronicsStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    JewelryStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    FurnitureStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    HomeGoodsStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    SportingGoodsStore: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    HealthAndBeautyBusiness: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    HairSalon: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    Spa: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    Gym: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    MedicalBusiness: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "medicalSpecialty",
    ],
    Dentist: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "medicalSpecialty",
    ],
    Physician: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "medicalSpecialty",
    ],
    VeterinaryCare: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "medicalSpecialty",
    ],
    AutomotiveBusiness: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    AutoRepair: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    CarDealer: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    CarRental: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
      "hasOfferCatalog",
    ],
    RealEstateAgent: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    ProfessionalService: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    LegalService: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    AccountingService: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    ITService: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    FinancialService: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
    NonprofitOrganization: [
      "openingHours",
      "donationUrl",
      "volunteerUrl",
      "mission",
      "taxID",
      "nonprofitStatus",
    ],
    EducationalOrganization: ["openingHours", "email", "telephone", "address"],
    School: ["openingHours", "email", "telephone", "address"],
    University: ["openingHours", "email", "telephone", "address"],
    PlaceOfWorship: ["openingHours", "email", "telephone", "address"],
    GovernmentOrganization: ["openingHours", "email", "telephone", "address"],
    LocalBusiness: [
      "openingHours",
      "paymentAccepted",
      "priceRange",
      "currenciesAccepted",
    ],
  };

  // Determine if a field should be displayed for the current subtype
  const showField = (field) => {
    const subtypeFields = conditionalFields[data.businessType] || [];
    return subtypeFields.includes(field);
  };

  return (
    <form className="schema-form schema-localbusiness">
      {/* Core Fields */}
      <label>
        Business Name *
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </label>

      <label>
        Business URL
        <input
          type="url"
          value={data.url || ""}
          onChange={(e) => handleChange("url", e.target.value)}
        />
      </label>

      <label>
        Logo URL
        <input
          type="url"
          value={data.logo || ""}
          onChange={(e) => handleChange("logo", e.target.value)}
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
        Telephone
        <input
          type="tel"
          value={data.telephone || ""}
          onChange={(e) => handleChange("telephone", e.target.value)}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={data.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </label>

      <label>
        Address
        <input
          type="text"
          value={data.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </label>

      <label>
        Business Type
        <select
          value={data.businessType || "LocalBusiness"}
          onChange={(e) => handleChange("businessType", e.target.value)}
        >
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      {/* Conditional fields */}
      {showField("servesCuisine") && (
        <label>
          Serves Cuisine
          <input
            type="text"
            value={data.servesCuisine || ""}
            onChange={(e) => handleChange("servesCuisine", e.target.value)}
          />
        </label>
      )}

      {showField("menuUrl") && (
        <label>
          Menu URL
          <input
            type="url"
            value={data.menuUrl || ""}
            onChange={(e) => handleChange("menuUrl", e.target.value)}
          />
        </label>
      )}

      {showField("acceptsReservations") && (
        <label>
          Accepts Reservations
          <input
            type="text"
            value={data.acceptsReservations || ""}
            onChange={(e) =>
              handleChange("acceptsReservations", e.target.value)
            }
            placeholder="Yes / No / Phone / Online"
          />
        </label>
      )}

      {showField("openingHours") && (
        <label>
          Opening Hours
          <input
            type="text"
            value={data.openingHours || ""}
            onChange={(e) => handleChange("openingHours", e.target.value)}
            placeholder="Mo-Fr 09:00-17:00"
          />
        </label>
      )}

      {showField("paymentAccepted") && (
        <label>
          Payment Accepted
          <input
            type="text"
            value={data.paymentAccepted || ""}
            onChange={(e) => handleChange("paymentAccepted", e.target.value)}
            placeholder="Cash, Credit Card, etc."
          />
        </label>
      )}

      {showField("priceRange") && (
        <label>
          Price Range
          <input
            type="text"
            value={data.priceRange || ""}
            onChange={(e) => handleChange("priceRange", e.target.value)}
            placeholder="$, $$, $$$"
          />
        </label>
      )}

      {showField("currenciesAccepted") && (
        <label>
          Currencies Accepted
          <input
            type="text"
            value={data.currenciesAccepted || ""}
            onChange={(e) => handleChange("currenciesAccepted", e.target.value)}
            placeholder="USD, EUR, VND, etc."
          />
        </label>
      )}

      {showField("hasOfferCatalog") && (
        <label>
          Has Offer Catalog
          <input
            type="text"
            value={data.hasOfferCatalog || ""}
            onChange={(e) => handleChange("hasOfferCatalog", e.target.value)}
            placeholder="Catalog URL or ID"
          />
        </label>
      )}

      {showField("medicalSpecialty") && (
        <label>
          Medical Specialty
          <input
            type="text"
            value={data.medicalSpecialty || ""}
            onChange={(e) => handleChange("medicalSpecialty", e.target.value)}
          />
        </label>
      )}

      {showField("donationUrl") && (
        <label>
          Donation URL
          <input
            type="url"
            value={data.donationUrl || ""}
            onChange={(e) => handleChange("donationUrl", e.target.value)}
          />
        </label>
      )}

      {showField("volunteerUrl") && (
        <label>
          Volunteer URL
          <input
            type="url"
            value={data.volunteerUrl || ""}
            onChange={(e) => handleChange("volunteerUrl", e.target.value)}
          />
        </label>
      )}

      {showField("mission") && (
        <label>
          Mission
          <textarea
            value={data.mission || ""}
            onChange={(e) => handleChange("mission", e.target.value)}
          />
        </label>
      )}

      {showField("taxID") && (
        <label>
          Tax ID / Charity Number
          <input
            type="text"
            value={data.taxID || ""}
            onChange={(e) => handleChange("taxID", e.target.value)}
          />
        </label>
      )}

      {showField("nonprofitStatus") && (
        <label>
          Nonprofit Status
          <input
            type="text"
            value={data.nonprofitStatus || ""}
            onChange={(e) => handleChange("nonprofitStatus", e.target.value)}
          />
        </label>
      )}

      <label>
        Social Profiles (comma separated)
        <input
          type="text"
          value={data.sameAs || ""}
          onChange={(e) => handleChange("sameAs", e.target.value)}
        />
      </label>
    </form>
  );
}

/**
 * JSON-LD builder for LocalBusiness (fully dynamic)
 */
export function buildLocalBusinessJson(data) {
  if (!data?.name) return null;

  const sameAsArray = data.sameAs
    ? data.sameAs
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : undefined;

  const json = {
    "@context": "https://schema.org",
    "@type": data.businessType || "LocalBusiness",
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    telephone: data.telephone,
    email: data.email,
    ...(data.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: data.address,
      },
    }),
    ...(data.servesCuisine && { servesCuisine: data.servesCuisine }),
    ...(data.menuUrl && { menu: data.menuUrl }),
    ...(data.acceptsReservations && {
      acceptsReservations: data.acceptsReservations,
    }),
    ...(data.openingHours && { openingHours: data.openingHours }),
    ...(data.paymentAccepted && { paymentAccepted: data.paymentAccepted }),
    ...(data.priceRange && { priceRange: data.priceRange }),
    ...(data.currenciesAccepted && {
      currenciesAccepted: data.currenciesAccepted,
    }),
    ...(data.hasOfferCatalog && { hasOfferCatalog: data.hasOfferCatalog }),
    ...(data.medicalSpecialty && { medicalSpecialty: data.medicalSpecialty }),
    ...(data.donationUrl && { donationUrl: data.donationUrl }),
    ...(data.volunteerUrl && { volunteerUrl: data.volunteerUrl }),
    ...(data.mission && { mission: data.mission }),
    ...(data.taxID && { taxID: data.taxID }),
    ...(data.nonprofitStatus && { nonprofitStatus: data.nonprofitStatus }),
    ...(sameAsArray && { sameAs: sameAsArray }),
  };

  return json;
}
