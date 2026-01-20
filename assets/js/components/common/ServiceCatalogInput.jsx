// assets/js/components/common/ServiceCatalogInput.jsx
import { useState } from "react";
import { serviceOptions } from "../tabs/schemaTypes";
import styles from "@css/components/tabs/GeneralMeta.module.scss";

const ServiceCatalogInput = ({
  value = [],
  onChange,
  schemaType,
  className,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    serviceType: "",
    areaServed: "",
  });

  // Get appropriate service options based on schema type
  const getServiceOptions = () => {
    switch (schemaType) {
      case "Restaurant":
        return serviceOptions.restaurant || serviceOptions.general;
      case "Store":
        return serviceOptions.store || serviceOptions.general;
      case "LocalBusiness":
        return serviceOptions.professional || serviceOptions.general;
      case "Organization":
        return serviceOptions.general;
      case "Service":
        return serviceOptions.professional || serviceOptions.general;
      case "MedicalOrganization":
      case "Hospital":
      case "Clinic":
        return serviceOptions.healthcare || serviceOptions.general;
      case "EducationalOrganization":
      case "School":
      case "University":
        return serviceOptions.education || serviceOptions.general;
      default:
        return serviceOptions.general;
    }
  };

  const addService = () => {
    if (!newService.name.trim()) return;

    const serviceToAdd = {
      ...newService,
      isInherited: false, // New services are never inherited
    };

    onChange([...value, serviceToAdd]);

    // Reset form
    setNewService({
      name: "",
      description: "",
      serviceType: "",
      areaServed: "",
    });
    setShowAddForm(false);
  };

  const removeService = (index) => {
    const updatedServices = value.filter((_, i) => i !== index);
    onChange(updatedServices);
  };

  const updateService = (index, field, newValue) => {
    const updatedServices = value.map((service, i) => {
      if (i === index) {
        return {
          ...service,
          [field]: newValue,
        };
      }
      return service;
    });
    onChange(updatedServices);
  };

  return (
    <div className={`${styles.serviceArray} ${className}`}>
      <div className={styles.serviceList}>
        {value.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            No services configured yet.
          </p>
        ) : (
          value.map((service, index) => (
            <div
              key={index}
              className={`${styles.serviceItem} ${
                service.isInherited ? styles.inheritedService : ""
              }`}
            >
              <div className={styles.serviceHeader}>
                <h4 className={styles.serviceName}>
                  {service.name || "Unnamed Service"}
                  {service.isInherited && (
                    <span className={styles.inheritedBadge}>
                      Inherited from Global
                    </span>
                  )}
                </h4>
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className={styles.removeServiceButton}
                  title={
                    service.isInherited
                      ? "Remove this inherited service from this page"
                      : "Delete this service"
                  }
                >
                  🗑️
                </button>
              </div>

              <div className={styles.serviceFields}>
                <div className={styles.serviceField}>
                  <label>Service Name:</label>
                  <input
                    type="text"
                    value={service.name || ""}
                    onChange={(e) =>
                      updateService(index, "name", e.target.value)
                    }
                    placeholder="Enter service name"
                    disabled={service.isInherited}
                    className={service.isInherited ? styles.disabledInput : ""}
                  />
                </div>

                <div className={styles.serviceField}>
                  <label>Description:</label>
                  <textarea
                    value={service.description || ""}
                    onChange={(e) =>
                      updateService(index, "description", e.target.value)
                    }
                    placeholder="Describe this service"
                    disabled={service.isInherited}
                    className={service.isInherited ? styles.disabledInput : ""}
                    rows={2}
                  />
                </div>

                <div className={styles.serviceField}>
                  <label>Service Type:</label>
                  <select
                    value={service.serviceType || ""}
                    onChange={(e) =>
                      updateService(index, "serviceType", e.target.value)
                    }
                    disabled={service.isInherited}
                    className={service.isInherited ? styles.disabledInput : ""}
                  >
                    <option value="">Select service type</option>
                    {getServiceOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.serviceField}>
                  <label>Area Served:</label>
                  <input
                    type="text"
                    value={service.areaServed || ""}
                    onChange={(e) =>
                      updateService(index, "areaServed", e.target.value)
                    }
                    placeholder="Geographic area (e.g., 'New York', 'Nationwide')"
                    disabled={service.isInherited}
                    className={service.isInherited ? styles.disabledInput : ""}
                  />
                </div>
              </div>

              {service.isInherited && (
                <div className={styles.inheritedNote}>
                  💡 This service is inherited from Global settings. You can
                  remove it from this page using the trash button, or edit it in
                  the Global settings.
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showAddForm ? (
        <div className={styles.addServiceForm}>
          <h4>Add New Service</h4>

          <div className={styles.serviceField}>
            <label>Service Name:</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              placeholder="Enter service name"
            />
          </div>

          <div className={styles.serviceField}>
            <label>Description:</label>
            <textarea
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              placeholder="Describe this service"
              rows={2}
            />
          </div>

          <div className={styles.serviceField}>
            <label>Service Type:</label>
            <select
              value={newService.serviceType}
              onChange={(e) =>
                setNewService({ ...newService, serviceType: e.target.value })
              }
            >
              <option value="">Select service type</option>
              {getServiceOptions().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.serviceField}>
            <label>Area Served:</label>
            <input
              type="text"
              value={newService.areaServed}
              onChange={(e) =>
                setNewService({ ...newService, areaServed: e.target.value })
              }
              placeholder="Geographic area (e.g., 'New York', 'Nationwide')"
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={addService}
              className={styles.saveServiceButton}
              disabled={!newService.name.trim()}
            >
              Add Service
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewService({
                  name: "",
                  description: "",
                  serviceType: "",
                  areaServed: "",
                });
              }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className={styles.addServiceButton}
        >
          + Add Service
        </button>
      )}
    </div>
  );
};

export default ServiceCatalogInput;
