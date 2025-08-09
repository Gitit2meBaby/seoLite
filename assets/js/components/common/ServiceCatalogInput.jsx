// assets/js/components/common/ServiceCatalogInput.jsx
import { useState } from "react";
import styles from "@css/components/tabs/GeneralMeta.module.scss";

const ServiceCatalogInput = ({
  value = [],
  onChange,
  schemaType = "Organization",
  className = "",
}) => {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    serviceType: "",
    areaServed: "",
  });

  // Service options based on schema type
  const getServiceOptions = () => {
    const servicesByType = {
      Restaurant: [
        "Dine-in Service",
        "Takeout Service",
        "Delivery Service",
        "Catering Service",
        "Private Event Hosting",
        "Buffet Service",
        "Drive-through Service",
        "Outdoor Dining",
        "Live Entertainment",
        "Wine Tasting",
      ],
      Store: [
        "In-store Shopping",
        "Online Shopping",
        "Curbside Pickup",
        "Home Delivery",
        "Personal Shopping Assistant",
        "Gift Wrapping Service",
        "Product Assembly",
        "Returns & Exchanges",
        "Loyalty Program",
        "Product Consultation",
      ],
      LocalBusiness: [
        "Consultation Services",
        "Installation Service",
        "Maintenance Service",
        "Repair Service",
        "Customer Support",
        "Training Services",
        "Emergency Service",
        "Home Visits",
        "Warranty Service",
        "Custom Solutions",
      ],
      Organization: [
        "Professional Consulting",
        "Project Management",
        "Strategic Planning",
        "Training & Development",
        "Technical Support",
        "Research Services",
        "Advisory Services",
        "Implementation Services",
        "Maintenance Services",
        "Custom Development",
      ],
    };

    return servicesByType[schemaType] || servicesByType.Organization;
  };

  const handleAddService = () => {
    if (!newService.name.trim()) return;

    const serviceToAdd = {
      "@type": "Service",
      name: newService.name.trim(),
      description: newService.description.trim() || undefined,
      serviceType: newService.serviceType || undefined,
      areaServed: newService.areaServed.trim() || undefined,
    };

    // Remove undefined properties
    Object.keys(serviceToAdd).forEach((key) => {
      if (serviceToAdd[key] === undefined) {
        delete serviceToAdd[key];
      }
    });

    const updatedServices = [...value, serviceToAdd];
    onChange(updatedServices);

    // Reset form
    setNewService({
      name: "",
      description: "",
      serviceType: "",
      areaServed: "",
    });
  };

  const handleRemoveService = (index) => {
    const updatedServices = value.filter((_, i) => i !== index);
    onChange(updatedServices);
  };

  const handleServiceChange = (index, field, newValue) => {
    const updatedServices = [...value];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: newValue,
    };
    onChange(updatedServices);
  };

  const serviceOptions = getServiceOptions();

  return (
    <div className={`${className}`}>
      {/* Existing Services List */}
      {value.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <h5
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Current Services ({value.length}):
          </h5>
          {value.map((service, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "12px",
                marginBottom: "8px",
                background: "#f9f9f9",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() => handleRemoveService(index)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Remove service"
              >
                ×
              </button>

              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  Service Name:
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={service.name || ""}
                  onChange={(e) =>
                    handleServiceChange(index, "name", e.target.value)
                  }
                  placeholder="Service name"
                  style={{ width: "calc(100% - 40px)" }}
                />
              </div>

              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  Description (optional):
                </label>
                <textarea
                  className={styles.textarea}
                  value={service.description || ""}
                  onChange={(e) =>
                    handleServiceChange(index, "description", e.target.value)
                  }
                  placeholder="Describe this service"
                  rows={2}
                  style={{ width: "calc(100% - 40px)" }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginBottom: "4px",
                    }}
                  >
                    Service Type:
                  </label>
                  <select
                    className={styles.select}
                    value={service.serviceType || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "serviceType", e.target.value)
                    }
                    style={{ width: "100%" }}
                  >
                    <option value="">Select type</option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "500",
                      marginBottom: "4px",
                    }}
                  >
                    Area Served:
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={service.areaServed || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "areaServed", e.target.value)
                    }
                    placeholder="e.g., New York City"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Service Form */}
      <div
        style={{
          border: "2px dashed #0073aa",
          borderRadius: "4px",
          padding: "16px",
          background: "#f0f8ff",
        }}
      >
        <h5
          style={{
            margin: "0 0 1rem 0",
            fontSize: "14px",
            fontWeight: "600",
            color: "#0073aa",
          }}
        >
          ➕ Add New Service/Product:
        </h5>

        <div style={{ marginBottom: "12px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              marginBottom: "4px",
            }}
          >
            Service Name: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
            placeholder="Enter service name"
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              marginBottom: "4px",
            }}
          >
            Description (optional):
          </label>
          <textarea
            className={styles.textarea}
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
            placeholder="Describe what this service includes"
            rows={2}
            style={{ width: "100%" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                marginBottom: "4px",
              }}
            >
              Service Type:
            </label>
            <select
              className={styles.select}
              value={newService.serviceType}
              onChange={(e) =>
                setNewService({ ...newService, serviceType: e.target.value })
              }
              style={{ width: "100%" }}
            >
              <option value="">Select type</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "500",
                marginBottom: "4px",
              }}
            >
              Area Served:
            </label>
            <input
              type="text"
              className={styles.input}
              value={newService.areaServed}
              onChange={(e) =>
                setNewService({ ...newService, areaServed: e.target.value })
              }
              placeholder="e.g., Nationwide, NYC, etc."
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddService}
          disabled={!newService.name.trim()}
          style={{
            background: newService.name.trim() ? "#0073aa" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: newService.name.trim() ? "pointer" : "not-allowed",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          ➕ Add Service
        </button>
      </div>

      {value.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          No services added yet. Use the form above to add your first service.
        </div>
      )}
    </div>
  );
};

export default ServiceCatalogInput;
