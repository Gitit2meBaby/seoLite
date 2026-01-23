import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import SettingsProvider from "./providers/SettingsProvider";
import "../css/admin.scss";

// Main App component with Homepage → Dashboard flow
function App() {
  // Start by showing Homepage
  // User can click "Get Started" to see Dashboard
  const [showDashboard, setShowDashboard] = useState(false);

  const handleGetStarted = () => {
    setShowDashboard(true);
  };

  return (
    <SettingsProvider>
      {showDashboard ? (
        <Dashboard />
      ) : (
        <Homepage onGetStarted={handleGetStarted} />
      )}
    </SettingsProvider>
  );
}

// WordPress provides this div in the admin page
const container = document.getElementById("seo-plugin-admin");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  alert("Container element not found... My bad.");
}
