import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./components/Dashboard";
import SettingsProvider from "./providers/SettingsProvider";
import "../css/admin.scss";

// WordPress provides this div in the admin page
const container = document.getElementById("seo-plugin-admin");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <SettingsProvider>
        <Dashboard />
      </SettingsProvider>
    </StrictMode>
  );
} else {
  alert("Container element not found... My bad.");
}
