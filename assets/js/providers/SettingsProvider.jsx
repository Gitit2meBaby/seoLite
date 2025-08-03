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
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoadingSettings(true);

      if (!apiUrl) {
        // Fallback to mock data if no API
        setSettings({
          site_title: "My WordPress Site",
          site_description: "Just another WordPress site",
        });
        setIsLoadingSettings(false);
        return;
      }

      const response = await fetch(`${apiUrl}settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data || {});
      } else {
        console.error("Failed to load settings:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setIsSaving(true);

      if (!apiUrl) {
        // Mock save for development
        setSettings(newSettings);
        return { success: true };
      }

      const response = await fetch(`${apiUrl}settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
        body: JSON.stringify(newSettings),
      });

      const result = await response.json();

      if (result.success) {
        setSettings(newSettings);
      }

      return result;
    } catch (error) {
      console.error("Error saving settings:", error);
      return { success: false, message: "Network error" };
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const value = {
    settings,
    isLoadingSettings,
    isSaving,
    updateSetting,
    saveSettings,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
