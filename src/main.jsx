import React from "react";
import { createRoot } from "react-dom/client";
import App from "@/app/App.jsx";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

// Automatically reload the page if a dynamically imported module fails to load (usually due to a new deployment)
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
