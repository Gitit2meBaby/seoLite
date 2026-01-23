// assets/js/providers/SettingsProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Get WordPress API data
  const wpData = window.seoPluginData || {};
  const apiUrl = wpData.apiUrl;
  const nonce = wpData.nonce;

  useEffect(() => {
    loadSettings();

    // Check if we have a page_id URL parameter (from meta box edit button)
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get("page_id");
    if (pageId) {
      loadPageSettings(pageId);
    }
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoadingSettings(true);

      if (!apiUrl) {
        // Fallback to mock data if no API
        setSettings({
          page_global: {
            meta_title: "My WordPress Site",
            meta_description: "Just another WordPress site",
            robots_index: "index",
            robots_follow: "follow",
          },
        });
        setIsLoadingSettings(false);
        return;
      }

      // Load global settings by default
      const response = await fetch(`${apiUrl}meta/global`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          page_global: data.data || {},
        });
      } else {
        console.error("Failed to load settings:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  /**
   * Load settings for a specific page
   */
  const loadPageSettings = async (pageId) => {
    try {
      if (!apiUrl) {
        // Mock data for development
        return {
          meta_title: `Sample title for page ${pageId}`,
          meta_description: `Sample description for page ${pageId}`,
          robots_index: "index",
          robots_follow: "follow",
        };
      }

      const response = await fetch(`${apiUrl}meta/${pageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Update settings state with this page's settings
        setSettings((prev) => ({
          ...prev,
          [`page_${pageId}`]: data.data || {},
        }));

        return data.data || {};
      } else {
        console.error("Failed to load page settings:", response.statusText);
        return {};
      }
    } catch (error) {
      console.error("Error loading page settings:", error);
      return {};
    }
  };

  /**
   * Load all available pages for the dropdown
   */
  const loadPages = async () => {
    try {
      if (!apiUrl) {
        console.warn("⚠️ No API URL available, returning minimal pages");
        return [{ id: "global", title: "Global Defaults", type: "global" }];
      }

      const response = await fetch(`${apiUrl}pages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.data) {
          return data.data;
        } else {
          console.warn("⚠️ API returned unsuccessful response:", data);
          return [{ id: "global", title: "Global Defaults", type: "global" }];
        }
      } else {
        console.error(
          "❌ API request failed:",
          response.status,
          response.statusText,
        );
        return [{ id: "global", title: "Global Defaults", type: "global" }];
      }
    } catch (error) {
      console.error("❌ Network error loading pages:", error);
      return [{ id: "global", title: "Global Defaults", type: "global" }];
    }
  };

  /**
   * Save settings for a specific page
   */
  const savePageSettings = async (pageId, pageSettings) => {
    try {
      setIsSaving(true);

      if (!apiUrl) {
        // Mock save for development
        setSettings((prev) => ({
          ...prev,
          [`page_${pageId}`]: pageSettings,
        }));
        return { success: true };
      }

      const response = await fetch(`${apiUrl}meta/${pageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
        body: JSON.stringify(pageSettings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP Error:", response.status, response.statusText);
        console.error("❌ Error body:", errorText);
        return {
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}. ${errorText}`,
        };
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setSettings((prev) => ({
          ...prev,
          [`page_${pageId}`]: pageSettings,
        }));
      } else {
        console.error("❌ API returned error:", result);
      }

      return result;
    } catch (error) {
      console.error("❌ Network/Parse error:", error);
      return {
        success: false,
        message: `Network error: ${error.message}`,
      };
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Legacy function for backward compatibility
   */
  const saveSettings = async (newSettings) => {
    // Find which page settings have changed and save them individually
    const promises = [];

    for (const [key, value] of Object.entries(newSettings)) {
      if (key.startsWith("page_")) {
        const pageId = key.replace("page_", "");
        promises.push(savePageSettings(pageId, value));
      }
    }

    const results = await Promise.all(promises);
    const allSuccessful = results.every((result) => result.success);

    return {
      success: allSuccessful,
      message: allSuccessful
        ? "All settings saved"
        : "Some settings failed to save",
    };
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const value = {
    // Legacy API
    settings,
    isLoadingSettings,
    isSaving,
    updateSetting,
    saveSettings,
    loadSettings,

    // New page-specific API
    loadPageSettings,
    savePageSettings,
    loadPages,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
