import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import i18n from "./i18n/i18n";

// Set initial HTML lang attribute
document.documentElement.lang = i18n.getLanguage();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
