import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./components/Dashboard";
import SettingsProvider from "./providers/SettingsProvider";
import "../css/admin.scss";

console.log("🚀 SEO Plugin React Dashboard Loading...");

// Check if we have the data we need
if (typeof seoPluginData !== "undefined") {
  console.log("✅ Plugin data received:", seoPluginData);
} else {
  console.log("❌ No plugin data - check wp_localize_script");
}

// WordPress provides this div in the admin page
const container = document.getElementById("seo-plugin-admin");
if (container) {
  console.log("✅ Found container element");

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <SettingsProvider>
        <Dashboard />
      </SettingsProvider>
    </StrictMode>
  );

  console.log("✅ React Dashboard mounted!");
} else {
  console.log("❌ Container element not found");
}
